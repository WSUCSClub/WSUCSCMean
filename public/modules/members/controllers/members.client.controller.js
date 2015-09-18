'use strict';
	var membersApp = angular.module('members');
	// Members controller..


	membersApp.controller('MembersController', ['$scope', '$stateParams', '$modal', '$log','Authentication', 'Members', 'Notify',
		function($scope, $stateParams, $modal, $log, Authentication , Members, Notify) {

			this.authentication = Authentication;

			$scope.loading = true;

			// Find a list of Members
			this.members = Members.query();

			// Find existing Member
			$scope.findOne = function() {
				$scope.member = Members.get({
					memberId: $stateParams.memberId
				});
			};



			// Open a modal window to update a single member
			this.animationsEnabled = true;

			this.viewMember = function (size, selectedMember ) {

				var modalInstance = $modal.open({
					animation: $scope.animationsEnabled,
					templateUrl: 'modules/members/views/view-member.client.view.html',
					controller: function($scope, $modalInstance, member){
						$scope.member = member;

						$scope.cancel = function () {
							$modalInstance.dismiss('cancel');
						};

						$scope.ok = function () {
							$modalInstance.close($scope.member);
						};
					},
					size: size,
					resolve: {
						member: function () {
							return selectedMember;
						}
					}
				});

				modalInstance.result.then(function (selectedMember) {
					$scope.selected = selectedMember;
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
				});
			};

			// Open a model window to Create a single member record
			this.createMember = function (size) {

				var modalInstance = $modal.open({
					animation: $scope.animationsEnabled,
					templateUrl: 'modules/members/views/create-member.client.view.html',
					controller: function($scope, $modalInstance){
						$scope.cancel = function () {
							$modalInstance.dismiss('cancel');
						};

						$scope.ok = function () {
							$modalInstance.close($scope.member);
						};
					},
					size: size
				});

				modalInstance.result.then(function(selectedMember){
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
				});
			};


			this.editMember = function (size, selectedMember ) {

				var modalInstance = $modal.open({

					templateUrl: 'modules/members/views/edit-member.client.view.html',
					controller: function($scope, $modalInstance, member){
						$scope.member = member;

						$scope.cancel = function () {
							$modalInstance.dismiss('cancel');
						};

						$scope.ok = function () {
							$modalInstance.close($scope.member);
						};


					},
					size: size,
					resolve: {
						member: function () {
							return selectedMember;
						}
					}
				});

				modalInstance.result.then(function (selectedItem) {
					$scope.selected = selectedItem;
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
				});
			};

		}
	]);

	membersApp.controller('MembersCreateController', ['$scope',  'Members', 'Notify',
		function($scope, Members, Notify) {

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

					Notify.sendMsg('NewMember', {'id': response._id});

				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};




		}
	]);


	membersApp.controller('MembersEditController', ['$scope', 'Members', 'Notify',
		function($scope, Members, Notify) {


			// Update existing Member
			this.update = function(updatedMember) {
				var member = updatedMember;

				member.$update(function(response) {
					Notify.sendMsg('MemberUpdated', {'id': response._id});

				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};


			// Remove existing Member
			this.remove = function(member) {
				if ( member ) {
					member.$remove(function(response){
						Notify.sendMsg('MemberRemoved', {'id': response._id});
					});

					for (var i in this.members) {
						if (this.members [i] === member) {
							this.members.splice(i, 1);
						}
					}
				} else {
					this.member.$remove(function(response) {
						Notify.sendMsg('MemberRemoved', {'id': response._id});
					});
				}
			};


		}
	]);

	membersApp.directive('memberList', ['Members', 'Notify', function( Members, Notify) {
		return {
			restrict: 'E',
			transclude: true,
			templateUrl: 'modules/members/views/member-list.client.view.html',
			link: function(scope, element, attrs){
				// When a new member is added update, the customer List

				Notify.getMsg('NewMember', function(event,data){
					scope.membersCtrl.members = Members.query();
				});

				Notify.getMsg('MemberRemoved', function(event,data){
					scope.membersCtrl.members = Members.query();
				});

				Notify.getMsg('MemberUpdated', function(event,data){
					scope.membersCtrl.members = Members.query();
				});

			}
		};
	}]);


/*
*/
