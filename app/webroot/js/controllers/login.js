
enviroHubApp.controller('loginController', function($scope, LoginService)  {
	$scope.pageClass = 'page-login';
	$scope.loginStatus = LoginService.success;
	$scope.message = 'login page';

	var vm = this;

	function login() {
		LoginService.Login(vm.userID, vm.password, function(response){
			if (response.success){
				$scope.loginStatus = LoginService.success;
			} else {
				$scope.loginStatus = LoginService.fail;
			}
		});
		return $scope.loginStatus;
	}
});
