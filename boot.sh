#!/bin/sh
exec pipenv run gunicorn -b :80 --access-logfile - --error-logfile - parsapp:parsapp
