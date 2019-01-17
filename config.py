class Config(object):
    MAXIMUM_GUESTS = 10
    MAIL_PORT = 587
    MAIL_ADDRESS = ''
    MAIL_SERVER = ''
    MAIL_LOGIN = ''
    MAIL_PASSWORD = ''
    ALLOWED_MAIL_SERVER = '@tu-dortmund.de'
    DEBUG = False
    TESTING = False
    ADMIN_USERNAME = None
    ADMIN_PASSWORD = None
    DATE = 'XX.XX.2018'
    MAIL_DEBUG = False


class DevelopmentConfig(Config):
    MAIL_ADDRESS = 'absolventenfeier@pep-dortmund.org'
    MAIL_SERVER = 'pepdo.elnath.uberspace.de'
    MAIL_LOGIN = 'absolventenfeier@pepdo.elnath.uberspace.de'
    MAIL_PASSWORD = 'bronx5-9fume-shoot-Loan-Beirut6-picky9-Cull0-tuff'
    TEST_MAIL_ADDRESS = ''
    DEBUG = True
    MAIL_DEBUG = True
    ADMIN_USERNAME = 'admin'
    ADMIN_PASSWORD = 'secret'
    MAIL_URL_PREFIX = 'http://localhost:5000'
    SECRET_KEY = 'foobar'
