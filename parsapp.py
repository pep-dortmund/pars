#! /usr/bin/env python3
from flask import (Flask,
                   render_template,
                   jsonify,
                   request,
                   make_response)
from database import Participant, Degree
from peewee import (IntegrityError,
                    fn)
from email.mime.text import MIMEText
import smtplib
from functools import wraps
from config import (MAIL_ADDRESS,
                    MAIL_SERVER,
                    MAIL_LOGIN,
                    MAIL_PASSWORD,
                    MAIL_PORT,
                    ALLOWED_MAIL_SERVER)


parsapp = Flask(__name__)
parsapp.secret_key = 'ABC'


def check_auth(username, password):
    """This function is called to check if a username /
    password combination is valid.
    """
    return username == 'admin' and password == 'secret'


def authenticate():
    """Sends a 401 response that enables basic auth"""
    return make_response(
        'Could not verify your access level for that URL.\n'
        'You have to login with proper credentials', 401,
        {'WWW-Authenticate': 'Basic realm="Login Required"'}
    )


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        print(auth)
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated


def sendmail(participant, template='email.html'):
    print(sendmail)
    message = render_template(template, participant=participant)
    msg = MIMEText(message, 'html')
    msg['From'] = MAIL_ADDRESS
    msg['To'] = 'kevin@kehei.de'  # participant._email
    msg['Subject'] = 'Anmeldung zur Absolventenfeier'
    try:
        s = smtplib.SMTP(MAIL_SERVER, MAIL_PORT)
        s.starttls()
        s.login(MAIL_LOGIN, MAIL_PASSWORD)
        s.sendmail(MAIL_ADDRESS, msg['To'], msg.as_string())
        s.quit()
    except:
        raise


@parsapp.route('/', methods=['GET'])
@parsapp.route('/<int:participant_id>!<token>/', methods=['GET'])
def index(participant_id=None, token=None):
    return render_template('index.html')


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
        parts = []
        for p in Participant.select():
            parts.append({
                'firstname': p.firstname,
                'lastname': p.lastname,
                'guests': p.guests,
                'email': p.email,
                'title': p.title,
                'degree': p.degree.id,
                'id': p.id
            })
        return make_response(
            jsonify({
                'participants': parts
            }),
            200
        )

    return ''


@parsapp.route('/api/', methods=['POST'])
@parsapp.route('/api/<function>/', methods=['GET', 'POST'])
def api(function=None):
    if not function:
        try:
            participant = Participant(**request.get_json(force=True))
            participant.degree = Degree.get(
                Degree.id == request.get_json(force=True).get('degree')
            )
            participant.token = Participant.generate_token()
            participant.save()
            response = make_response(
                jsonify(message='Success', token=participant.token),
                200
            )
            try:
                sendmail(participant)
            except:
                response = make_response(
                    jsonify(errormessage='Error while mailing.'),
                    500
                )
        except IntegrityError:
            response = make_response(
                jsonify(errormessage='User already in Database.'),
                400
            )
        return response
    else:
        if function == 'config':
            degrees = {}
            for d in Degree.select():
                degrees[str(d.id)] = {'id': d.id, 'name': d.name}
            config = {
                'degrees': degrees,
                'allowed_mail': ALLOWED_MAIL_SERVER,
                'maximum_guests': 10
            }
            return jsonify(config)

        if function == 'participant':
            p = Participant.get(id=request.args.get('participant_id'))
            if p.token == request.args.get('token'):
                pObj = {'firstname': p.firstname,
                        'lastname': p.lastname,
                        'guests': p.guests,
                        'degree': p.degree.id,
                        'email': p.email,
                        'title': p.title,
                        'token': p.token}
                return jsonify(pObj)
            else:
                return make_response(
                    jsonify(errormessage='No access!'),
                    401
                )

        if function == 'resend':
            try:
                p = Participant\
                    .select()\
                    .where(Participant._email
                           == request.args.get('email') + ALLOWED_MAIL_SERVER)\
                    .get()
                sendmail(p)
            except:
                return(jsonify(errormessage='Fail'), 500)
            return(jsonify(message='Success'), 200)

        if function == 'update':
            p = Participant.get(id=request.args.get('participant_id'))
            if p.token == request.args.get('token'):
                data = request.get_json(force=True)
                p.firstname = data['firstname']
                p.lastname = data['lastname']
                p.degree = data['degree']
                p.title = data['title']
                p.guests = data['guests']
                p.save()
                return make_response(jsonify(message='Success'), 200)
            else:
                return make_response(
                    jsonify(errormessage='No access!'),
                    401
                )

        if function == 'stats':
            degrees = Degree.select()
            degree_counts = {}
            for d in degrees:
                degree_counts.update(
                    {
                        d.id: (Participant.select().join(Degree)
                               .where(Degree.id == d.id).count())
                    }
                )
            stats = {
                'degree_counts': degree_counts,
                'participant_count': Participant.select().count(),
                'guest_count': (Participant
                                .select(fn.SUM(Participant.guests))
                                .scalar())
            }
            return make_response(
                jsonify(stats)
            )

        return ''


if __name__ == '__main__':
    parsapp.run(debug=True)
