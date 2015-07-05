from wtforms import (Form,
                     StringField,
                     RadioField,
                     IntegerField)
from database import Degree


class RegForm(Form):
    firstname = StringField('Vorname')
    lastname = StringField('Nachname')
    email = StringField('Email')
    degrees = [(d.name, d.name) for d in Degree.select()]
    degree = RadioField('Abschluss', choices=degrees)
    guests = IntegerField('Anz. Gäste')
