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
                    $http.get("/api/resend/?email=" + mail)
                        .success(function(data, status, headers, config){
                            console.log(status);
                        })
                        .error(function(data, status, headers, config){
                            console.log(status);
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
                $http.get("/api/degrees")
                    .success(function(data, status, headers, config){
                        $scope.degrees = data;
                    })
                    .error(function(data, status, headers, config){
                        $scope.messages.push({
                            text: 'Es konnten nicht alle Ressourcen geladen werden. Versuche es später noch einmal.',
                            type: 'error'
                        })
                    });
                var currentLocation = $location.url();
                if(currentLocation){
                    var id = currentLocation.substr(1, currentLocation.indexOf('!') - 1);
                    var token = currentLocation.substr(currentLocation.indexOf('!') + 1);
                    $http.get("/api/participant/?participant_id=" + id + "&token=" + token)
                        .success(function(data, status, headers, config){
                            console.log(data);
                            participantCtrl.participant = data;
                            participantCtrl.updateTex()
                        })
                        .error(function(data, status, headers, config){
                            console.log(data);
                        });
                }
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
                    $http.post("/api/", p)
                        .success(function(data, status, headers, config){
                            $scope.loading = false;
                            $scope.messages.push('subscriptionSuccessfull');
                            p.token = data.token;
                            now = new Date();
                            $cookies.putObject( 'participant', p,
                                { expires: new Date(now.getTime() + 90*24*3600*1000) });
                        }).error(function(data, status, headers, config){
                            $scope.loading = false;
                            $scope.messages.push('mailExists');
                        });
                };
                this.update = function(){
                    console.log("updating participant");
                    console.log(participantCtrl.participant);
                }
                this.reset = function(){
                    $cookies.remove("participant");
                    $location.url('/');
                    $window.location.reload();
                }

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
