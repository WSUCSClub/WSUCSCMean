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
