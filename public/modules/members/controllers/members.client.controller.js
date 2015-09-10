'use strict';
	var membersApp = angular.module('members');
	// Members controller..


	membersApp.controller('MembersController', ['$scope', '$stateParams', 'Authentication', 'Members',
		function($scope, $stateParams, Authentication, Members) {

			this.authentication = Authentication;

			// Find a list of Members
			this.members = Members.query();

			// Find existing Member
			$scope.findOne = function() {
				$scope.member = Members.get({
					memberId: $stateParams.memberId
				});
			};
		}
	]);

	membersApp.controller('MembersCreateController', ['$scope', '$stateParams',  'Members',
		function($scope, Members, $stateParams) {

			// Create new Member

			this.create = function() {
				// Create new Member object
				var member = new Members ({
					firstName: this.firstName,
					lastName: this.lastName,
					email: this.email,
					username: this.username,
					phone: this.phone
				});

				console.log(member);

				// Redirect after save
				member.$save(function(response) {
					$location.path('members/' + response._id);

					// Clear form fields
					$scope.firstName = '';
					$scope.lastName = '';
					$scope.email = '';
					$scope.username = '';
					$scope.phone = '';

				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};




		}
	]);


	membersApp.controller('MembersEditController', ['$scope', 'Members',
		function($scope, Members) {

			// Update existing Member
			$scope.update = function() {
				var member = $scope.member;

				member.$update(function() {
					$location.path('members/' + member._id);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};


			// Remove existing Member
			$scope.remove = function(member) {
				if ( member ) {
					member.$remove();

					for (var i in $scope.members) {
						if ($scope.members [i] === member) {
							$scope.members.splice(i, 1);
						}
					}
				} else {
					$scope.member.$remove(function() {
						$location.path('members');
					});
				}
			};

		}
	]);

/*
*/
