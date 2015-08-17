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
    var app = angular.module("app", ["ngCookies", "ngRoute"]);

    app.directive('alertMessages', function(){
        return {
            restrict: 'E',
            templateUrl: '/templates/messages.html',
            controller: ['$scope', '$http', function($scope, $http){
                $scope.messages = [];
                this.messages = $scope.messages;
                this.resetMessages = function(){
                    while($scope.messages.length){
                        $scope.messages.pop();
                    }
                };
                this.resendMail = function(){
                    var mail = $scope.email;
                    $scope.loading = true;
                    $http.get("/api/resend/?email=" + mail).then(
                        function(){
                            $scope.loading = false;
                        }, function(){
                            $scope.loading = false;
                        });
                };
                $scope.resetMessages = this.resetMessages;
            }],
            controllerAs: 'messageCtrl'
        }
    });

    app.directive('mainFormular', function(){
        return {
            restrict: 'E',
            templateUrl: '/templates/main-form.html',
            controller: ['$sce', '$scope', '$http', '$compile', '$cookies',
                         '$window', '$location',
                         function($sce, $scope, $http, $compile, $cookies,
                                  $window, $location)
            {
                $scope.mailDomain = '@tu-dortmund.de';
                $http.get("/api/degrees/").then(
                    function(r){
                        $scope.degrees = r.data;
                    }, function(){
                        $scope.messages.push({
                            text: 'Es konnten nicht alle Ressourcen geladen werden. Versuche es später noch einmal.',
                            type: 'error'
                        })
                    });
                var currentLocation = $location.url();
                if(currentLocation && currentLocation != '/'){
                    var id = currentLocation.substr(1, currentLocation.indexOf('!') - 1);
                    var token = currentLocation.substr(currentLocation.indexOf('!') + 1);
                    $scope.loading = true;
                    $http.get("/api/participant/?participant_id=" + id + "&token=" + token).then(
                        function(r){
                            participantCtrl.participant = r.data;
                            participantCtrl.participant.id = id;
                            participantCtrl.updateTex();
                            $scope.loading = false;
                        }, function(){
                            $scope.loading = false;
                        });
                };
                this.updateTex = function(){
                    try {
                        var p = participantCtrl.participant;
                        p.title = p.title || "";
                        var stringArray = seperateTeX(p.title);
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
                    $scope.loading = true;
                    $scope.resetMessages();
                    var p = participantCtrl.participant;
                    $scope.email = p.email;
                    $http.post("/api/", p).then(
                        function(r){
                            console.log(r);
                            $scope.loading = false;
                            $scope.messages.push('subscriptionSuccessfull');
                            p.token = r.data.token;
                            now = new Date();
                            $cookies.putObject( 'participant', p,
                                { expires: new Date(now.getTime() + 90*24*3600*1000) });
                        }, function(){
                            $scope.loading = false;
                            $scope.messages.push('mailExists');
                        });
                };
                this.update = function(){
                    var p = participantCtrl.participant;
                    $scope.loading = true;
                    $http.post('/api/update/?participant_id=' + p.id + "&token=" + p.token, p).then(
                        function(){
                            $scope.loading = false;
                            $scope.messages.push('updateSuccessfull');
                        }, function(){
                            $scope.loading = false;
                            console.log("fail");
                        });
                };
                this.reset = function(){
                    $cookies.remove("participant");
                    $location.url('/');
                    $window.location.reload();
                };

                var participantCtrl = this;
                var pCookie = $cookies.getObject("participant");
                if(pCookie){
                    participantCtrl.participant = pCookie;
                    this.updateTex();
                } else {
                    participantCtrl.participant = {title: ""};
                }
            }],
            controllerAs: 'participantCtrl'
        }
    });
}());
