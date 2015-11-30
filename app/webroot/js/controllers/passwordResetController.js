enviroHubApp.controller('passwordResetController', function($scope, SessionService, PubSubService)  {
	$scope.pageClass = 'page-login';
	$scope.loginStatus = SessionService.loginFail;
	
	return $scope.loginStatus;
});
  
  enviroHubApp.directive("resetPassword", function(SessionService, PubSubService) {

			return function(scope, element) {
				$(element).form({
			    fields: {
						email: {
							identifier: 'email',
							rules: [
								{ type : 'email', prompt : 'Please enter a valid e-mail.' }
							]
						},
			    },
					inline: true,
					on: 'blur',
					transition: 'fade down',
					onSuccess: function(event, fields) {
						$(element).addClass('loading');
						console.log("success");
						console.log(fields);
						
						SessionService.resetPassword(fields.email, element);
						return false;
					},
					onFailure: function() {
						console.log("fail");
						return false;
					}
				});
			}
	});

	enviroHubApp.directive("resetPasswordEdit", function(SessionService) {
			return function(scope, element) {
				$(element).form({
			    fields: {
						email: {
							identifier: 'password_digest',
							rules: [
								{ type : 'password', prompt : 'Please enter a valid password.' }
							]
						},
			    },
					inline: true,
					on: 'blur',
					transition: 'fade down',
					onSuccess: function(event, fields) {
						console.log("success");
						console.log(fields);
						SessionService.resetPasswordUpdate(fields.password_digest, element);
						return false;
					},
					onFailure: function(){
						console.log("fail");
						return false;
					}
				});
			}
	});

