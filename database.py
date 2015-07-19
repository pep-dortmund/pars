from peewee import (SqliteDatabase,
                    Model,
                    CharField,
                    IntegerField,
                    ForeignKeyField)
import os
from config import ALLOWED_MAIL_SERVER

DBPATH = os.path.join(os.path.dirname(os.path.realpath(__file__)),
                      'database.sqlite')
db = SqliteDatabase(DBPATH)


class Degree(Model):
    name = CharField()

    class Meta:
        database = db


class Participant(Model):
    firstname = CharField()
    lastname = CharField()
    _email = CharField(unique=True)
    numberOfGuests = IntegerField()
    degree = ForeignKeyField(Degree)
    token = CharField()

    @property
    def email(self):
        return self._email.replace(ALLOWED_MAIL_SERVER, '')

    @email.setter
    def email(self, value):
        self._email = value + ALLOWED_MAIL_SERVER

    @email.deleter
    def email(self):
        del self._email

    def generate_token():
        import hashlib
        import random
        return hashlib.sha1(str(random.random()).encode('utf-8')).hexdigest()

    class Meta:
        database = db

db.connect()
db.create_tables([Participant, Degree], safe=True)
