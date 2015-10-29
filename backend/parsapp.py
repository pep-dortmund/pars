#! /usr/bin/env python3
from flask import (Flask,
                   render_template,
                   flash)
from database import Participant, Degree
from peewee import IntegrityError, fn
from email.mime.text import MIMEText
import smtplib
from config import MAIL_ADDRESS, MAIL_SERVER, MAIL_LOGIN, MAIL_PASSWORD

parsapp = Flask(__name__)
parsapp.secret_key = 'ABC'


def sendmail(participant, template='email.html'):
    message = render_template(template, participant=participant)
    msg = MIMEText(message, 'html')
    msg['From'] = MAIL_ADDRESS
    msg['To'] = participant.email
    msg['Subject'] = 'Anmeldung zur Absolventenfeier'
    try:
        s = smtplib.SMTP(MAIL_SERVER)
        s.starttls()
        s.login(MAIL_LOGIN, MAIL_PASSWORD)
        s.sendmail(MAIL_ADDRESS, [participant.email], msg.as_string())
        s.quit()
    except:
        flash(render_template('generic', message='Mailserver Error.'))


@parsapp.route('/', methods=['GET'])
def index():
    return 'index'


@parsapp.route('/post/', methods=['POST'])
def post():
    return 'post'


if __name__ == '__main__':
    parsapp.run(debug=True)
