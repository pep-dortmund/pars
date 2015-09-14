class Config(object):
    MAXIMUM_GUESTS = 10
    MAIL_PORT = 587
    DEBUG = False
    TESTING = False


class DevelopmentConfig(Config):
    ALLOWED_MAIL_SERVER = '@tu-dortmund.de'
    MAIL_ADDRESS = ''
    MAIL_SERVER = ''
    MAIL_LOGIN = ''
    MAIL_PASSWORD = ''
    TEST_MAIL_ADDRESS = ''
    DEBUG = True
