#! /usr/bin/env python3

from peewee import SqliteDatabase
import os
import shutil
from datetime import date
import sys

from database import Degree, Participant, Chair, Course


DBPATH = os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    'database.sqlite',
)

if os.path.isfile(DBPATH):
    if input('Do you want to create a backup? [y]/N: ') in ['y', '']:
        shutil.copyfile(DBPATH,
                        os.path.splitext(DBPATH)[0] + '-backup-'
                        + str(date.today()) + '.sqlite')
    if input('File already existing, '
             'do you want to overwrite it? [y]/N: ') in ['y', '']:
        os.remove(DBPATH)
    else:
        sys.exit(0)

db = SqliteDatabase(DBPATH)
db.connect()

db.create_tables([Participant, Degree, Chair, Course], safe=True)

for d in ['Bachelor', 'Master', 'Doktor']:
    Degree.create(name=d)

for c in ['Physik', 'Medizinphysik', 'Lehramt']:
    Course.create(name=c)

for c in ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'T1', 'T2', 'T3', 'T4',
          'BP', 'Extern']:
    Chair.create(name=c)

db.close()
