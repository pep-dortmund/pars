from peewee import (SqliteDatabase,
                    Model,
                    CharField,
                    IntegerField,
                    ForeignKeyField)
import os

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
    email = CharField(unique=True)
    numberOfGuests = IntegerField()
    degree = ForeignKeyField(Degree)

    class Meta:
        database = db

db.connect()
db.create_tables([Participant, Degree], safe=True)
