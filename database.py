from peewee import (SqliteDatabase,
                    Model,
                    CharField,
                    IntegerField,
                    ForeignKeyField)
import os

db = SqliteDatabase(os.path.realpath(os.path.dirname(__file__)
                    + '/database.sqlite'))


class Degree(Model):
    name = CharField()

    class Meta:
        database = db


class Participant(Model):
    firstname = CharField()
    lastname = CharField()
    email = CharField(unique=True)
    numberOfGuests = IntegerField()
    degree = ForeignKeyField(Degree)

    class Meta:
        database = db

db.connect()
db.create_tables([Participant, Degree], safe=True)
