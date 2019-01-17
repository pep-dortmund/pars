## PEP/Physik Absolventenfeier Registrierungs System (PARS)
[![Build Status](https://travis-ci.org/pep-dortmund/pars.svg?branch=master)](https://travis-ci.org/pep-dortmund/pars)

### Lokale Konfiguration

Die Datei `config.py` enthält einige, hoffentlich selbsterklärende
Konfigurationsvariablen und muss zum Test des Mailversands angepasst werden.

### Testbetrieb

Zum Testen wird `pipenv` o.ä. zur Installation
aller Abhängigkeiten benötigt. Im heruntergeladenen Verzeichnis kann dann
via

    $ pipenv install

eine virtuelle Umgebung im Unterordner erstellt werden.
Eine shell innerhalb der Umgebung kann mittels

    $ pipenv shell

gestartet werden. Für die Datenbank wird mit

    $(env) ./reset_db.py

ein Backup erstellt und sie wird zurückgesezt. Jetzt werden noch
alle JavaScript Abhängigkeiten benötigt. In einer neuen session:

    $ npm install

Die JS Dateien können dann im hintergrund (`tmux` oder andere Shell) kompiliert
werden mittels

    $ npm start

Anschließend die App in der `pipenv` shell mit

    $(env) ./parsapp.py

starten. Der Server ist dann lokal unter `http://localhost:5000`
erreichbar. Für funktionierenden Email-Versand muss die datei `config.py`
angepasst/erstellt werden (s.o.).

### Ausliefern

Vor dem deployment sollte unbedingt etwas wie

    webpack --progress --colors --optimize-occurrence-order --optimize-minimize

ausgeführt werden, um die scripte zu verkleinern. Falls `webpack` nicht
installiert ist, kann auch `./node_modules/webpack/bin/webpack.js` direkt
gerufen werden.
