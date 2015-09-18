'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'wsucsclub';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('emails');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('members');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('projects');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.alerts = [
			{
				icon: 'glyphicon-user' ,
				color:'btn-primary' ,
				total: '35' ,
				description: 'TOTAL MEMBERS',
				templateUrl: 'members'
			},

			{
				icon: 'glyphicon-blackboard' ,
				color:'btn-info' ,
				total: '5' ,
				description: 'TOTAL PROJECTS',
				templateUrl: 'projects'

			},
			{
				icon: 'glyphicon-star' ,
				color:'btn-warning' ,
				total: '3' ,
				description: 'TOTAL AWARDS'
			},

			{
				icon: 'glyphicon-align-left' ,
				color:'btn-warning' ,
				total: '1204' ,
				description: 'TOTAL POSTS'
			},

			{
				icon: 'glyphicon-calendar' ,
				color:'btn-success' ,
				total: '3' ,
				description: 'UPCOMING EVENTS'
			},

			{
				icon: 'glyphicon-phone' ,
				color:'btn-primary' ,
				total: '11' ,
				description: 'TOTAL APPS DEVELOPED'
			}

		];
	}
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('emails').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Emails', 'emails', 'dropdown', '/emails(/create)?');
		Menus.addSubMenuItem('topbar', 'emails', 'List Emails', 'emails');
		Menus.addSubMenuItem('topbar', 'emails', 'New Email', 'emails/create');
	}
]);
'use strict';

//Setting up route
angular.module('emails').config(['$stateProvider',
	function($stateProvider) {
		// Emails state routing
		$stateProvider.
		state('listEmails', {
			url: '/emails',
			templateUrl: 'modules/emails/views/list-emails.client.view.html'
		}).
		state('createEmail', {
			url: '/emails/create',
			templateUrl: 'modules/emails/views/create-email.client.view.html'
		}).
		state('viewEmail', {
			url: '/emails/:emailId',
			templateUrl: 'modules/emails/views/view-email.client.view.html'
		}).
		state('editEmail', {
			url: '/emails/:emailId/edit',
			templateUrl: 'modules/emails/views/edit-email.client.view.html'
		});
	}
]);
'use strict';

// Emails controller
angular.module('emails').controller('EmailsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Emails',
	function($scope, $stateParams, $location, Authentication, Emails) {
		$scope.authentication = Authentication;

		// Create new Email
		$scope.create = function() {
			// Create new Email object
			var email = new Emails ({
				name: this.name
			});

			// Redirect after save
			email.$save(function(response) {
				$location.path('emails/' + response._id);

				// Clear form fields
				$scope.name = '';
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
				$location.path('emails/' + email._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
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
'use strict';

//Emails service used to communicate Emails REST endpoints
angular.module('emails').factory('Emails', ['$resource',
	function($resource) {
		return $resource('api/emails/:emailId', { emailId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('members').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Members', 'members', 'dropdown', '/members(/create)?');
        Menus.addSubMenuItem('topbar', 'members', 'List members', 'members');
        Menus.addSubMenuItem('topbar', 'members', 'New member', 'members/create');
    }
]);
'use strict';

//Setting up route
angular.module('members').config(['$stateProvider',
	function($stateProvider) {
		// Members state routing
		$stateProvider.
		state('listMembers', {
			url: '/members',
			templateUrl: 'modules/members/views/list-members.client.view.html'
		}).
		state('createMember', {
			url: '/members/create',
			templateUrl: 'modules/members/views/create-member.client.view.html'
		}).
		state('viewMember', {
			url: '/members/:memberId',
			templateUrl: 'modules/members/views/view-member.client.view.html'
		}).
		state('editMember', {
			url: '/members/:memberId/edit',
			templateUrl: 'modules/members/views/edit-member.client.view.html'
		});

	/*	if(window.history && window.history.pushState) {
			// use the HTML5 History API
			$locationProvider.html5Mode(true);
		}*/
	}
]);

'use strict';
	var membersApp = angular.module('members');
	// Members controller..


	membersApp.controller('MembersController', ['$scope', '$stateParams', '$modal', '$log','Authentication', 'Members', 'Notify',
		function($scope, $stateParams, $modal, $log, Authentication , Members, Notify) {

			this.authentication = Authentication;

			$scope.loading = true;

			// Find a list of Members
			this.members = Members.query(function(){
				$scope.loading = false;
			});

			// Find existing Member
			/*$scope.findOne = function() {
				$scope.member = Members.get({
					memberId: $stateParams.memberId
				});
			};*/



			// Open a modal window to update a single member
			this.animationsEnabled = true;

			this.viewMember = function (size, selectedMember ) {

				var modalInstance = $modal.open({
					animation: $scope.animationsEnabled,
					templateUrl: 'modules/members/views/view-member.client.view.html',
					controller: ["$scope", "$modalInstance", "member", function($scope, $modalInstance, member){
						$scope.member = member;

						$scope.cancel = function () {
							$modalInstance.dismiss('cancel');
						};

						$scope.ok = function () {
							$modalInstance.close($scope.member);
						};
					}],
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
					controller: ["$scope", "$modalInstance", function($scope, $modalInstance){
						$scope.cancel = function () {
							$modalInstance.dismiss('cancel');
						};

						$scope.ok = function () {
							$modalInstance.close($scope.member);
						};
					}],
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
					controller: ["$scope", "$modalInstance", "member", function($scope, $modalInstance, member){
						$scope.member = member;

						$scope.cancel = function () {
							$modalInstance.dismiss('cancel');
						};

						$scope.ok = function () {
							$modalInstance.close($scope.member);
						};


					}],
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

'use strict';

//Members service used to communicate Members REST endpoints
angular.module('members')

	.factory('Members', ['$resource',
	function($resource) {
		return $resource('api/members/:memberId', { memberId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
	.factory('Notify', ['$rootScope',
		function($rootScope) {
			var notify = {} ;

			notify.sendMsg = function(msg, data){
				data = data || {};
				$rootScope.$emit(msg, data);
				if (msg === 'NewMember'){
					console.log('Notification: New Member is created');
				}
				else if (msg === 'MemberRemoved') {
					console.log('Notification: Member is updated');
				}
				else if (msg === 'MemberUpdated'){
					console.log('Notification: Member is removed');
				}
				else{
					console.log('Notification: '+ msg);
				}
			};

			notify.getMsg = function(msg, func, scope){
				var unbind = $rootScope.$on(msg, func);

				if (scope) {
					scope.$on('destroy', unbind);
				}
			};

			return notify;
		}
	]);

'use strict';

// Configuring the Articles module
angular.module('projects').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Projects', 'projects', 'dropdown', '/projects(/create)?');
		Menus.addSubMenuItem('topbar', 'projects', 'List Projects', 'projects');
		Menus.addSubMenuItem('topbar', 'projects', 'New Project', 'projects/create');
	}
]);
'use strict';

//Setting up route
angular.module('projects').config(['$stateProvider',
	function($stateProvider) {
		// Projects state routing
		$stateProvider.
		state('listProjects', {
			url: '/projects',
			templateUrl: 'modules/projects/views/list-projects.client.view.html'
		}).
		state('createProject', {
			url: '/projects/create',
			templateUrl: 'modules/projects/views/create-project.client.view.html'
		}).
		state('viewProject', {
			url: '/projects/:projectId',
			templateUrl: 'modules/projects/views/view-project.client.view.html'
		}).
		state('editProject', {
			url: '/projects/:projectId/edit',
			templateUrl: 'modules/projects/views/edit-project.client.view.html'
		});
	}
]);
'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects',
	function($scope, $stateParams, $location, Authentication, Projects) {
		$scope.authentication = Authentication;

		// Create new Project
		$scope.create = function() {
			// Create new Project object
			var project = new Projects ({
				name: this.name
			});

			// Redirect after save
			project.$save(function(response) {
				$location.path('projects/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Project
		$scope.remove = function(project) {
			if ( project ) { 
				project.$remove();

				for (var i in $scope.projects) {
					if ($scope.projects [i] === project) {
						$scope.projects.splice(i, 1);
					}
				}
			} else {
				$scope.project.$remove(function() {
					$location.path('projects');
				});
			}
		};

		// Update existing Project
		$scope.update = function() {
			var project = $scope.project;

			project.$update(function() {
				$location.path('projects/' + project._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Projects
		$scope.find = function() {
			$scope.projects = Projects.query();
		};

		// Find existing Project
		$scope.findOne = function() {
			$scope.project = Projects.get({ 
				projectId: $stateParams.projectId
			});
		};
	}
]);
'use strict';

//Projects service used to communicate Projects REST endpoints
angular.module('projects').factory('Projects', ['$resource',
	function($resource) {
		return $resource('api/projects/:projectId', { projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('api/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('api/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('api/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('api/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('api/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('api/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('api/users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
