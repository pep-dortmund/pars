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
from forms import RegForm
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
    form = RegForm()
    return render_template('index.html', form=form)


@parsapp.route('/edit/<int:participant_id>!<token>', methods=['GET', 'POST'])
def edit(participant_id, token):
    try:
        participant = Participant.get(Participant.id == participant_id,
                                      Participant.token == token)
        form = RegForm(request.form, participant)
        if request.method == 'POST' and form.validate():
            form.populate_obj(participant)
            participant.save()
            flash(render_template('alerts/edit_successfull.html'))
            return redirect(url_for('index'))
        form.degree.data = participant.degree.id
        return render_template('index.html', form=form,
                               participant_id=participant_id, token=token)
    except:
        flash(render_template('alerts/no_permission.html'))
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
    form = RegForm(request.form)
    if form.validate():
        try:
            participant = Participant(
                firstname=form.firstname.data,
                lastname=form.lastname.data,
                email=form.email.data,
                token=Participant.generate_token(),
                degree=form.degree.data,
                numberOfGuests=form.numberOfGuests.data
            )
            participant.save()
            sendmail(participant)
            flash(render_template('alerts/subscription_successfull.html'))
        except IntegrityError:
            participant = Participant.get(Participant.email == form.email.data)
            flash(render_template('alerts/email_exists.html',
                  participant=participant))
    else:
        flash(render_template('alerts/alert.html',
              message=form.errors,
              type='danger'))
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
