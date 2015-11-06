'use strict';

// Emails controller
angular.module('emails').controller('EmailsController', ['$scope',  '$stateParams', '$location', 'Authentication' ,'Members', 'Emails',
	function($scope, $stateParams, $location, Authentication, Members, Emails) {
		
		$scope.authentication = Authentication;

        var members = Members.query();

 		$scope.SendTo = members;


         $scope.loadTags = function($query) {
            //return Members.query().email;
            return members; 

           // return $http.get('/tags?query=' + query);
        };

		// Create new Email
		$scope.create = function() {
			// Create new Email object
			var email = new Emails ({
				content: this.content,
				subject: this.subject
			});

			// Redirect after save
			email.$save(function(response) {
				$location.path('api/emails/' + response._id);

				// Clear form fields
				$scope.content = 'No text'; 
				$scope.subject = 'No subject'; 

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Email
		$scope.remove = function(email) {
			if ( email ) { 
				email.$remove();

				for (var i in $scope.emails) {
					if ($scope.emails [i] === email) {
						$scope.emails.splice(i, 1);
					}
				}
			} else {
				$scope.email.$remove(function() {
					$location.path('emails');
				});
			}
		};

		// Update existing Email
		$scope.update = function() {
			var email = $scope.email;

			email.$update(function() {
				$location.path('/emails/' + email._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.sendEmail = function() {
			//for(var i = 0; i < $scope.SendTo.length; i++)

			console.log($scope.SendTo);


			$http
			.post('/sendEmail', data, config)
			.then(successCallback, errorCallback);

		};


		// Find a list of Emails
		$scope.find = function() {
			$scope.emails = Emails.query();
		};

		// Find existing Email
		$scope.findOne = function() {
			$scope.email = Emails.get({ 
				emailId: $stateParams.emailId
			});
		};
	}
]);