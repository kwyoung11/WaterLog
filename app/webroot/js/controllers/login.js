enviroHubApp.controller('loginController', function($scope, LoginService)  {
	$scope.pageClass = 'page-login';
	$scope.loginStatus = LoginService.fail;

	$scope.doLogin = function(){
		if ($scope.login_form != undefined && $scope.login_form.email != undefined && $scope.login_form.password_digest != undefined)
			LoginService.loginUser($scope.login_form.email, $scope.login_form.password_digest);
	}

	$scope.doRegister = function(){
		if ($scope.register_form != undefined && $scope.register_form.email != undefined && $scope.register_form.password_digest != undefined)
			LoginService.registerUser($scope.register_form.email, $scope.register_form.password_digest);
	}

	return $scope.loginStatus;
});

enviroHubApp.directive("registerForm", function(){
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
						{ type : 'empty', prompt: "Please Confirm your password" },
						{ type : 'match[password_digest]', prompt: "Passwords do not match" }
					]
				},
				terms : {
					identifier: 'terms',
					rules: [
						{ type: 'checked', prompt: "Please accept the Terms & Conditions."}
					]
				}
	    }
	  });
	}
});

enviroHubApp.directive("loginFrom", function(){
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
	          { type : 'minLength[6]', prompt : 'Your password must be at least {ruleValue} characters.' }
	        ]
				}
	    }
	  });
	}
});
