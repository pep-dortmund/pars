var AdminPanel = React.createClass({
    getInitialState: function(){
        return {
            participants: [],
            degrees: {},
            mailExtension: '',
            stats: {},
            registrationIsActive: false,
            order: 'Name_0'
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
    orderBy: function(e){
        var parts = this.state.participants;
        var order = this.state.order;
        var newOrder = '';
        switch(e.currentTarget.innerText){
            case 'Name': {
                parts = parts.sort(function(a, b){
                    switch(order){
                        case 'Name_0': {
                            newOrder = 'Name_1';
                            return a.firstname < b.firstname;
                        }
                        case 'Name_1': {
                            newOrder = 'Name_2';
                            return a.lastname > b.lastname;
                        }
                        case 'Name_2': {
                            newOrder = 'Name_3';
                            return a.lastname < b.lastname;
                        }
                        default: { // Name_3
                            newOrder = 'Name_0';
                            return a.firstname > b.firstname;
                        }
                    };
                });
                break;
            }
            case 'ID': {
                parts = parts.sort(function(a, b){
                    switch(order){
                        case 'ID_0': {
                            newOrder = 'ID_1';
                            return a.id < b.id;
                        }
                        default: { // ID_1
                            newOrder = 'ID_0';
                            return a.id > b.id;
                        }
                    }
                });
                break;
            }
            case 'Abschluss': {
                parts = parts.sort(function(a, b){
                    switch(order){
                        case 'degree_0': {
                            newOrder = 'degree_1';
                            return a.degree < b.degree;
                        }
                        default: { // degree_1
                            newOrder = 'degree_0';
                            return a.degree > b.degree;
                        }
                    }
                });
                break;
            }
            case 'Gäste': {
                parts = parts.sort(function(a, b){
                    switch(order){
                        case 'guests_0': {
                            newOrder = 'guests_1';
                            return a.guests < b.guests;
                        }
                        default: { // guests_1
                            newOrder = 'guests_0';
                            return a.guests > b.guests;
                        }
                    }
                });
                break;
            }
            case 'Verifiziert': {
                parts = parts.sort(function(a, b){
                    switch(order){
                        case 'verified_0': {
                            newOrder = 'verified_1';
                            return a.verified < b.verified;
                        }
                        default: { // verified_1
                            newOrder = 'verified_0';
                            return a.verified > b.verified;
                        }
                    }
                });
                break;
            }
            case 'Zeitstempel': {
                parts = parts.sort(function(a, b){
                    switch(order){
                        case 'date_0': {
                            newOrder = 'date_1';
                            return a.registration_date < b.registration_date;
                        }
                        default: { // date_1
                            newOrder = 'date_0';
                            return a.registration_date > b.registration_date;
                        }
                    }
                });
                break;
            }
            default: undefined;
        };
        this.setState({
            participants: parts,
            order: newOrder
        });
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
                    <th onClick={this.orderBy}>ID</th>
                    <th onClick={this.orderBy}>Name</th>
                    <th onClick={this.orderBy}>Abschluss</th>
                    <th>Email <small>{this.state.mailExtension}</small></th>
                    <th onClick={this.orderBy}>Gäste</th>
                    <th onClick={this.orderBy}>Verifiziert</th>
                    <th onClick={this.orderBy}>Zeitstempel</th>
                </tr>
            </thead>
        );
        var body = [];
        body.push(
            <tr key={-1}>
                <td colSpan="2">Total: {this.state.stats.participant_count}</td>
                <td colSpan="2">{degreeStats}</td>
                <td>Total: {this.state.stats.guest_count}</td>
                <td></td>
                <td></td>
            </tr>
        )
        for(var key in this.state.participants){
            var p = this.state.participants[key];
            var degree = p.degree in this.state.degrees ?
                this.state.degrees[p.degree].name :
                '...';
            var spanClasses = classNames({
                'glyphicon': true,
                'glyphicon-minus-sign': !p.verified,
                'icon-minus-sign': !p.verified,
                'glyphicon-ok-circle': p.verified,
                'icon-ok-circle': p.verified
            });
            var verified = (
                <span className={spanClasses}></span>
            );
            var d = new Date(Date.parse(p.registration_date));
            body.push(
                <tr key={key}>
                    <td>#{p.id}</td>
                    <td>{p.firstname} {p.lastname}</td>
                    <td>{degree}</td>
                    <td>
                        <a href={'mailto:' + p.email + this.state.mailExtension}>
                        {p.email}</a>
                    </td>
                    <td>{p.guests}</td>
                    <td>{verified}</td>
                    <td>{d.getFullYear()}-{d.getMonth()}-{d.getDate()} {d.getHours()}:{d.getMinutes()}</td>
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
