var AdminPanel = React.createClass({
    getInitialState: function(){
        return {
            participants: [],
            degrees: {},
            mailExtension: '',
            stats: {},
            registrationIsActive: false,
            order: 'Name_0',
            orderLabel: 'ID ↑'
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
        var orderLabel = '';
        switch(e.currentTarget.innerHTML){
            case 'Name': {
                parts = parts.sort(function(a, b){
                    switch(order){
                        case 'Name_0': {
                            newOrder = 'Name_1';
                            orderLabel = 'Vorname ↓';
                            return b.firstname.localeCompare(a.firstname);
                        }
                        case 'Name_1': {
                            newOrder = 'Name_2';
                            orderLabel = 'Nachname ↑';
                            return a.lastname.localeCompare(b.lastname);
                        }
                        case 'Name_2': {
                            newOrder = 'Name_3';
                            orderLabel = 'Nachname ↓';
                            return b.lastname.localeCompare(a.lastname);
                        }
                        default: { // Name_3
                            newOrder = 'Name_0';
                            orderLabel = 'Vorname ↑';
                            return a.firstname.localeCompare(b.firstname);
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
                            orderLabel = 'ID ↓';
                            return b.id - a.id;
                        }
                        default: { // ID_1
                            newOrder = 'ID_0';
                            orderLabel = 'ID ↑';
                            return a.id - b.id;
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
                            orderLabel = 'Abschluss ↓';
                            return b.degree - a.degree;
                        }
                        default: { // degree_1
                            newOrder = 'degree_0';
                            orderLabel = 'Abschluss ↑';
                            return a.degree - b.degree;
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
                            orderLabel = 'Gäste ↓';
                            return b.guests - a.guests;
                        }
                        default: { // guests_1
                            newOrder = 'guests_0';
                            orderLabel = 'Gäste ↑';
                            return a.guests - b.guests;
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
                            orderLabel = 'Verifiziert ↓';
                            return b.verified - a.verified;
                        }
                        default: { // verified_1
                            newOrder = 'verified_0';
                            orderLabel = 'Verifiziert ↑';
                            return a.verified - b.verified;
                        }
                    }
                });
                break;
            }
            case 'Zeitstempel': {
                parts = parts.sort(function(a, b){
                    var date_a = new Date(Date.parse(a.registration_date));
                    var date_b = new Date(Date.parse(b.registration_date));
                    switch(order){
                        case 'date_0': {
                            newOrder = 'date_1';
                            orderLabel = 'Datum ↓';
                            return date_b - date_a;
                        }
                        default: { // date_1
                            newOrder = 'date_0';
                            orderLabel = 'Datum ↑';
                            return date_a - date_b;
                        }
                    }
                });
                break;
            }
            default: undefined;
        };
        this.setState({
            participants: parts,
            order: newOrder,
            orderLabel: orderLabel
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
                    <th><a href="#" onClick={this.orderBy}>ID</a></th>
                    <th><a href="#" onClick={this.orderBy}>Name</a></th>
                    <th><a href="#" onClick={this.orderBy}>Abschluss</a></th>
                    <th>Email <small>{this.state.mailExtension}</small></th>
                    <th><a href="#" onClick={this.orderBy}>Gäste</a></th>
                    <th><a href="#" onClick={this.orderBy}>Verifiziert</a></th>
                    <th><a href="#" onClick={this.orderBy}>Zeitstempel</a></th>
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
            var month = ("0" + d.getMonth()).slice(-2);
            var date = ("0" + d.getDate()).slice(-2);
            var h = ("0" + d.getHours()).slice(-2);
            var m = ("0" + d.getMinutes()).slice(-2);
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
                    <td>{d.getFullYear()}-{month}-{date} {h}:{m}</td>
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
                        <h4>Adminpanel <small>{this.state.orderLabel}</small></h4>
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
