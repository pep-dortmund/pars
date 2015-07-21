from database import Degree

degrees = ['ba', 'ma', 'dr']

status = True
for d in degrees:
    success = Degree.get_or_create(name=d)
    status = success if status else False

if status:
    print("Degrees {} were added to the databse.".format(degrees))
else:
    print("Error, adding degrees to the database.")
