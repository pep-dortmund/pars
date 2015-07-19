(function(){
    var app = angular.module("app", []);

    app.directive('mainFormular', function(){
        return {
            restrict: 'E',
            templateUrl: 'templates/main-form.html',
            controller: function(){
                this.mailDomain = '@tu-dortmund.de';
                this.degrees = [
                    {
                        name: 'Bachelor',
                        id: 'ba'
                    },
                    {
                        name: 'Master',
                        id: 'ma'
                    },
                    {
                        name: 'Doktor',
                        id: 'dr'
                    }];

                var participant = this;
                this.save = function(){
                    console.log("Saving Participant. " + participant.firstname);
                };
            },
            controllerAs: 'participant'
        }
    });
}());
