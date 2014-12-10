angular.module('clever.management.services.resource', []).service('resourceService', function($http, $state) {
	this.get = function(url) {
		$http.get(url).success(function(data, status, headers, config) {
			return data;
		}).error(function(data, status, headers, config) {
			if (status == 401) {
				$state.go('login', {
					errorType : 'SessionExpired'
				});
			}
		});
	};
});
