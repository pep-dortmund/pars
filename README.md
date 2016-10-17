## PEP/Physik Absolventenfeier Registrierungs System (PARS)

### Lokale Konfiguration

Die Datei `config.py` enthält einige, hoffentlich selbsterklärende
Konfigurationsvariablen und muss zum Test des Mailversands angepasst werden.

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

installiert, die Datenbank mit

    $(emv) ./setup_db.py

initialisiert. Jetzt werden noch alle JavaScript Abhängigkeiten benötigt:

    $(env) npm install

Die JS Dateien können dann im hintergrund (`tmux` oder andere Shell) kompiliert
werden mittels

    $(env) npm start

Anschließend die App mit

    $(env) ./parsapp.py

starten. Der Server ist dann lokal unter `http://localhost:5000`
erreichbar. Für funktionierenden Email-Versand muss die datei `config.py`
angepasst/erstellt werden (s.o.).
