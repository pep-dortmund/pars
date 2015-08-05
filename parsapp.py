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
from config import (MAIL_ADDRESS, MAIL_SERVER, MAIL_LOGIN, MAIL_PASSWORD,
                    ALLOWED_MAIL_SERVER)


parsapp = Flask(__name__)
parsapp.secret_key = 'ABC'


def sendmail(participant, template='email.html'):
    print("Sending mail to {}".format(participant._email))
    message = render_template(template, participant=participant)
    msg = MIMEText(message, 'html')
    msg['From'] = MAIL_ADDRESS
    msg['To'] = participant._email
    msg['Subject'] = 'Anmeldung zur Absolventenfeier'
    try:
        s = smtplib.SMTP(MAIL_SERVER)
        s.starttls()
        s.login(MAIL_LOGIN, MAIL_PASSWORD)
        s.sendmail(MAIL_ADDRESS, msg['To'], msg.as_string())
        s.quit()
    except:
        pass


@parsapp.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@parsapp.route('/api/', methods=['POST'])
@parsapp.route('/api/<function>/', methods=['GET'])
def api(function=None):
    if not function:
        try:
            participant = Participant(**request.get_json())
            participant.degree = Degree.get(
                Degree.id == request.get_json().get('degree')
            )
            participant.token = Participant.generate_token()
            participant.save()
            response = make_response(
                jsonify(message='Success', token=participant.token),
                200
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
        return ''


@parsapp.route('/templates/<path:path>')
def templates(path):
    return send_from_directory('templates', path)


if __name__ == '__main__':
    parsapp.run(debug=True)
