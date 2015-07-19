(function(){
    var app = angular.module("app", []);

    app.directive('mainFormular', function(){
        return {
            restrict: 'E',
            templateUrl: 'templates/main-form.html',
            controller: function(){
                this.mailDomain = '@tu-dortmund.de';
                this.degrees = {
                    'ba': {'id': 'ba', 'name': 'Bachelor'},
                    'ma': {'id': 'ma', 'name': 'Master'},
                    'dr': {'id': 'dr', 'name': 'Doktor'}
                }

                var participant = this;
                this.save = function(){
                    console.log("Saving Participant. " + participant.firstname);
                };
            },
            controllerAs: 'participant'
        }
    });
}());
