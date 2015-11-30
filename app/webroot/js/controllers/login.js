enviroHubApp.controller('loginController', function($scope)  {
	$scope.pageClass = 'page-login';
});

enviroHubApp.directive("registerForm", function(SessionService){
	return function(scope, element){
		$(element).form({
	    fields: {
				email: {
					identifier: 'email',
					rules: [
						{ type : 'email', prompt : 'Please enter a valid e-mail.' }
					]
				},
	      password_digest : {
					identifier: 'password_digest',
	        rules: [
						{ type : 'empty', prompt: "Please enter a password" },
	          { type : 'minLength[6]', prompt : 'Your password must be at least {ruleValue} characters.' }
	        ]
				},
				password_confirm : {
					identifier: 'password_confirm',
					rules: [
						{ type : 'empty', prompt: "Please Confirm your password" }
					//	{ type : 'match[password_digest]', prompt: "Passwords do not match" }
					]
				},
				terms : {
					identifier: 'terms',
					rules: [
						{ type: 'checked', prompt: "Please accept the Terms & Conditions."}
					]
				}
	    },
			inline: true,
			on: 'blur',
			transition: 'fade down',
			onSuccess: function(event, fields){
				SessionService.registerUser(fields.email, fields.password_digest);
				$(element).addClass('loading');
				return false;
			},
			onFailure: function(){
				return false;
			}
		});
	}
});

enviroHubApp.directive("loginFrom", function(SessionService){
	return function(scope, element){
		$(element).form({
	    fields: {
				email: {
					identifier: 'email',
					rules: [
						{ type : 'email', prompt : 'Please enter a valid e-mail.' }
					]
				},
	      password_digest : {
					identifier: 'password_digest',
	        rules: [
						{ type : 'empty', prompt: "Please enter a password" }
	        ]
				}
	    },
			inline: true,
			on: 'blur',
			transition: 'fade down',
			onSuccess: function(event,fields){
				SessionService.loginUser(fields.email, fields.password_digest);
				$(element).addClass('loading');
				return false;
			},
			onFailure: function(){
				return false;
			}
		});
	}
});
