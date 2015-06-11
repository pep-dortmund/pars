#! /usr/bin/env python3
from flask import (Flask,
                   render_template,
                   url_for,
                   request,
                   make_response)
from database import Participant, Degree
from peewee import IntegrityError, fn

parsapp = Flask(__name__)


@parsapp.route('/')
def index():


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
        return str(participant_id)
    except IntegrityError:
        return make_response('Diese Email wurde bereits eingetragen. '
                             'Du solltest eine Bestätigungsmail in Deinem '
                             'Postfach finden, in der ein Link zur Änderung '
                             'Deiner Daten aufgeführt ist.',
                             400)

if __name__ == '__main__':
    parsapp.run(debug=True)
