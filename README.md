## PEP/Physik Absolventenfeier Registrierungs System (PARS)

### Lokale Konfiguration

Die Konfiguration des Email-Servers wird in der Datei `config.py` gespeichert.
Diese Datei muss folgenden Variablen beinhalten:

    MAIL_SERVER = 'mail.server.de:587'
    MAIL_ADDRESS = 'pep-absolventenfeier-test@mailserver.de'
    MAIL_LOGIN = 'pep-absolventenfeier-test'
    MAIL_PASSWORD = r'some_secure_password'

### Testbetrieb

Zum Testen wird `pip` oder besser `python-virtualenv` o.ä. zur Installation
aller Abhängigkeiten benötigt. Im heruntergeladenen Verzeichnis kann dann
via

    $ virtualenv -p python3 env

eine virtuelle Umgebung im Unterordner `env` erstellt werden.
Diese wird mittels `source env/bin/activate` aktiviert (aktualisiert lediglich
`$PATH`) und anschließend mit `deactivate` deaktiviert werden.

In der aktivierten Umgebung können alle Abhängigkeiten mit

    $(env) pip install -r requirements.txt

installiert und anschließend die App mit

    $(env) ./parsapp.py

ausgeführt werden. Der Server ist dann lokal unter `http://localhost:5000`
erreichbar. Für funktionierenden Email-Versand muss die datei `config.py`
angepasst/erstellt werden (s.o.).
