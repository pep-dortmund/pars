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
        $.getJSON('/admin/api/stats/', function(data){
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
            <tr key={-1}>
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

React.render(<AdminPanel />, document.getElementById('admin-panel'));
