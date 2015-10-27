var AlertMessage = React.createClass({
    render: function(){
        var messages = {
            1: (
                <div className="alert alert-success">
                    Du hast Dich erfolgreich zur Absolventenfeier angemeldet.
                    Überprüfe dein Postfach für weitere Informationen.
                    Bis bald!
                </div>
            ),
            2: (
                <div className="alert alert-success">
                    Die Email wurde noch einmal versandt und sollte in ein
                    paar Minuten in Deinem Postfach sein.
                </div>
            ),
            3: (
                <div className="alert alert-success">
                    Deine Daten wurden aktualisiert. Bis dann!
                </div>
            ),
            4: (
                <div className="alert alert-warning">
                    Die Anmeldung ist deaktiviert. Du kannst momentan
                    keine Änderungen vornehmen oder dich registrieren.
                    Falls es eine dringende, kurzfristige Änderung gibt,
                    melde Dich per Mail bei uns:&nbsp;
                    <a href="#">absolventenfeier@pep-dortmund.de</a>
                </div>
            ),
            10: (
                <div className="alert alert-warning">
                    Diese Email wurde bereits eingetragen.
                    Du solltest eine Bestätigungsmail in Deinem
                    Postfach finden, in der ein Link zur Änderung
                    Deiner Daten aufgeführt ist.  <a
                        href="#"
                        className="alert-link"
                        onClick={this.props.callback}>
                        Email erneut versenden.
                    </a>
                </div>
            ),
            20: (
                <div className="alert alert-danger">
                    Der Versand der Email ist fehlgeschlagen.
                </div>
            ),
            30: (
                <div className="alert alert-danger">
                    Aktualisieren fehlgeschlagen.
                </div>
            )
        }
        return messages[this.props.code];
    }
});

var Loader = React.createClass({
    getInitialState: function(){
        return {
            display: false
        }
    },
    render: function(){
        var rects = []
        var number = 3;
        var duration = 1;
        for(var i=0; i<number; i++){
            var rectStyle = {};
            rectStyle.animationDelay = rectStyle.WebkitAnimationDelay =
                i * duration / (number + 1) + 's';
            rectStyle.animationDuration = rectStyle.WebkitAnimationDuration =
                duration + 's';
            rects.push(
                <div key={i} style={rectStyle} className="loader-rect"></div>
            );
        };
        var html = (
            <div className="row">
                <div id="loader" className="col-sm-12">
                    {rects}
                </div>
            </div>
        );
        if(this.state.display){
            return html;
        } else {
            return <div></div>;
        }
    }
});

var loader = React.render(<Loader />, document.getElementById('loader'));

var NameInput = React.createClass({
    getInitialState: function(){
        return {
            firstname: '',
            lastname: '',
            error: false
        }
    },
    handleChange: function() {
        this.setState({
            firstname: this.refs.firstname.getDOMNode().value,
            lastname: this.refs.lastname.getDOMNode().value
        }, function(){
            if(this.state.error){
                this.validate();
            }
        });
        this.props.onUserInput({
            firstname: this.refs.firstname.getDOMNode().value,
            lastname: this.refs.lastname.getDOMNode().value
        });
    },
    validate: function() {
        var error = (!this.state.firstname || !this.state.lastname);
        this.setState({error: error});
        return !error;
    },
    render: function(){
        var classes = React.addons.classSet({
            'form-group': true,
            'has-error': this.state.error
        });
        var firstnameClasses = React.addons.classSet({
            'form-control': true,
            'form-control-error': this.state.error && !this.state.firstname
        });
        var lastnameClasses = React.addons.classSet({
            'form-control': true,
            'form-control-error': this.state.error && !this.state.lastname,
        });
        var hint = !this.state.error ? '' : (
            <span className="help-block"><small>
                Bitte trage Vor- und Nachnamen ein.
                So wirst du bei der Absolventenfeier aufgerufen.
            </small></span>);
        return (
            <fieldset className={classes} disabled={this.props.readOnly}>
                <label className="control-label">Name</label>
                <div className="row">
                    <div className="col-sm-6">
                        <input
                            className={firstnameClasses}
                            placeholder="Max"
                            ref="firstname"
                            onChange={this.handleChange}
                            value={this.state.firstname}
                            />
                    </div>
                    <div className="col-sm-6">
                        <input
                            className={lastnameClasses}
                            placeholder="Mustermann"
                            ref="lastname"
                            value={this.state.lastname}
                            onChange={this.handleChange}
                            />
                    </div>
                </div>
                {hint}
            </fieldset>
        );
    }
});

var EmailInput = React.createClass({
    getInitialState: function(){
        return {
            error: false,
            email: '',
            disabled: false,
            mailExtension: ''
        }
    },
    validate: function(){
        var error = (!this.state.email
                || !this.state.email.match(/^\w+\.\w+$/i));
        this.setState({error: error});
        return !error;
    },
    handleChange: function(e){
        var val = e.currentTarget.value;
        this.setState({email: val}, function(){
            if(this.state.error){
                this.validate();
            }
        });
        this.props.onUserInput({email: val});
    },
    render: function(){
        var hint = '';
        if(this.state.error){
            if(!this.state.email){
                hint = (
                    <span className="help-block"><small>
                        Bitte trage Deine Emailadresse ein.
                    </small></span>);
            } else {
                hint = (
                    <span className="help-block"><small>
                        Du kannst dich nur mit einer gültigen
                        <code>{this.state.mailExtension}</code>
                        -Mailadresse eintragen.
                    </small></span>
                );
            }
        };
        var classes = React.addons.classSet({
            'form-group': true,
            'has-error': this.state.error,
        });
        var disabled = this.state.disabled ? 'disabled' : '';
        return (
            <fieldset className={classes} disabled={this.props.readOnly}>
                <label className="control-label">Unimail-Adresse</label>
                <div className="input-group">
                    <input
                        className="form-control"
                        placeholder="max.mustermann"
                        ref="email"
                        onChange={this.handleChange}
                        value={this.state.email}
                        />
                    <div className="input-group-addon">@tu-dortmund.de</div>
                </div>
                {hint}
            </fieldset>
        );
    }
})

var DegreeSelect = React.createClass({
    getInitialState: function(){
        return {
            degree: 0,
            degrees: [],
            error: false,
        };
    },
    handleChange: function(e){
        var val = e.currentTarget.value;
        this.setState({degree: val}, function(){
            if(this.state.error){
                this.validate();
            }
        });
        this.props.onUserInput({degree: val});
    },
    validate: function(){
        var error = !this.state.degree;
        this.setState({error: error});
        return !error;
    },
    render: function(){
        var degrees = [];
        for(var key in this.state.degrees){
            var degree = this.state.degrees[key];
            var checked = this.state.degree == degree.id;
            degrees.push(
                <label key={degree.id} className="radio-inline">
                    <input
                        name="degree"
                        ref="degree"
                        type="radio"
                        onChange={this.handleChange}
                        value={degree.id}
                        checked={checked}
                        />
                    {degree.name}
                </label>
            )
        }
        var classes = React.addons.classSet({
            'form-group': true,
            'has-error': this.state.error
        });
        var hint = !this.state.error ? '' : (
                <span className="help-block"><small>
                    Triff bitte eine Auswahl.
                </small></span>
            );
        return (
            <fieldset className={classes} disabled={this.props.readOnly}>
                <label className="control-label">Abschluss</label>
                <div className="input-group">
                    {degrees}
                </div>
                {hint}
            </fieldset>
        );
    }
})

var TitleInput = React.createClass({
    getInitialState: function(){
        return {
            error: false,
            parseError: false,
            degree: undefined,
            degrees: {},
            renderedTex: '',
            title: ''
        };
    },
    validate: function(){
        var hasError = !this.state.title || this.state.parseError;
        this.setState({error: hasError});
        return !hasError;
    },
    seperateTex: function(string){
        var stringArray = [];
        var index = 0;
        while(index > -1){
            index = string.indexOf('$') > -1 ? string.indexOf('$') : string.length;
            string.substring(0, index) ?
                stringArray.push(string.substring(0, index)) : undefined;
            string = string.substring(index + 1, string.length);
            index = string.indexOf('$');
            if(index > -1){
                string.substring(0, index) ?
                    stringArray.push('$' + string.substring(0, index)) : undefined;
                string = string.substring(index+1, string.length);
            }
        }
        return stringArray;
    },
    toTex: function(str){
        var stringArray = this.seperateTex(str);
        try {
            this.title = this.title || "";
            var completeString = "";
            for(var i=0; i<stringArray.length; i++){
                var string = stringArray[i];
                if(string.substring(0, 1) == "$"){
                    completeString += katex.renderToString(
                        string.substring(1, string.length)
                    );
                } else {
                    completeString += string;
                }
            }
            this.setState({parseError: false});
            return completeString;
        }
        catch(err){
            this.setState({parseError: true});
        };
    },
    handleChange: function(e){
        var val = e.currentTarget.value
        this.setState({title: val, renderedTex: this.toTex(val)}, function(){
            if(this.state.error){
                this.validate();
            }
        });
        this.props.onUserInput({title: val});
    },
    render: function(){
        var hint = ''
        if(this.state.error){
            if(!this.state.title){
                hint = (
                    <span className="help-block"><small>
                        Bitte gib hier den Titel Deiner Abschlussarbeit ein.
                    </small></span>
                )
            } else {
                hint = (
                    <span className="help-block"><small>
                        Anscheinend konnte dein <code>LaTeX</code>-nicht
                        richtig interpretiert werden. Versuche es bitte erneut
                        oder schaue Dir&nbsp;
                        <a href={'https://github.com/Khan/KaTeX/wiki/'
                            + 'Function-Support-in-KaTeX'}
                            target='_blank'>
                            hier
                        </a> die unterstützten
                        Befehle an.
                    </small></span>
                )
            }
        }
        var degreeText = '';
        if(this.state.degree in this.state.degrees){
            degreeText = this.state.degrees[this.state.degree].name + '-';
        };
        var classes = React.addons.classSet({
            'form-group': true,
            'has-error': this.state.error
        });
        return (
            <fieldset className={classes} disabled={this.props.readOnly}>
                <label className="control-label">
                    Titel der {degreeText}Arbeit&nbsp;
                    <small>
                        (Du kannst auch Inline-LaTeX innerhalb
                        <code>$ $</code> nutzen.)
                    </small>
                </label>
                <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={this.state.title}
                    onChange={this.handleChange}
                     />
                {hint}
                <p className="text-center"
                    dangerouslySetInnerHTML={{
                        __html: this.state.renderedTex
                    }}></p>
            </fieldset>
        );
    }
});

var DateCheck = React.createClass({
    getInitialState: function(){
        return {
            error: false,
            checked: false
        };
    },
    validate: function(){
        var hasError = !this.state.checked;
        this.setState({error: hasError});
        return !hasError;
    },
    handleChange: function(e){
        this.setState({checked: !this.state.checked}, function(){
            if(this.state.error){
                this.validate();
            }
            this.props.onUserInput({validDate: this.state.checked});
        });
    },
    render: function(){
        var classes = React.addons.classSet({
            'form-group': true,
            'has-error': this.state.error,
            'disabled': false
        });
        var hint = this.state.error ? (
            <span className="help-block"><small>
                Falls Du Deine letzte Prüfung im Jahr 2016 hattest oder noch
                haben wirst, bist Du herzlich zur Absolventenfeier 2016
                eingeladen, die Anfang 2017 stattfinden wird.
            </small></span>
        ) : '';
        return (
            <fieldset className={classes} disabled={this.props.readOnly}>
                <div className="checkbox">
                    <label>
                        <input
                            type="checkbox"
                            onChange={this.handleChange}
                            checked={this.state.checked}
                        />
                        Meine letzte Prüfung ist beziehungsweise war im Jahr 2015.
                    </label>
                </div>
                {hint}
            </fieldset>
        )
    }
})

var GuestInput = React.createClass({
    getInitialState: function(){
        return {
            error: false,
            guests: this.props.value,
            maxGuests: 10
        }
    },
    validate: function(){
        var hasError = (!this.state.guests
            || this.state.guests < 1
            || this.state.guests > this.state.maxGuests);
        this.setState({error: hasError});
        return !hasError;
    },
    handleChange: function(e){
        var value = e.currentTarget.value;
        this.setState({guests: value}, function(){
            if(this.state.error){
                this.validate();
            }
        });
        this.props.onUserInput({guests: value});
    },
    render: function(){
        var hint = '';
        if(this.state.error){
            hint = (
                <span className="help-block"><small>
                    Wie viele Gäste bringst du mit (inklusive Dir)?
                    Momentan darfst du bis zu {this.state.maxGuests - 9}&nbsp;
                    Gäste mitbringen.
                </small></span>
            )
        };
        var classes = React.addons.classSet({
            'form-group': true,
            'has-error': this.state.error
        });
        return (
            <fieldset className={classes} disabled={this.props.readOnly}>
                <label className="control-label">
                    Anzahl der Gäste (inklusive Dir)
                </label>
                <input
                    type="number"
                    name="guests"
                    className="form-control"
                    onChange={this.handleChange}
                    value={this.state.guests}
                    min={1}
                    max={this.state.maxGuests}
                     />
                {hint}
            </fieldset>
        )
    }
});

var ParticipantForm = React.createClass({
    getInitialState: function(){
        this.participant = {};
        return {
            participant: {},
            registrationIsActive: false,
            alerts: []
        };
    },
    componentDidMount: function(){
        $.getJSON('/api/config/', function(data){
            this.refs.degrees.setState({degrees: data.degrees});
            this.refs.title.setState({degrees: data.degrees});
            this.refs.email.setState({mailExtension: data.allowed_mail});
            this.refs.guests.setState({maxGuests: data.maximum_guests});
            this.setState({registrationIsActive: data.registration_is_active});
            if(!data.registration_is_active){
                this.setState({alerts: [{code: 4}]});
            }
        }.bind(this))
        .fail(function(){
            console.log("Error while downloading degrees.");
        });
        // check for edit-page
        var url = window.location.href;
        var params = url.match(/\d+!\w+\/$/);
        if(params){
            loader.setState({display: true});
            params = params[0].substr(0, params[0].length - 1);
            var id = params.split('!')[0];
            var token = params.split('!')[1];
            var requestUrl = '/api/participant/?participant_id='
                + id + '&token=' + token;
            $.get(requestUrl, function(data){
                this.setState({participant: data});
                this.refs.name.setState({
                    firstname: data.firstname,
                    lastname: data.lastname
                });
                this.refs.email.setState({
                    email: data.email,
                    disabled: true
                });
                this.refs.degrees.setState({ degree: data.degree });
                this.refs.guests.setState({ guests: data.guests });
                this.refs.title.setState({
                    title: data.title,
                    renderedTex: this.refs.title.toTex(data.title)
                });
                this.refs.date.setState({ checked: true, disabled: true });
                this.id = id;
            }.bind(this))
            .fail(function(){
                this.setState({alerts: [{code: 20}]});
            }.bind(this))
            .always(function(){
                loader.setState({display: false});
            });
        }
    },
    resendMail: function(){
        loader.setState({display: true});
        $.get('/api/resend/?email='+this.state.participant.email, function(){
            this.setState({alerts: [{code: 2}]});
        }.bind(this))
        .fail(function(){
            this.setState({alerts: [{code: 20}]});
        }.bind(this))
        .always(function(){
            loader.setState({display: false});
        });
    },
    validate: function(){
        var valid = true;
        valid = this.refs.name.validate() && valid;
        valid = this.refs.email.validate() && valid;
        valid = this.refs.degrees.validate() && valid;
        valid = this.refs.title.validate() && valid;
        valid = this.refs.guests.validate() && valid;
        valid = this.refs.date.validate() && valid;
        return valid;
    },
    handleSubmit: function(e) {
        e.preventDefault();
        if(this.validate()){
            loader.setState({display: true});
            if(this.state.participant.token){
                var url = '/api/update/?participant_id=';
                url += this.id;
                url += '&token=';
                url += this.state.participant.token;
                loader.setState({display: true});
                $.post(url, JSON.stringify(this.state.participant), function(){
                    this.setState({alerts: [{code: 3}]});
                }.bind(this))
                .fail(function(){
                    this.setState({alerts: [{code: 30}]});
                }.bind(this))
                .always(function(data){
                    loader.setState({display: false});
                });
            } else {
                $.post('/api/', JSON.stringify(this.state.participant), function(){
                    this.setState({alerts: [{code: 1}]});
                }.bind(this))
                .fail(function(data){
                    if(data.status == 400){
                        this.setState({alerts: [{code: 10, callback: this.resendMail}]});
                    };
                    if(data.status == 500){
                        this.setState({alerts: [
                            {code: 1},
                            {code: 20}
                        ]});
                    };
                }.bind(this))
                .always(function(){
                    loader.setState({display: false});
                });
            }
        }
        return;
    },
    handleUserInput: function(participantObject){
        var part = this.state.participant;
        $.extend(true, part, participantObject);
        this.setState({participant: part});
    },
    handleDegreeInput: function(obj){
        this.handleUserInput(obj);
        this.refs.title.setState({degree: obj.degree});
    },
    render: function(){
        var alerts = [];
        for(var key in this.state.alerts){
            alerts.push(
                <AlertMessage
                    key={key}
                    code={this.state.alerts[key].code}
                    callback={this.state.alerts[key].callback}
                />
            )
        }
        var buttons = [];
        if(!this.state.participant.token){
            buttons.push(
                <button
                    type="submit"
                    className="btn btn-primary"
                    key={buttons.length + 1}
                    disabled={!this.state.registrationIsActive}
                    >
                    Eintragen
                </button>
                );
        } else {
            buttons.push(
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!this.state.registrationIsActive}
                    key={buttons.length + 1}>
                    Aktualisieren
                </button>
            );
            buttons.push(<span> </span>);
            buttons.push(
                <a href="/"
                    className="btn btn-secondary"
                    disabled={!this.state.registrationIsActive}
                    key={buttons.length + 1}>
                    Neu
                </a>
            );
        }
        return (
            <div>
                <div className="row">
                    <div className="col-md-12 col-lg-10 col-lg-offset-1 col-xl-8 col-xl-offset-2">
                        {alerts}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 col-lg-10 col-lg-offset-1 col-xl-8 col-xl-offset-2">
                        <form onSubmit={this.handleSubmit}>
                            <NameInput
                                ref="name"
                                onUserInput={this.handleUserInput}
                                readOnly={!this.state.registrationIsActive}
                                />
                            <EmailInput
                                ref="email"
                                onUserInput={this.handleUserInput}
                                value={this.participant.email}
                                readOnly={!this.state.registrationIsActive}
                                />
                            <DegreeSelect
                                ref="degrees"
                                source="/api/degrees/"
                                onUserInput={this.handleDegreeInput}
                                readOnly={!this.state.registrationIsActive}
                                />
                            <TitleInput
                                ref="title"
                                onUserInput={this.handleUserInput}
                                readOnly={!this.state.registrationIsActive}
                                />
                            <GuestInput
                                ref="guests"
                                onUserInput={this.handleUserInput}
                                readOnly={!this.state.registrationIsActive}
                                />
                            <DateCheck
                                ref="date"
                                onUserInput={this.handleUserInput}
                                readOnly={!this.state.registrationIsActive}
                                />
                            {buttons}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

var AdminPanel = React.createClass({
    getInitialState: function(){
        return {
            participants: [],
            degrees: {},
            mailExtension: '',
            stats: {},
            registrationIsActive: false
        }
    },
    componentDidMount: function(){
        $.getJSON('/api/config/', function(data){
            this.setState({
                degrees: data.degrees,
                mailExtension: data.allowed_mail
            });
        }.bind(this))
        .fail(function(){
            console.log("Error while downloading degrees.");
        });
        $.getJSON('/api/stats/', function(data){
            this.setState({
                stats: data
            });
        }.bind(this))
        .fail(function(){
            console.log("Error while downloading degrees.");
        });
        $.getJSON('/admin/api/participants/', function(data){
            this.setState({participants: data.participants});
        }.bind(this))
        .fail(function(){
            console.log('fail');
        });
        $.getJSON('/api/config/', function(data){
            this.setState({registrationIsActive: data.registration_is_active});
        }.bind(this));
    },
    toggleRegistrationStatus: function(){
        $.getJSON('/admin/api/toggle_registration/', function(data){
            this.setState({registrationIsActive: data.registration});
        }.bind(this));
    },
    render: function(){
        var degreeStats = []
        for(var key in this.state.stats.degree_counts){
            if(key in this.state.degrees){
                degreeStats.push(
                    <span key={key}>
                        <small>{this.state.degrees[key].name}: </small>
                        {this.state.stats.degree_counts[key]}&nbsp;
                    </span>
                );
            }
        }
        var head = (
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email <small>{this.state.mailExtension}</small></th>
                    <th>Abschluss</th>
                    <th>Gäste</th>
                </tr>
            </thead>
        );
        var body = [];
        body.push(
            <tr>
                <td colSpan="2">Total: {this.state.stats.participant_count}</td>
                <td colSpan="2">{degreeStats}</td>
                <td>Total: {this.state.stats.guest_count}</td>
            </tr>
        )
        for(var key in this.state.participants){
            var p = this.state.participants[key];
            var degree = p.degree in this.state.degrees ?
                this.state.degrees[p.degree].name :
                '...';
            body.push(
                <tr key={key}>
                    <td>#{p.id}</td>
                    <td>{p.firstname} {p.lastname}</td>
                    <td>
                        <a href={'mailto:' + p.email + this.state.mailExtension}>
                        {p.email}</a>
                    </td>
                    <td>{degree}</td>
                    <td>{p.guests}</td>
                </tr>
            );
        }
        var registrationButtonLabel = this.state.registrationIsActive
            ? 'deaktivieren' : 'aktivieren';
        var buttonType = this.state.registrationIsActive ? 'warning' : 'success';
        return(
            <div>
                <div className="row">
                    <div className="col-xs-6 col-lg-6 col-lg-offset-1 col-xl-5 col-xl-offset-2">
                        <h4>Adminpanel</h4>
                    </div>
                    <div className="col-xs-6 col-lg-4 col-xl-3 text-right">
                        <span id="disable-registration">
                            Anmeldung {this.state.registrationIsActive ? 'online' : 'offline'}&nbsp;
                            <button
                                className={"btn btn-sm btn-" + buttonType}
                                onClick={this.toggleRegistrationStatus}>
                                {registrationButtonLabel}
                            </button>
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 col-lg-10 col-lg-offset-1 col-xl-8 col-xl-offset-2">
                        <table className="table table-sm table-hover table-striped">
                            {head}
                            <tbody>
                            {body}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
});

var admin = window.location.href.match(/\/admin\/$/);
if(admin){
    React.render(<AdminPanel />, document.getElementById('admin-panel'));
} else {
    React.render(<ParticipantForm />, document.getElementById('main'));
}
