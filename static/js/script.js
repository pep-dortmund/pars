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
        this.firstname = this.refs.firstname.getDOMNode().value;
        this.lastname = this.refs.lastname.getDOMNode().value;
        this.props.onUserInput(this.firstname, this.lastname);
    },
    check: function() {
        if(!this.firstname || !this.lastname){
            this.setState({error: true});
        } else {
            this.setState({error: false});
        }
    },
    render: function(){
        var classes = React.addons.classSet({
            'form-group': true,
            'has-error': this.state.error
        });
        var hint = !this.state.error ? '' : (
            <span className="help-block col-sm-offset-4 col-sm-8">
                Bitte trage Vor- und Nachnamen ein.
                So wirst du bei der Absolventenfeier aufgerufen.
            </span>);
        return (
            <div className={classes}>
                <label className="col-sm-4 control-label">Name</label>
                <div className="col-sm-4">
                    <input
                        className="form-control"
                        placeholder="Max"
                        ref="firstname"
                        onChange={this.handleChange}/>
                </div>
                <div className="col-sm-4">
                    <input
                        className="form-control"
                        placeholder="Mustermann"
                        ref="lastname"
                        onChange={this.handleChange}/>
                </div>
                {hint}
            </div>
        );
    }
});

var ParticipantForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        this.refs.name.check();
        return;
    },
    nameInput: function(firstname, lastname){
        this.props.firstname = firstname;
        this.props.lastname = lastname;
        console.log(this.props);
    },
    render: function(){
        return (
            <form className="form-horizontal" onSubmit={this.handleSubmit}>
                <NameInput ref="name" onUserInput={this.nameInput} />
                <div className="form-group">
                    <div className="col-sm-offset-4 col-sm-8">
                        <input type="submit" className="btn btn-default" value="Post" />
                    </div>
                </div>
            </form>
        );
    }
});

React.render(<ParticipantForm />, document.getElementById('main'));
