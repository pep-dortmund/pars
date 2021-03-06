#! /usr/bin/env python3
from flask import (Flask,
                   render_template,
                   jsonify,
                   request,
                   abort,
                   make_response)
from database import Participant, Degree, Chair, Course, db
from peewee import (
    IntegrityError,
    fn,
)
from email.mime.text import MIMEText
import smtplib
from functools import wraps
import config

import os
from datetime import date

from flask_admin import Admin, AdminIndexView, expose
from flask_admin.base import MenuLink
from flask_admin.contrib.peewee import ModelView


parsapp = Flask(__name__)


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated


class AuthenticatedIndexView(AdminIndexView):
    @requires_auth
    @expose('/')
    def index(self):
        return super(AuthenticatedIndexView, self).index()

    def logout(self):
        return authenticate()


class ParticipantAdminView(ModelView):
    column_exclude_list = ['token']


admin = Admin(parsapp, name='PARS', template_mode='bootstrap3',
              index_view=AuthenticatedIndexView(name='Admin',
                                                template='admin.html'))
admin.add_view(ParticipantAdminView(Participant))
admin.add_view(ModelView(Degree))
admin.add_view(ModelView(Chair))
admin.add_view(ModelView(Course))
admin.add_link(MenuLink(name='Export CSV', endpoint='export'))
admin.add_link(MenuLink(name='Logout', endpoint='logout'))

parsapp.config.from_object('config.' + os.environ.get('PARS_CONFIG', 'DevelopmentConfig'))


def check_auth(username, password):
    """This function is called to check if a username /
    password combination is valid.
    """
    return (username == parsapp.config['ADMIN_USERNAME']
            and password == parsapp.config['ADMIN_PASSWORD'])


def authenticate():
    """Sends a 401 response that enables basic auth"""
    return make_response(
        'Could not verify your access level for that URL.\n'
        'You have to login with proper credentials', 401,
        {'WWW-Authenticate': 'Basic realm="Login Required"'}
    )


# This hook ensures that a connection is opened to handle any queries
# generated by the request.
@parsapp.before_request
def _db_connect():
    db.connect()


# This hook ensures that the connection is closed when we've finished
# processing the request.
@parsapp.teardown_request
def _db_close(exc):
    if not db.is_closed():
        db.close()


def sendmail(participant, template='email.html'):
    # the manual prefix is needed behind a (uberspace) proxy, otherwise
    # `url_for` cannot resolve the proper hostname
    message = render_template(template,
                              participant=participant,
                              date=parsapp.config['DATE'],
                              prefix=parsapp.config['MAIL_URL_PREFIX'])
    msg = MIMEText(message)
    msg['From'] = parsapp.config['MAIL_ADDRESS']
    msg['To'] = (parsapp.config['TEST_MAIL_ADDRESS']
                 if parsapp.config['DEBUG']
                 else participant.email
                 + parsapp.config['ALLOWED_MAIL_SERVER'])
    msg['Subject'] = ('Anmeldung zur Absolventenfeier am '
                      + parsapp.config['DATE'])
    try:
        if parsapp.config['MAIL_DEBUG']:
            print('Sending mail:\n'
                  + msg.get_payload(decode=True).decode('utf-8'))
        else:
            s = smtplib.SMTP(parsapp.config['MAIL_SERVER'],
                             parsapp.config['MAIL_PORT'])
            s.starttls()
            s.login(parsapp.config['MAIL_LOGIN'],
                    parsapp.config['MAIL_PASSWORD'])
            s.sendmail(parsapp.config['MAIL_ADDRESS'],
                       msg['To'], msg.as_string())
            s.quit()
    except:
        raise


def registration_active():
    return not os.path.exists('./reg_inactive')


def participant_or_404(pid, token):
    try:
        Participant.get(Participant.id == pid, Participant.token == token)
        return True
    except:
        return False


@parsapp.route('/', methods=['GET'])
@parsapp.route('/<int:participant_id>!<token>/', methods=['GET'])
def index(participant_id=None, token=None):
    if token and not participant_or_404(participant_id, token):
        return abort(404)
    else:
        return render_template('index.html', date=date)


@parsapp.route('/<int:participant_id>!<token>/verify/', methods=['GET'])
def verify(participant_id, token):
    if token and not participant_or_404(participant_id, token):
        return abort(404)
    else:
        participant = Participant.get(
            Participant.id == participant_id,
            Participant.token == token
        )
        participant.verified = True
        participant.save()
        return render_template('index.html', date=date)


@parsapp.route('/admin/', methods=['GET', 'POST'])
@requires_auth
def admin():
    return render_template('admin.html')


@parsapp.route('/admin/logout/')
def logout():
    return authenticate()


@parsapp.route('/admin/api/<function>/')
@requires_auth
def admin_api(function):
    if function == 'participants':
        parts = list(Participant.select().dicts())
        return make_response(jsonify({'participants': parts}), 200)

    elif function == 'degrees':
        degrees = list(Degree.select().dicts())
        return make_response(jsonify({'degrees': degrees}), 200)

    elif function == 'chairs':
        chairs = list(Chair.select().dicts())
        return make_response(jsonify({'chairs': chairs}), 200)

    elif function == 'courses':
        courses = list(Course.select().dicts())
        return make_response(jsonify({'courses': courses}), 200)

    elif function == 'toggle_registration':
        if registration_active():
            open('./reg_inactive', 'a').close()
        else:
            os.remove('./reg_inactive')
        return make_response(
            jsonify({
                'status': 'success',
                'registration': registration_active()
            }),
            200
        )

    elif function == 'stats':
        degrees = Degree.select()
        degree_counts = {
            d.name: d.count for d in Degree.select(
                Degree, fn.Count(Participant.id).alias('count')
            ).join(Participant).group_by(Degree)
        }
        degree_guests = {
            d.name: d.guests for d in Degree.select(
                Degree, fn.Count(Participant.guests).alias('guests')
            ).join(Participant).group_by(Degree)
        }
        stats = {
            'degree_counts': degree_counts,
            'degree_guests': degree_guests,
            'participant_count': Participant.select().count(),
            'guest_count': (Participant
                            .select(fn.SUM(Participant.guests))
                            .scalar())
        }
        return make_response(
            jsonify(stats)
        )

    abort(404)


@parsapp.route('/admin/export.csv', methods=['GET'])
@requires_auth
def export():
    participants = Participant.select()
    csv = render_template(
        'export.csv',
        participants=participants,
        mail_suffix=parsapp.config['ALLOWED_MAIL_SERVER']
    )
    response = make_response(csv)
    response.headers['Content-Disposition'] = 'attachment; filename=export.csv'
    response.mimetype = 'text/csv'
    return response


@parsapp.route('/api/', methods=['POST'])
@parsapp.route('/api/<function>/', methods=['GET', 'POST'])
def api(function=None):
    if not function:
        if not registration_active():
            return make_response(
                jsonify(errormessage='Registration disabled.'),
                401
            )
        try:
            participant = Participant(**request.get_json(force=True))
            if not request.get_json(force=True).get('validDate'):
                return make_response(
                    jsonify(errormessage='Error'),
                    400
                )
            participant.email = participant.email.lower()
            if int(participant.guests) > parsapp.config['MAXIMUM_GUESTS']:
                return make_response('Guests exceeding maximum.', 400)
            participant.save()
            response = make_response(
                jsonify(message='Success', token=participant.token),
                200
            )
            try:
                sendmail(participant)
            except:
                if not parsapp.config['DEBUG']:
                    response = make_response(
                        jsonify(errormessage='Error while mailing.'),
                        500
                    )
                else:
                    raise
        except IntegrityError:
            response = make_response(
                jsonify(errormessage='User already in Database.'),
                400
            )
        return response
    else:
        if function == 'config':
            degrees = {str(d.id): {'id': d.id, 'name': d.name}
                       for d in Degree.select()}
            chairs = {str(c.id): {'id': c.id, 'name': c.name}
                      for c in Chair.select()}
            courses = {str(c.id): {'id': c.id, 'name': c.name}
                      for c in Course.select()}
            configObj = {
                'degrees': degrees,
                'chairs': chairs,
                'courses': courses,
                'allowed_mail': parsapp.config['ALLOWED_MAIL_SERVER'],
                'maximum_guests': parsapp.config['MAXIMUM_GUESTS'],
                'registration_is_active': registration_active()
            }
            return jsonify(configObj)

        if function == 'participant':
            if not registration_active():
                return make_response(
                    jsonify(errormessage='Registration disabled.'),
                    401
                )
            p = Participant.get(id=request.args.get('participant_id'))
            if p.token == request.args.get('token'):
                pObj = {
                    'firstname': p.firstname,
                    'lastname': p.lastname,
                    'guests': p.guests,
                    'degree': p.degree.id,
                    'email': p.email,
                    'title': p.title,
                    'token': p.token,
                    'chair': p.chair.id,
                    'course': p.course.id,
                    'allow_email_contact': p.allow_email_contact,
                }
                return jsonify(pObj)
            else:
                return make_response(
                    jsonify(errormessage='No access!'),
                    401
                )

        if function == 'resend':
            try:
                p = (
                    Participant
                    .select()
                    .where(Participant.email == request.args.get('email').lower())
                    .get()
                )
                sendmail(p)
            except:
                if not parsapp.config['DEBUG']:
                    return(jsonify(errormessage='Fail'), 500)
                else:
                    raise
            return(jsonify(message='Success'), 200)

        if function == 'update':
            p = Participant.get(id=request.args.get('participant_id'))
            if p.token == request.args.get('token'):
                data = request.get_json(force=True)
                p.firstname = data['firstname']
                p.lastname = data['lastname']
                p.degree = data['degree']
                p.chair = data['chair']
                p.course = data['course']
                p.title = data['title']
                p.guests = data['guests']
                p.allow_email_contact = data['allow_email_contact']
                p.save()
                return make_response(jsonify(message='Success'), 200)
            else:
                return make_response(
                    jsonify(errormessage='No access!'),
                    401
                )

        abort(404)


if __name__ == '__main__':
    parsapp.secret_key = "eBGypMg[DSU@j$yHdnOI0}b!sKDl/m01"
    parsapp.run()
