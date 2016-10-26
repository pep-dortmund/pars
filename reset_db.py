#! /usr/bin/env python3

from peewee import SqliteDatabase
import os


DBPATH = os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    'database.sqlite',
)

if os.path.isfile(DBPATH):
    os.remove(DBPATH)

db = SqliteDatabase(DBPATH)
db.connect()

from database import Degree, Participant, Chair
db.create_tables([Participant, Degree, Chair], safe=True)

for d in ['Bachelor', 'Master', 'Doktor']:
    Degree.create(name=d)

for c in ['E1', 'E2', 'E3', 'E4', 'E5', 'T1', 'T2', 'T3', 'T4',
          'Beschleunigerphysik', 'Medizinphysik', 'Isas']:
    Chair.create(name=c)

db.close()
