"use strict";

var AlertMessage = React.createClass({
    displayName: "AlertMessage",

    render: function render() {
        var messages = {
            1: React.createElement(
                "div",
                { className: "alert alert-success" },
                "Du hast Dich erfolgreich zur Absolventenfeier angemeldet. Überprüfe dein Postfach für weitere Informationen. Bis bald!"
            ),
            2: React.createElement(
                "div",
                { className: "alert alert-success" },
                "Die Email wurde noch einmal versandt und sollte in ein paar Minuten in Deinem Postfach sein."
            ),
            3: React.createElement(
                "div",
                { className: "alert alert-success" },
                "Deine Daten wurden aktualisiert. Bis dann!"
            ),
            4: React.createElement(
                "div",
                { className: "alert alert-warning" },
                "Die Anmeldung ist deaktiviert. Du kannst momentan keine Änderungen vornehmen oder dich registrieren. Falls es eine dringende, kurzfristige Änderung gibt, melde Dich per Mail bei uns: ",
                React.createElement(
                    "a",
                    { href: "#" },
                    "absolventenfeier@pep-dortmund.de"
                )
            ),
            10: React.createElement(
                "div",
                { className: "alert alert-warning" },
                "Diese Email wurde bereits eingetragen. Du solltest eine Bestätigungsmail in Deinem Postfach finden, in der ein Link zur Änderung Deiner Daten aufgeführt ist.  ",
                React.createElement(
                    "a",
                    {
                        href: "#",
                        className: "alert-link",
                        onClick: this.props.callback },
                    "Email erneut versenden."
                )
            ),
            20: React.createElement(
                "div",
                { className: "alert alert-danger" },
                "Der Versand der Email ist fehlgeschlagen."
            ),
            30: React.createElement(
                "div",
                { className: "alert alert-danger" },
                "Aktualisieren fehlgeschlagen."
            )
        };
        return React.createElement(
            "div",
            { className: "col-md-12 col-lg-10 col-lg-offset-1 col-xl-8 col-xl-offset-2" },
            messages[this.props.code]
        );
    }
});

var Loader = React.createClass({
    displayName: "Loader",

    getInitialState: function getInitialState() {
        return {
            display: false
        };
    },
    render: function render() {
        var rects = [];
        var number = 3;
        var duration = 1;
        for (var i = 0; i < number; i++) {
            var rectStyle = {};
            rectStyle.animationDelay = rectStyle.WebkitAnimationDelay = i * duration / (number + 1) + 's';
            rectStyle.animationDuration = rectStyle.WebkitAnimationDuration = duration + 's';
            rects.push(React.createElement("div", { key: i, style: rectStyle, className: "loader-rect" }));
        };
        var html = React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { id: "loader", className: "col-sm-12" },
                rects
            )
        );
        if (this.state.display) {
            return html;
        } else {
            return React.createElement("div", null);
        }
    }
});

var loader = React.render(React.createElement(Loader, null), document.getElementById('loader'));

var NameInput = React.createClass({
    displayName: "NameInput",

    getInitialState: function getInitialState() {
        return {
            firstname: '',
            lastname: '',
            error: false
        };
    },
    handleChange: function handleChange() {
        this.setState({
            firstname: this.refs.firstname.getDOMNode().value,
            lastname: this.refs.lastname.getDOMNode().value
        }, function () {
            if (this.state.error) {
                this.validate();
            }
        });
        this.props.onUserInput({
            firstname: this.refs.firstname.getDOMNode().value,
            lastname: this.refs.lastname.getDOMNode().value
        });
    },
    validate: function validate() {
        var error = !this.state.firstname || !this.state.lastname;
        this.setState({ error: error });
        return !error;
    },
    render: function render() {
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
            'form-control-error': this.state.error && !this.state.lastname
        });
        var hint = !this.state.error ? '' : React.createElement(
            "span",
            { className: "help-block" },
            React.createElement(
                "small",
                null,
                "Bitte trage Vor- und Nachnamen ein. So wirst du bei der Absolventenfeier aufgerufen."
            )
        );
        return React.createElement(
            "fieldset",
            { className: classes },
            React.createElement(
                "label",
                { className: "control-label" },
                "Name"
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-sm-6" },
                    React.createElement("input", {
                        className: firstnameClasses,
                        placeholder: "Max",
                        ref: "firstname",
                        onChange: this.handleChange,
                        value: this.state.firstname,
                        readOnly: this.props.readOnly
                    })
                ),
                React.createElement(
                    "div",
                    { className: "col-sm-6" },
                    React.createElement("input", {
                        className: lastnameClasses,
                        placeholder: "Mustermann",
                        ref: "lastname",
                        value: this.state.lastname,
                        onChange: this.handleChange,
                        readOnly: this.props.readOnly
                    })
                )
            ),
            hint
        );
    }
});

var EmailInput = React.createClass({
    displayName: "EmailInput",

    getInitialState: function getInitialState() {
        return {
            error: false,
            email: '',
            disabled: false,
            mailExtension: ''
        };
    },
    validate: function validate() {
        var error = !this.state.email || !this.state.email.match(/^\w+\.\w+$/i);
        this.setState({ error: error });
        return !error;
    },
    handleChange: function handleChange(e) {
        var val = e.currentTarget.value;
        this.setState({ email: val }, function () {
            if (this.state.error) {
                this.validate();
            }
        });
        this.props.onUserInput({ email: val });
    },
    render: function render() {
        var hint = '';
        if (this.state.error) {
            if (!this.state.email) {
                hint = React.createElement(
                    "span",
                    { className: "help-block" },
                    React.createElement(
                        "small",
                        null,
                        "Bitte trage Deine Emailadresse ein."
                    )
                );
            } else {
                hint = React.createElement(
                    "span",
                    { className: "help-block" },
                    React.createElement(
                        "small",
                        null,
                        "Du kannst dich nur mit einer gültigen",
                        React.createElement(
                            "code",
                            null,
                            this.state.mailExtension
                        ),
                        "-Mailadresse eintragen."
                    )
                );
            }
        };
        var classes = React.addons.classSet({
            'form-group': true,
            'has-error': this.state.error
        });
        var disabled = this.state.disabled ? 'disabled' : '';
        return React.createElement(
            "fieldset",
            { className: classes },
            React.createElement(
                "label",
                { className: "control-label" },
                "Unimail-Adresse"
            ),
            React.createElement(
                "div",
                { className: "input-group" },
                React.createElement("input", {
                    className: "form-control",
                    placeholder: "max.mustermann",
                    ref: "email",
                    onChange: this.handleChange,
                    value: this.state.email,
                    disabled: disabled,
                    readOnly: this.props.readOnly
                }),
                React.createElement(
                    "div",
                    { className: "input-group-addon" },
                    "@tu-dortmund.de"
                )
            ),
            hint
        );
    }
});

var DegreeSelect = React.createClass({
    displayName: "DegreeSelect",

    getInitialState: function getInitialState() {
        return {
            degree: 0,
            degrees: [],
            error: false
        };
    },
    handleChange: function handleChange(e) {
        var val = e.currentTarget.value;
        this.setState({ degree: val }, function () {
            if (this.state.error) {
                this.validate();
            }
        });
        this.props.onUserInput({ degree: val });
    },
    validate: function validate() {
        var error = !this.state.degree;
        this.setState({ error: error });
        return !error;
    },
    render: function render() {
        var degrees = [];
        for (var key in this.state.degrees) {
            var degree = this.state.degrees[key];
            var checked = this.state.degree == degree.id;
            degrees.push(React.createElement(
                "label",
                { key: degree.id, className: "radio-inline" },
                React.createElement("input", {
                    name: "degree",
                    ref: "degree",
                    type: "radio",
                    onChange: this.handleChange,
                    value: degree.id,
                    checked: checked,
                    readOnly: this.props.readOnly
                }),
                degree.name
            ));
        }
        var classes = React.addons.classSet({
            'form-group': true,
            'has-error': this.state.error
        });
        var hint = !this.state.error ? '' : React.createElement(
            "span",
            { className: "help-block" },
            React.createElement(
                "small",
                null,
                "Triff bitte eine Auswahl."
            )
        );
        return React.createElement(
            "fieldset",
            { className: classes },
            React.createElement(
                "label",
                { className: "control-label" },
                "Abschluss"
            ),
            React.createElement(
                "div",
                { className: "input-group" },
                degrees
            ),
            hint
        );
    }
});

var TitleInput = React.createClass({
    displayName: "TitleInput",

    getInitialState: function getInitialState() {
        return {
            error: false,
            parseError: false,
            degree: undefined,
            degrees: {},
            renderedTex: '',
            title: ''
        };
    },
    validate: function validate() {
        var hasError = !this.state.title || this.state.parseError;
        this.setState({ error: hasError });
        return !hasError;
    },
    seperateTex: function seperateTex(string) {
        var stringArray = [];
        var index = 0;
        while (index > -1) {
            index = string.indexOf('$') > -1 ? string.indexOf('$') : string.length;
            string.substring(0, index) ? stringArray.push(string.substring(0, index)) : undefined;
            string = string.substring(index + 1, string.length);
            index = string.indexOf('$');
            if (index > -1) {
                string.substring(0, index) ? stringArray.push('$' + string.substring(0, index)) : undefined;
                string = string.substring(index + 1, string.length);
            }
        }
        return stringArray;
    },
    toTex: function toTex(str) {
        var stringArray = this.seperateTex(str);
        try {
            this.title = this.title || "";
            var completeString = "";
            for (var i = 0; i < stringArray.length; i++) {
                var string = stringArray[i];
                if (string.substring(0, 1) == "$") {
                    completeString += katex.renderToString(string.substring(1, string.length));
                } else {
                    completeString += string;
                }
            }
            this.setState({ parseError: false });
            return completeString;
        } catch (err) {
            this.setState({ parseError: true });
        };
    },
    handleChange: function handleChange(e) {
        var val = e.currentTarget.value;
        this.setState({ title: val, renderedTex: this.toTex(val) }, function () {
            if (this.state.error) {
                this.validate();
            }
        });
        this.props.onUserInput({ title: val });
    },
    render: function render() {
        var hint = '';
        if (this.state.error) {
            if (!this.state.title) {
                hint = React.createElement(
                    "span",
                    { className: "help-block" },
                    React.createElement(
                        "small",
                        null,
                        "Bitte gib hier den Titel Deiner Abschlussarbeit ein."
                    )
                );
            } else {
                hint = React.createElement(
                    "span",
                    { className: "help-block" },
                    React.createElement(
                        "small",
                        null,
                        "Anscheinend konnte dein ",
                        React.createElement(
                            "code",
                            null,
                            "LaTeX"
                        ),
                        "-nicht richtig interpretiert werden. Versuche es bitte erneut oder schaue Dir ",
                        React.createElement(
                            "a",
                            { href: 'https://github.com/Khan/KaTeX/wiki/' + 'Function-Support-in-KaTeX',
                                target: "_blank" },
                            "hier"
                        ),
                        " die unterstützten Befehle an."
                    )
                );
            }
        }
        var degreeText = '';
        if (this.state.degree in this.state.degrees) {
            degreeText = this.state.degrees[this.state.degree].name + '-';
        };
        var classes = React.addons.classSet({
            'form-group': true,
            'has-error': this.state.error
        });
        return React.createElement(
            "fieldset",
            { className: classes },
            React.createElement(
                "label",
                { className: "control-label" },
                "Titel der ",
                degreeText,
                "Arbeit ",
                React.createElement(
                    "small",
                    null,
                    "(Du kannst auch Inline-LaTeX innerhalb",
                    React.createElement(
                        "code",
                        null,
                        "$ $"
                    ),
                    " nutzen.)"
                )
            ),
            React.createElement("input", {
                type: "text",
                name: "title",
                className: "form-control",
                value: this.state.title,
                onChange: this.handleChange,
                readOnly: this.props.readOnly
            }),
            hint,
            React.createElement("p", { className: "text-center",
                dangerouslySetInnerHTML: {
                    __html: this.state.renderedTex
                } })
        );
    }
});

var GuestInput = React.createClass({
    displayName: "GuestInput",

    getInitialState: function getInitialState() {
        return {
            error: false,
            guests: this.props.value,
            maxGuests: 10
        };
    },
    validate: function validate() {
        var hasError = !this.state.guests || this.state.guests < 0 || this.state.guests > this.state.maxGuests;
        this.setState({ error: hasError });
        return !hasError;
    },
    handleChange: function handleChange(e) {
        var value = e.currentTarget.value;
        this.setState({ guests: value }, function () {
            if (this.state.error) {
                this.validate();
            }
        });
        this.props.onUserInput({ guests: value });
    },
    render: function render() {
        var hint = '';
        if (this.state.error) {
            hint = React.createElement(
                "span",
                { className: "help-block" },
                React.createElement(
                    "small",
                    null,
                    "Wie viele Gäste bringst du mit (ohne Dich mitzuzählen)? Momentan darfst du bis zu ",
                    this.state.maxGuests,
                    "  Gäste mitbringen."
                )
            );
        };
        var classes = React.addons.classSet({
            'form-group': true,
            'has-error': this.state.error
        });
        return React.createElement(
            "fieldset",
            { className: classes },
            React.createElement(
                "label",
                { className: "control-label" },
                "Anzahl der Gäste"
            ),
            React.createElement("input", {
                type: "number",
                name: "guests",
                className: "form-control",
                onChange: this.handleChange,
                value: this.state.guests,
                readOnly: this.props.readOnly
            }),
            hint
        );
    }
});

var ParticipantForm = React.createClass({
    displayName: "ParticipantForm",

    getInitialState: function getInitialState() {
        this.participant = {};
        return {
            participant: {},
            registrationIsActive: false
        };
    },
    pushMessage: function pushMessage(id, callback) {
        React.render(React.createElement(AlertMessage, { code: id, callback: callback }), document.getElementById('alert'));
    },
    componentDidMount: function componentDidMount() {
        $.getJSON('/api/config/', (function (data) {
            this.refs.degrees.setState({ degrees: data.degrees });
            this.refs.title.setState({ degrees: data.degrees });
            this.refs.email.setState({ mailExtension: data.allowed_mail });
            this.refs.guests.setState({ maxGuests: data.maximum_guests });
            this.setState({ registrationIsActive: data.registration_is_active });
            if (!data.registration_is_active) {
                this.pushMessage(4);
            }
        }).bind(this)).fail(function () {
            console.log("Error while downloading degrees.");
        });
        // check for edit-page
        var url = window.location.href;
        var params = url.match(/\d+!\w+\/$/);
        if (params) {
            loader.setState({ display: true });
            params = params[0].substr(0, params[0].length - 1);
            var id = params.split('!')[0];
            var token = params.split('!')[1];
            var requestUrl = '/api/participant/?participant_id=' + id + '&token=' + token;
            $.get(requestUrl, (function (data) {
                this.setState({ participant: data });
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
                this.id = id;
            }).bind(this)).fail((function () {
                this.pushMessage(20);
            }).bind(this)).always(function () {
                loader.setState({ display: false });
            });
        }
    },
    resendMail: function resendMail() {
        loader.setState({ display: true });
        $.get('/api/resend/?email=' + this.state.participant.email, (function () {
            this.pushMessage(2);
        }).bind(this)).fail((function () {
            this.pushMessage(20);
        }).bind(this)).always(function () {
            loader.setState({ display: false });
        });
    },
    validate: function validate() {
        var valid = true;
        valid = this.refs.name.validate() && valid;
        valid = this.refs.email.validate() && valid;
        valid = this.refs.degrees.validate() && valid;
        valid = this.refs.title.validate() && valid;
        valid = this.refs.guests.validate() && valid;
        return valid;
    },
    handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        if (this.validate()) {
            loader.setState({ display: true });
            if (this.state.participant.token) {
                var url = '/api/update/?participant_id=';
                url += this.id;
                url += '&token=';
                url += this.state.participant.token;
                loader.setState({ display: true });
                $.post(url, JSON.stringify(this.state.participant), (function () {
                    this.pushMessage(3);
                }).bind(this)).fail((function () {
                    this.pushMessage(30);
                }).bind(this)).always(function (data) {
                    loader.setState({ display: false });
                });
            } else {
                $.post('/api/', JSON.stringify(this.state.participant), (function () {
                    this.pushMessage(1);
                }).bind(this)).fail((function (data) {
                    this.pushMessage(10, this.resendMail);
                }).bind(this)).always(function () {
                    loader.setState({ display: false });
                });
            }
        }
        return;
    },
    handleUserInput: function handleUserInput(participantObject) {
        var part = this.state.participant;
        $.extend(true, part, participantObject);
        this.setState({ participant: part });
    },
    handleDegreeInput: function handleDegreeInput(obj) {
        this.handleUserInput(obj);
        this.refs.title.setState({ degree: obj.degree });
    },
    render: function render() {
        var buttons = [];
        if (!this.state.participant.token) {
            buttons.push(React.createElement(
                "button",
                {
                    type: "submit",
                    className: "btn btn-primary",
                    key: buttons.length + 1,
                    disabled: !this.state.registrationIsActive
                },
                "Eintragen"
            ));
        } else {
            buttons.push(React.createElement(
                "button",
                {
                    type: "submit",
                    className: "btn btn-primary",
                    disabled: !this.state.registrationIsActive,
                    key: buttons.length + 1 },
                "Aktualisieren"
            ));
            buttons.push(React.createElement(
                "span",
                null,
                " "
            ));
            buttons.push(React.createElement(
                "a",
                { href: "/",
                    className: "btn btn-secondary",
                    disabled: !this.state.registrationIsActive,
                    key: buttons.length + 1 },
                "Neu"
            ));
        }
        return React.createElement(
            "form",
            { onSubmit: this.handleSubmit },
            React.createElement(NameInput, {
                ref: "name",
                onUserInput: this.handleUserInput,
                readOnly: !this.state.registrationIsActive
            }),
            React.createElement(EmailInput, {
                ref: "email",
                onUserInput: this.handleUserInput,
                value: this.participant.email,
                readOnly: !this.state.registrationIsActive
            }),
            React.createElement(DegreeSelect, {
                ref: "degrees",
                source: "/api/degrees/",
                onUserInput: this.handleDegreeInput,
                readOnly: !this.state.registrationIsActive
            }),
            React.createElement(TitleInput, {
                ref: "title",
                onUserInput: this.handleUserInput,
                readOnly: !this.state.registrationIsActive
            }),
            React.createElement(GuestInput, {
                ref: "guests",
                onUserInput: this.handleUserInput,
                readOnly: !this.state.registrationIsActive
            }),
            buttons
        );
    }
});

var AdminPanel = React.createClass({
    displayName: "AdminPanel",

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
                    "span",
                    { key: key },
                    React.createElement(
                        "small",
                        null,
                        this.state.degrees[key].name,
                        ": "
                    ),
                    this.state.stats.degree_counts[key],
                    " "
                ));
            }
        }
        var head = React.createElement(
            "thead",
            null,
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    "ID"
                ),
                React.createElement(
                    "th",
                    null,
                    "Name"
                ),
                React.createElement(
                    "th",
                    null,
                    "Email ",
                    React.createElement(
                        "small",
                        null,
                        this.state.mailExtension
                    )
                ),
                React.createElement(
                    "th",
                    null,
                    "Abschluss"
                ),
                React.createElement(
                    "th",
                    null,
                    "Gäste"
                )
            )
        );
        var body = [];
        body.push(React.createElement(
            "tr",
            null,
            React.createElement(
                "td",
                { colSpan: "2" },
                "Total: ",
                this.state.stats.participant_count
            ),
            React.createElement(
                "td",
                { colSpan: "2" },
                degreeStats
            ),
            React.createElement(
                "td",
                null,
                "Total: ",
                this.state.stats.guest_count
            )
        ));
        for (var key in this.state.participants) {
            var p = this.state.participants[key];
            var degree = p.degree in this.state.degrees ? this.state.degrees[p.degree].name : '...';
            body.push(React.createElement(
                "tr",
                { key: key },
                React.createElement(
                    "td",
                    null,
                    "#",
                    p.id
                ),
                React.createElement(
                    "td",
                    null,
                    p.firstname,
                    " ",
                    p.lastname
                ),
                React.createElement(
                    "td",
                    null,
                    React.createElement(
                        "a",
                        { href: 'mailto:' + p.email + this.state.mailExtension },
                        p.email
                    )
                ),
                React.createElement(
                    "td",
                    null,
                    degree
                ),
                React.createElement(
                    "td",
                    null,
                    p.guests
                )
            ));
        }
        var registrationButtonLabel = this.state.registrationIsActive ? 'deaktivieren' : 'aktivieren';
        var buttonType = this.state.registrationIsActive ? 'warning' : 'success';
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-xs-6 col-lg-6 col-lg-offset-1 col-xl-5 col-xl-offset-2" },
                    React.createElement(
                        "h4",
                        null,
                        "Adminpanel"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-6 col-lg-4 col-xl-3 text-right" },
                    React.createElement(
                        "span",
                        { id: "disable-registration" },
                        "Anmeldung ",
                        this.state.registrationIsActive ? 'online' : 'offline',
                        " ",
                        React.createElement(
                            "button",
                            {
                                className: "btn btn-sm btn-" + buttonType,
                                onClick: this.toggleRegistrationStatus },
                            registrationButtonLabel
                        )
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-md-12 col-lg-10 col-lg-offset-1 col-xl-8 col-xl-offset-2" },
                    React.createElement(
                        "table",
                        { className: "table table-sm table-hover table-striped" },
                        head,
                        React.createElement(
                            "tbody",
                            null,
                            body
                        )
                    )
                )
            )
        );
    }
});

var admin = window.location.href.match(/\/admin\/$/);
if (admin) {
    React.render(React.createElement(AdminPanel, null), document.getElementById('admin-panel'));
} else {
    React.render(React.createElement(ParticipantForm, null), document.getElementById('main'));
}