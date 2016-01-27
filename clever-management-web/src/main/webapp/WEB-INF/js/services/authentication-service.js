angular.module('clever.management.services.authentication', []).service('authenticationService', function($http, $interval, $q, AUTHENTICATION_URL) {

	var isAuthenticated = false;
	var userName;
	var authorities = [];
	validateAuthentication();

	//$interval(validateAuthentication, 5000);

	this.getUserName = function() {
		return userName;
	};

	this.isAuthenticated = function() {
		return isAuthenticated;
	};

	this.validateAuthentication = validateAuthentication;

	function validateAuthentication() {
		var deferred = $q.defer();
		$http.get(AUTHENTICATION_URL).success(function(data, status, headers, config) {
			deferred.resolve({
				isAuthenticated : true,
				previousIsAuthenticated : isAuthenticated,
				userName : userName,
			});
			authorities = data.authorities;
			isAuthenticated = true;
			userName = data.userName;
		}).error(function(data, status, headers, config) {
			if (status == 401) {
				deferred.resolve({
					isAuthenticated : false,
					previousIsAuthenticated : isAuthenticated,
				});
				isAuthenticated = false;
			}
			deferred.reject({
				errorStatus : status
			});
		});
		return deferred.promise;
	}


	this.allowed = function(authority) {
		if (authority == "PERMIT_ALL") {
			return true;
		} else {
			return authorities.indexOf(authority) == -1 ? false : true;
		}
	};
});
