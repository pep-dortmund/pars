'use strict';

var AdminPanel = React.createClass({
    displayName: 'AdminPanel',

    getInitialState: function getInitialState() {
        return {
            participants: [],
            degrees: {},
            mailExtension: '',
            stats: {},
            registrationIsActive: false
        };
    },
    componentDidMount: function componentDidMount() {
        $.getJSON('/api/config/', (function (data) {
            this.setState({
                degrees: data.degrees,
                mailExtension: data.allowed_mail
            });
        }).bind(this)).fail(function () {
            console.log("Error while downloading degrees.");
        });
        $.getJSON('/api/stats/', (function (data) {
            this.setState({
                stats: data
            });
        }).bind(this)).fail(function () {
            console.log("Error while downloading degrees.");
        });
        $.getJSON('/admin/api/participants/', (function (data) {
            this.setState({ participants: data.participants });
        }).bind(this)).fail(function () {
            console.log('fail');
        });
        $.getJSON('/api/config/', (function (data) {
            this.setState({ registrationIsActive: data.registration_is_active });
        }).bind(this));
    },
    toggleRegistrationStatus: function toggleRegistrationStatus() {
        $.getJSON('/admin/api/toggle_registration/', (function (data) {
            this.setState({ registrationIsActive: data.registration });
        }).bind(this));
    },
    render: function render() {
        var degreeStats = [];
        for (var key in this.state.stats.degree_counts) {
            if (key in this.state.degrees) {
                degreeStats.push(React.createElement(
                    'span',
                    { key: key },
                    React.createElement(
                        'small',
                        null,
                        this.state.degrees[key].name,
                        ': '
                    ),
                    this.state.stats.degree_counts[key],
                    ' '
                ));
            }
        }
        var head = React.createElement(
            'thead',
            null,
            React.createElement(
                'tr',
                null,
                React.createElement(
                    'th',
                    null,
                    'ID'
                ),
                React.createElement(
                    'th',
                    null,
                    'Name'
                ),
                React.createElement(
                    'th',
                    null,
                    'Email ',
                    React.createElement(
                        'small',
                        null,
                        this.state.mailExtension
                    )
                ),
                React.createElement(
                    'th',
                    null,
                    'Abschluss'
                ),
                React.createElement(
                    'th',
                    null,
                    'Gäste'
                )
            )
        );
        var body = [];
        body.push(React.createElement(
            'tr',
            { key: -1 },
            React.createElement(
                'td',
                { colSpan: '2' },
                'Total: ',
                this.state.stats.participant_count
            ),
            React.createElement(
                'td',
                { colSpan: '2' },
                degreeStats
            ),
            React.createElement(
                'td',
                null,
                'Total: ',
                this.state.stats.guest_count
            )
        ));
        for (var key in this.state.participants) {
            var p = this.state.participants[key];
            var degree = p.degree in this.state.degrees ? this.state.degrees[p.degree].name : '...';
            body.push(React.createElement(
                'tr',
                { key: key },
                React.createElement(
                    'td',
                    null,
                    '#',
                    p.id
                ),
                React.createElement(
                    'td',
                    null,
                    p.firstname,
                    ' ',
                    p.lastname
                ),
                React.createElement(
                    'td',
                    null,
                    React.createElement(
                        'a',
                        { href: 'mailto:' + p.email + this.state.mailExtension },
                        p.email
                    )
                ),
                React.createElement(
                    'td',
                    null,
                    degree
                ),
                React.createElement(
                    'td',
                    null,
                    p.guests
                )
            ));
        }
        var registrationButtonLabel = this.state.registrationIsActive ? 'deaktivieren' : 'aktivieren';
        var buttonType = this.state.registrationIsActive ? 'warning' : 'success';
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-xs-6 col-lg-6 col-lg-offset-1 col-xl-5 col-xl-offset-2' },
                    React.createElement(
                        'h4',
                        null,
                        'Adminpanel'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'col-xs-6 col-lg-4 col-xl-3 text-right' },
                    React.createElement(
                        'span',
                        { id: 'disable-registration' },
                        'Anmeldung ',
                        this.state.registrationIsActive ? 'online' : 'offline',
                        ' ',
                        React.createElement(
                            'button',
                            {
                                className: "btn btn-sm btn-" + buttonType,
                                onClick: this.toggleRegistrationStatus },
                            registrationButtonLabel
                        )
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-md-12 col-lg-10 col-lg-offset-1 col-xl-8 col-xl-offset-2' },
                    React.createElement(
                        'table',
                        { className: 'table table-sm table-hover table-striped' },
                        head,
                        React.createElement(
                            'tbody',
                            null,
                            body
                        )
                    )
                )
            )
        );
    }
});

React.render(React.createElement(AdminPanel, null), document.getElementById('admin-panel'));