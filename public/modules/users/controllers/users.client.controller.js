
'use strict';

// Projects controller
angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users',
	function($scope, $stateParams, $location, Authentication, Users) {
		

		$scope.authentication = Authentication;
		
		console.log(window.user);

		// Update existing Project
		$scope.update = function() {
			var user = $scope.users;

			user.$update(function() {
				$location.path('api/users/' + user._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Projects
		$scope.find = function() {
			$scope.users = Users.query();
		};


	}
]);
