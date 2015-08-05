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

from database import Degree, Participant
db.create_tables([Participant, Degree], safe=True)

ba = Degree.create(name='Bachelor')
ma = Degree.create(name='Master')
phd = Degree.create(name='Doktor')

db.close()
