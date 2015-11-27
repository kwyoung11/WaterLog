enviroHubApp.controller('uploadSingleController', function($scope) {
        $scope.pageClass = 'page-singleUpload';
        $scope.message = 'Single Upload Page';
});

enviroHubApp.directive("upload-Form", function(SessionService){
	return function(scope, element){
		$(element).form({
	    fields: {
				deviceID: {
					identifier: 'deviceID',
					rules: [
						{ type : 'integer', prompt : 'Please enter a number.'}
          //  { type : 'minLength[1]', prompt : 'Please enter at least one number.'}
					]
				},
	      pH : {
					identifier: 'pH',
	        rules: [
            { type : 'empty', prompt: "Please enter your pH" },
						{ type : 'number', prompt: "Please enter a valid pH" }
	        ]
				},
				temperature : {
					identifier: 'temperature',
					rules: [
						{ type : 'empty', prompt: "Please enter your temperature" },
						{ type : 'number', prompt: "Please enter a valid pH" }
					]
				},
				turbidity : {
					identifier: 'turbidity',
					rules: [
            { type : 'empty', prompt: "Please enter your turbidity" },
						{ type : 'number', prompt: "Please enter a valid turbidity" }
					]
				}
	    },
			inline: true,
			on: 'blur',
			transition: 'fade down',
			onSuccess: function(event, fields){
				console.log("success");
				return false;
			},
			onFailure: function(){
				console.log("fail");
				return false;
			}
		});
	}
});
