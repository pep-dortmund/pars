FROM python:3.7-alpine

RUN mkdir -p /opt/pars
WORKDIR /opt/pars

COPY Pipfile Pipfile.lock ./
RUN pip install pipenv
RUN pipenv install
RUN pipenv run pip install gunicorn

COPY database.py parsapp.py reset_db.py webpack.config.js boot.sh ./
COPY templates templates
COPY static static
RUN chmod +x boot.sh

ENV FLASK_APP parsapp.py

EXPOSE 5000
ENTRYPOINT ["./boot.sh"]
