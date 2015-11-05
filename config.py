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
    DATE = '06.02.2016'
    MAIL_DEBUG = False


class DevelopmentConfig(Config):
    MAIL_ADDRESS = ''
    MAIL_SERVER = ''
    MAIL_LOGIN = ''
    MAIL_PASSWORD = ''
    TEST_MAIL_ADDRESS = ''
    DEBUG = True
    MAIL_DEBUG = True
    ADMIN_USERNAME = 'admin'
    ADMIN_PASSWORD = 'secret'