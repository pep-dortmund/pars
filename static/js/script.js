var AlertMessage = React.createClass({
    resendMail: function(){
        console.log('Resend Email somehow');
    },
    render: function(){
        var messages = {
            1: (
                <div className="alert alert-success">
                    Du hast Dich erfolgreich zur Absolventenfeier angemeldet.
                    Überprüfe dein Postfach für weitere Informationen.
                    Bis bald!
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
                        onClick={this.resendMail}>
                        Email erneut versenden.
                    </a>
                </div>
            )
        }
        return (
            <div className="col-md-12">{messages[this.props.code]}</div>
        );
    }
});

var NameInput = React.createClass({
    getInitialState: function(){
        return {
            firstname: this.props.firstname,
            lastname: this.props.lastname,
            error: false
        }
    },
    handleChange: function() {
        this.setState({
            firstname: this.refs.firstname.getDOMNode().value,
            lastname: this.refs.lastname.getDOMNode().value
        });
        this.props.onUserInput(this.state.firstname, this.state.lastname);
        if(this.state.error){
            this.validate();
        }
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
                            value={this.props.firstname}
                            />
                    </div>
                    <div className="col-sm-6">
                        <input
                            className={lastnameClasses}
                            placeholder="Mustermann"
                            ref="lastname"
                            value={this.props.lastname}
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
        this.email = this.props.value;
        return {
            error: false
        }
    },
    validate: function(){
        var error = (!this.email || !this.email.match(/^\w+\.\w+$/i));
        this.setState({error: error});
        return !error;
    },
    handleChange: function(e){
        var val = e.currentTarget.value;
        this.email = val;
        this.props.onUserInput(val);
        if(this.state.error){
            this.validate();
        }
    },
    render: function(){
        var hint = '';
        if(this.state.error){
            if(!this.email){
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
                        value={this.email}
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
        this.degree = this.props.value;
        return {
            degrees: [],
            error: false
        };
    },
    handleChange: function(e){
        this.degree = e.currentTarget.value;
        this.props.onUserInput(this.degree);
        if(this.state.error){
            this.validate();
        }
    },
    componentDidMount: function(){
        $.getJSON(this.props.source, function(data){
            this.setState({degrees: data});
            if(this.props.sendDegrees){
                this.props.sendDegrees(data);
            }
        }.bind(this))
        .fail(function(){
            console.log("Error while downloading degrees.");
        })
    },
    validate: function(){
        var error = !this.degree ? true : false;
        this.setState({error: error});
        return !error;
    },
    render: function(){
        var degrees = [];
        for(key in this.state.degrees){
            var degree = this.state.degrees[key];
            var checked = this.degree == degree.id;
            degrees.push(
                <label key={degree.id} className="radio-inline">
                    <input
                        name="degree"
                        ref="degree"
                        type="radio"
                        onChange={this.handleChange}
                        value={degree.id}
                        defaultChecked={checked}
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
        this.title = this.props.value;
        return {
            error: false,
            degree: this.props.degree,
            degrees: {},
            renderedTex: ''
        };
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
    handleChange: function(e){
        var stringArray = this.seperateTex(e.currentTarget.value);
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
            this.setState({renderedTex: completeString});
        }
        catch(ParseError){ }
    },
    render: function(){
        var hint = !this.state.error ? '' : (
            <span className="help-block"><small>
                Bitte gib hier den Titel Deiner Abschlussarbeit ein
                (Du kannst auch inline-LaTeX innerhalb <code>$$</code>
                 benutzen).
            </small></span>
        );
        var degreeText = '';
        if(this.state.degree in this.state.degrees){
            degreeText = this.state.degrees[this.state.degree].name + '-';
        };
        return (
            <fieldset className="form-group">
                <label className="control-label">
                    Titel der {degreeText}Arbeit
                </label>
                <input
                    type="text"
                    name="title"
                    className="form-control"
                    defaultValue={this.title}
                    onChange={this.handleChange}
                     />
                {hint}
                <p className="text-center" dangerouslySetInnerHTML={{__html: this.state.renderedTex}}></p>
                <p className="text-center"><small>
                    (Du kannst auch Inline-LaTeX innerhalb
                     <code>$ $</code> nutzen.)
                </small></p>
            </fieldset>
        );
    }
});

var ParticipantForm = React.createClass({
    getInitialState: function(){
        this.participant = {};
        return {};
    },
    pushMessage: function(id){
        React.render(
            <AlertMessage code={id} />,
            document.getElementById('alert')
        );
    },
    handleSubmit: function(e) {
        e.preventDefault();
        if(this.refs.name.validate()
           && this.refs.email.validate()
           && this.refs.degrees.validate()
        ){
            $.post('/api/', JSON.stringify(this.participant), function(){
                this.pushMessage(1);
            }.bind(this))
            .fail(function(data){
                console.log('fail');
                this.pushMessage(10);
            }.bind(this));
        }
        return;
    },
    nameInput: function(firstname, lastname){
        this.participant.firstname = firstname;
        this.participant.lastname = lastname;
    },
    emailInput: function(email){
        this.participant.email = email;
    },
    degreeInput: function(degree){
        this.participant.degree = degree;
        this.refs.title.setState({degree: degree});
    },
    degreesUpdated: function(degrees){
        this.refs.title.setState({degrees: degrees});
    },
    titleInput: function(title){
        this.participant.title = title;
    },
    render: function(){
        var buttons = [];
        if(!this.participant.token){
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
                    onUserInput={this.nameInput}
                    firstname={this.participant.firstname}
                    lastname={this.participant.lastname}
                    />
                <EmailInput
                    ref="email"
                    onUserInput={this.emailInput}
                    value={this.participant.email}
                    />
                <DegreeSelect
                    ref="degrees"
                    source="/api/degrees/"
                    onUserInput={this.degreeInput}
                    value={this.participant.degree}
                    sendDegrees={this.degreesUpdated}
                    />
                <TitleInput
                    ref="title"
                    onUserInput={this.titleInput}
                    degree={this.participant.degree}
                    value={this.participant.title}
                    />
                {buttons}
            </form>
        );
    }
});

React.render(<ParticipantForm />, document.getElementById('main'));
