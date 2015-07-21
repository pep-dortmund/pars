(function(){
    var app = angular.module("app", []);

    app.directive('mainFormular', function(){
        return {
            restrict: 'E',
            templateUrl: 'templates/main-form.html',
            controller: ['$sce', function($sce){
                this.mailDomain = '@tu-dortmund.de';
                this.degrees = {
                    'ba': {'id': 'ba', 'name': 'Bachelor'},
                    'ma': {'id': 'ma', 'name': 'Master'},
                    'dr': {'id': 'dr', 'name': 'Doktor'}
                }
                this.title = "";

                var participant = this;

                this.updateTex = function(){
                    try {
                        participant.title = participant.title || "";
                        participant.tex = $sce.trustAsHtml(
                            "Machbarkeitsstudie " + katex.renderToString(participant.title) + " blabla"
                        );
                    }
                    catch(ParseError){ }
                }

                this.save = function(){
                    console.log("Saving Participant. " + participant.firstname);
                };
            }],
            controllerAs: 'participant'
        }
    });
}());
