function seperateTeX(string){
    var stringArray = [];
    var index = 0;
    while(index > -1){
        index = string.indexOf("$") > -1 ? string.indexOf("$") : string.length;
        string.substring(0, index) ?
            stringArray.push(string.substring(0, index)) : undefined;
        string = string.substring(index + 1, string.length);
        index = string.indexOf("$");
        if(index > -1){
            string.substring(0, index) ?
                stringArray.push("$" + string.substring(0, index)) : undefined;
            string = string.substring(index+1, string.length);
        }
    }
    return stringArray;
}

var NameInput = React.createClass({
    getInitialState: function(){
        return {
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
            this.check();
        }
    },
    check: function() {
        this.setState({error: (!this.state.firstname || !this.state.lastname)});
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
            <span className="help-block">
                Bitte trage Vor- und Nachnamen ein.
                So wirst du bei der Absolventenfeier aufgerufen.
            </span>);
        return (
            <fieldset className={classes}>
                <label className="control-label">Name</label>
                <div className="row">
                    <div className="col-sm-6">
                        <input
                            className={firstnameClasses}
                            placeholder="Max"
                            ref="firstname"
                            onChange={this.handleChange}/>
                    </div>
                    <div className="col-sm-6">
                        <input
                            className={lastnameClasses}
                            placeholder="Mustermann"
                            ref="lastname"
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
            error: false
        }
    },
    check: function(){
        this.setState({error: (!this.email || !this.email.match(/^\w+\.\w+$/i))});
    },
    handleChange: function(){
        this.email = this.refs.email.getDOMNode().value;
        this.props.onUserInput(this.email);
        if(this.state.error){
            this.check();
        }
    },
    render: function(){
        var hint = !this.state.error ? '' : (
                <span className="help-block">
                    Bla
                </span>
            );
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
                        onChange={this.handleChange}/>
                    <div className="input-group-addon">@tu-dortmund.de</div>
                </div>
                {hint}
            </fieldset>
        );
    }
})

var ParticipantForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        this.refs.name.check();
        this.refs.email.check();
        return;
    },
    nameInput: function(firstname, lastname){
    },
    emailInput: function(email){
    },
    render: function(){
        return (
            <form onSubmit={this.handleSubmit}>
                <NameInput ref="name" onUserInput={this.nameInput} />
                <EmailInput ref="email" onUserInput={this.emailInput} />
                <input type="submit" className="btn btn-secondary" value="Post" />
            </form>
        );
    }
});

React.render(<ParticipantForm />, document.getElementById('main'));
