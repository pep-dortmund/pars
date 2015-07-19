#! /usr/bin/env python3
from flask import (Flask,
                   render_template,
                   send_from_directory,
                   jsonify)
from database import Participant, Degree
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
        flash(render_template('generic', message='Mailserver Error.'))


@parsapp.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@parsapp.route('/templates/<path:path>')
def templates(path):
    return send_from_directory('templates', path)


if __name__ == '__main__':
    parsapp.run(debug=True)
