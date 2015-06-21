#! /usr/bin/env python3
from flask import (Flask,
                   render_template,
                   url_for,
                   request,
                   make_response)
from database import Participant, Degree
from peewee import IntegrityError, fn
from email.mime.text import MIMEText
import smtplib
from config import MAIL_ADDRESS, MAIL_SERVER, MAIL_LOGIN, MAIL_PASSWORD

parsapp = Flask(__name__)


@parsapp.route('/')
def index():
    return render_template('index.html')


@parsapp.route('/edit/<int:participant_id>!<token>')
def edit(participant_id, token):
    participant = Participant.get(Participant.id == participant_id)
    return participant


@parsapp.route('/post/', methods=['POST'])
def post():
    try:
        degree, created = Degree.get_or_create(name=request.form.get('degree'))
        participant_id = Participant.create(
            firstname=request.form.get('firstname'),
            lastname=request.form.get('lastname'),
            email=request.form.get('email'),
            degree=degree,
            numberOfGuests=request.form.get('numberOfGuests'),
        )
        participant = Participant.get(Participant.id == participant_id)
        message = render_template('email.html')
        msg = MIMEText(message)
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
            return make_response('Error!')
        return str(participant_id)
    except IntegrityError:
        return make_response('Diese Email wurde bereits eingetragen. '
                             'Du solltest eine Bestätigungsmail in Deinem '
                             'Postfach finden, in der ein Link zur Änderung '
                             'Deiner Daten aufgeführt ist.',
                             400)


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
