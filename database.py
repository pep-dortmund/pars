from peewee import (SqliteDatabase,
                    Model,
                    CharField,
                    IntegerField,
                    BooleanField,
                    DateTimeField,
                    ForeignKeyField)
import os
from config import DevelopmentConfig
from datetime import datetime

ALLOWED_MAIL_SERVER = DevelopmentConfig.ALLOWED_MAIL_SERVER

DBPATH = os.environ.get(
    'PARS_DBPATH',
    os.path.join(
        os.path.dirname(os.path.realpath(__file__)),
        'database.sqlite'
    )
)
db = SqliteDatabase(DBPATH)


class BaseModel(Model):

    class Meta:
        database = db


class Degree(BaseModel):
    name = CharField()

    def __repr__(self):
        return self.name


class Chair(BaseModel):
    name = CharField()

    def __repr__(self):
        return self.name


class Course(BaseModel):
    name = CharField()

    def __repr__(self):
        return self.name


class Participant(BaseModel):
    def generate_token():
        import hashlib
        import random
        return hashlib.sha1(str(random.random()).encode('utf-8')).hexdigest()

    firstname = CharField()
    lastname = CharField()
    email = CharField(unique=True)
    allow_email_contact = BooleanField(default=False)
    guests = IntegerField(default=0)
    degree = ForeignKeyField(Degree)
    chair = ForeignKeyField(Chair)
    course = ForeignKeyField(Course)
    token = CharField(null=True, default=generate_token)
    title = CharField()
    verified = BooleanField(default=False)
    registration_date = DateTimeField(default=datetime.utcnow)

    def __repr__(self):
        return self.email
