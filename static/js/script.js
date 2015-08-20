function seperateTeX(string){
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
}

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
        return error;
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
        return error;
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
        }.bind(this))
        .fail(function(){
            console.log("Error while downloading degrees.");
        })
    },
    validate: function(){
        var error = !this.degree ? true : false;
        this.setState({error: error});
        return error;
    },
    render: function(){
        var degrees = [];
        for(key in this.state.degrees){
            var degree = this.state.degrees[key];
            var checked = this.degree == degree.id ? 'checked' : '';
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

var ParticipantForm = React.createClass({
    getInitialState: function(){
        this.participant = {
            firstname: 'Kevin',
            lastname: 'Heinicke',
            email: 'kevin.heinicke',
            degree: 1
        };
        return {};
    },
    handleSubmit: function(e) {
        e.preventDefault();
        this.refs.name.validate();
        this.refs.email.validate();
        this.refs.degrees.validate();
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
                    />
                {buttons}
            </form>
        );
    }
});

React.render(<ParticipantForm />, document.getElementById('main'));
