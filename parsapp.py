#! /usr/bin/env python3
from flask import (Flask,
                   render_template,
                   send_from_directory,
                   jsonify,
                   request,
                   make_response)
from database import Participant, Degree
from peewee import IntegrityError
from email.mime.text import MIMEText
import smtplib
from config import (MAIL_ADDRESS,
                    MAIL_SERVER,
                    MAIL_LOGIN,
                    MAIL_PASSWORD,
                    MAIL_PORT,
                    ALLOWED_MAIL_SERVER)


parsapp = Flask(__name__)
parsapp.secret_key = 'ABC'


def sendmail(participant, template='email.html'):
    message = render_template(template, participant=participant)
    msg = MIMEText(message, 'html')
    msg['From'] = MAIL_ADDRESS
    msg['To'] = participant._email
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
        if function == 'degrees':
            degrees = {}
            for d in Degree.select():
                degrees[str(d.id)] = {'id': d.id, 'name': d.name}
            return jsonify(**degrees)

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

        return ''


@parsapp.route('/templates/<path:path>')
def templates(path):
    return send_from_directory('templates', path)


if __name__ == '__main__':
    parsapp.run(debug=True)
