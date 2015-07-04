#! /usr/bin/env python3
from flask import (Flask,
                   render_template,
                   url_for,
                   request,
                   redirect,
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


@parsapp.route('/')
def index():
    return render_template('index.html')


@parsapp.route('/edit/<int:participant_id>!<token>')
def edit(participant_id, token):
    try:
        participant = Participant.get(Participant.id == participant_id,
                                      Participant.token == token)
        print(participant.id)
    except:
        pass
    return redirect(url_for('index'))


@parsapp.route('/resend/<int:participant_id>!<token>', methods=['GET'])
def resend(participant_id, token):
    try:
        participant = Participant.get(Participant.id == participant_id,
                                      Participant.token == token)
        sendmail(participant)
        flash(render_template('alerts/resend_successfull.html'))
    except:
        flash(render_template('alerts/no_permission.html'))
    return redirect(url_for('index'))


@parsapp.route('/post/', methods=['POST'])
def post():
    try:
        degree, created = Degree.get_or_create(name=request.form.get('degree'))
        participant_id = Participant.create(
            firstname=request.form.get('firstname'),
            lastname=request.form.get('lastname'),
            email=request.form.get('email'),
            degree=degree,
            token=Participant.generate_token(),
            numberOfGuests=request.form.get('numberOfGuests'),
        )
        participant = Participant.get(Participant.id == participant_id)
        sendmail(participant)
        flash(render_template('alerts/subscription_successfull.html'))
    except IntegrityError:
        participant = Participant.get(
            Participant.email == request.form.get('email')
        )
        print(participant.token)
        flash(render_template('alerts/email_exists.html',
              participant=participant))
    return redirect(url_for('index'))


@parsapp.route('/admin/', methods=['GET'])
def admin():
    parts = Participant.select()
    variables = {
        'parts': parts,
        'ba_count': Participant.select().join(Degree)
                               .where(Degree.name == 'ba').count(),
        'ma_count': Participant.select().join(Degree)
                               .where(Degree.name == 'ma').count(),
        'dr_count': Participant.select().join(Degree)
                               .where(Degree.name == 'dr').count(),
        'guest_count': Participant.select(fn.Sum(Participant.numberOfGuests))
                                  .scalar()
    }
    return render_template('admin.html', **variables)


@parsapp.route('/admin/delete/<pid>/', methods=['POST'])
def delete():
    return 'foo'

if __name__ == '__main__':
    parsapp.run(debug=True)
