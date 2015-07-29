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

(function(){
    var app = angular.module("app", []);

    app.directive('mainFormular', function(){
        return {
            restrict: 'E',
            templateUrl: 'templates/main-form.html',
            controller: ['$sce', '$scope', '$http', function($sce, $scope, $http){
                $scope.mailDomain = '@tu-dortmund.de';
                $scope.degrees = {
                    'ba': {'id': 'ba', 'name': 'Bachelor'},
                    'ma': {'id': 'ma', 'name': 'Master'},
                    'dr': {'id': 'dr', 'name': 'Doktor'}
                }
                var participant = this;

                participant.title = "";

                this.updateTex = function(){
                    try {
                        participant.title = participant.title || "";
                        var stringArray = seperateTeX(participant.title);
                        var completeString = "";
                        for(var i=0; i<stringArray.length; i++){
                            var string = stringArray[i];
                            if(string.substring(0, 1) == "$"){
                                completeString += katex.renderToString(
                                    string.substring(1, string.length)
                                );
                            } else {
                                completeString += string;
                            }
                        }
                        $scope.tex = $sce.trustAsHtml(completeString);
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
