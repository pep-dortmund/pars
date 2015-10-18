from peewee import (SqliteDatabase,
                    Model,
                    CharField,
                    IntegerField,
                    ForeignKeyField)
import os
from config import DevelopmentConfig

ALLOWED_MAIL_SERVER = DevelopmentConfig.ALLOWED_MAIL_SERVER

DBPATH = os.path.join(os.path.dirname(os.path.realpath(__file__)),
                      'database.sqlite')
db = SqliteDatabase(DBPATH)


class Degree(Model):
    name = CharField()

    def __repr__(self):
        return self.name

    class Meta:
        database = db


class Participant(Model):
    firstname = CharField()
    lastname = CharField()
    email = CharField(unique=True)
    guests = IntegerField()
    degree = ForeignKeyField(Degree)
    token = CharField()
    title = CharField()

    def generate_token():
        import hashlib
        import random
        return hashlib.sha1(str(random.random()).encode('utf-8')).hexdigest()

    def __repr__(self):
        return self.email

    class Meta:
        database = db

db.connect()
