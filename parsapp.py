#! /usr/bin/env python3
from flask import (Flask,
                   render_template)

parsapp = Flask(__name__)


@parsapp.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    parsapp.run()
