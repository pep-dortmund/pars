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
            )
        }
        return (
            <div className="col-md-12">{messages[this.props.code]}</div>
        );
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
            <fieldset className={classes}>
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
                            onChange={this.handleChange}/>
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
            email: ''
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
                        Bitte trage Deine TU-Mailadresse ein.
                    </small></span>);
            } else {
                hint = (
                    <span className="help-block"><small>
                        Du kannst dich nur mit einer gültigen
                        <code>@tu-dortmund</code>-Mailadresse eintragen.
                    </small></span>
                );
            }
        };
        var classes = React.addons.classSet({
            'form-group': true,
            'has-error': this.state.error
        });
        return (
            <fieldset className={classes}>
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
            error: false
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
        for(key in this.state.degrees){
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
            <fieldset className={classes}>
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
                        Bitte gib hier den Titel Deiner Abschlussarbeit ein
                        (Du kannst auch inline-LaTeX innerhalb <code>$$</code>
                         benutzen).
                    </small></span>
                )
            } else {
                hint = (
                    <span className="help-block"><small>
                        Anscheinend konnte dein <code>LaTeX</code>-nicht
                        richtig interpretiert werden. Versuche es bitte erneut
                        oder schaue Dir <a href="">hier</a> die unterstützten
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
            <fieldset className={classes}>
                <label className="control-label">
                    Titel der {degreeText}Arbeit
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
                <p className="text-center"><small>
                    (Du kannst auch Inline-LaTeX innerhalb
                     <code>$ $</code> nutzen.)
                </small></p>
            </fieldset>
        );
    }
});

var GuestInput = React.createClass({
    guestMax: 10,
    getInitialState: function(){
        return {
            error: false,
            guests: this.props.value
        }
    },
    validate: function(){
        var hasError = (!this.state.guests
            || this.state.guests < 1
            || this.state.guests > this.guestMax);
        this.setState({error: hasError});
        console.log("validating");
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
                    Wie viele Gäste bringst du mit (einschließlich Dir)?
                    Momentan darfst du bis zu {this.guestMax} Gäste mitbringen.
                </small></span>
            )
        };
        var classes = React.addons.classSet({
            'form-group': true,
            'has-error': this.state.error
        });
        return (
            <fieldset className={classes}>
                <label className="control-label">
                    Anzahl der Gäste
                </label>
                <input
                    type="number"
                    name="guests"
                    className="form-control"
                    onChange={this.handleChange}
                    value={this.state.guests}
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
            participant: {}
        };
    },
    pushMessage: function(id, callback){
        React.render(
            <AlertMessage code={id} callback={callback} />,
            document.getElementById('alert')
        );
    },
    componentDidMount: function(){
        $.getJSON('/api/degrees/', function(data){
            this.refs.degrees.setState({degrees: data});
            this.refs.title.setState({degrees: data});
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
                this.refs.email.setState({ email: data.email });
                this.refs.degrees.setState({ degree: data.degree });
                this.refs.guests.setState({ guests: data.guests });
                this.refs.title.setState({ title: data.title });
            }.bind(this))
            .fail(function(){
                this.pushMessage(20);
            }.bind(this))
            .always(function(){
                loader.setState({display: false});
            });
        }
    },
    resendMail: function(){
        loader.setState({display: true});
        $.get('/api/resend/?email='+this.participant.email, function(){
            this.pushMessage(2);
        }.bind(this))
        .fail(function(){
            this.pushMessage(20);
        }.bind(this))
        .always(function(){
            loader.setState({display: false});
        });
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var valid = true;
        valid = this.refs.name.validate() && valid; 
        valid = this.refs.email.validate() && valid; 
        valid = this.refs.degrees.validate() && valid; 
        valid = this.refs.title.validate() && valid; 
        valid = this.refs.guests.validate() && valid;
        if(valid){
            loader.setState({display: true});
            $.post('/api/', JSON.stringify(this.state.participant), function(){
                this.pushMessage(1);
            }.bind(this))
            .fail(function(data){
                this.pushMessage(10, this.resendMail);
            }.bind(this))
            .always(function(){
                loader.setState({display: false});
            });
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
        var buttons = [];
        if(!this.state.participant.token){
            buttons.push(
                <button
                    type="submit"
                    className="btn btn-secondary"
                    key={buttons.length + 1}>
                    Eintragen
                </button>
                );
        } else {
            buttons.push(
                <button
                    type="button"
                    onClick={this.updateParticipant}
                    className="btn btn-secondary"
                    key={buttons.length + 1}>
                    Aktualisieren
                </button>
            );
            buttons.push(
                <button
                    type="button"
                    onClick={this.resetForm}
                    className="btn btn-secondary"
                    key={buttons.length + 1}>
                    Neu
                </button>
            );
        }
        return (
            <form onSubmit={this.handleSubmit}>
                <NameInput
                    ref="name"
                    onUserInput={this.handleUserInput}
                    />
                <EmailInput
                    ref="email"
                    onUserInput={this.handleUserInput}
                    value={this.participant.email}
                    />
                <DegreeSelect
                    ref="degrees"
                    source="/api/degrees/"
                    onUserInput={this.handleDegreeInput}
                    />
                <TitleInput
                    ref="title"
                    onUserInput={this.handleUserInput}
                    />
                <GuestInput
                    ref="guests"
                    onUserInput={this.handleUserInput}
                    />
                {buttons}
            </form>
        );
    }
});

React.render(<ParticipantForm />, document.getElementById('main'));
