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
				templateUrl: '/modules/members/views/list-members.client.view.html'
			},

			{
				icon: 'glyphicon-blackboard' ,
				color:'btn-info' ,
				total: '5' ,
				description: 'TOTAL PROJECTS'
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
