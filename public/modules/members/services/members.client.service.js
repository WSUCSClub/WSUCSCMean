'use strict';

//Members service used to communicate Members REST endpoints
angular.module('members')

	.factory('Members', ['$resource',
	function($resource) {
		return $resource('members/:memberId', { memberId: '@_id'
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

				console.log('Notification: '+msg);
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