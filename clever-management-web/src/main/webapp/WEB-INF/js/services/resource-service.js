angular.module('clever.management.services.resource', []).service('resourceService', function($http, $q, $state) {

	this.get = function(url, config) {
		var deferred = $q.defer();
		$http.get(url, config).success(function(data, status, headers, config) {
			deferred.resolve(data);
		}).error(function(data, status, headers, config) {
			errorStateCatch(status);
		});
		return deferred.promise;
	};

	this.post = function(url, data, config) {
		var deferred = $q.defer();
		$http.post(url, data, config).success(function(data, status, headers, config) {
			deferred.resolve(data);
		}).error(function(data, status, headers, config) {
				errorStateCatch(status);
		});
		return deferred.promise;
	};

	this.load = function(urls) {
		var deferred = $q.defer();
		require(urls, function() {
			deferred.resolve();
		});
		return deferred.promise;
	};

	this.delete = function(url, data, config) {
		var deferred = $q.defer();
		$http.delete(url, data, config).success(function(data, status, headers, config) {
			deferred.resolve(data);
		}).error(function(data, status, headers, config) {
			errorStateCatch(status);
		});
		return deferred.promise;
	};

	function errorStateCatch(status) {
		if (status == 401) {
			$state.go('login', {
				errorType : 'SessionExpired'
			});
		}
		if(status == 403){
			$state.go('forbidden');
		}
		if(status == 404){
			$state.go('notfound');
		}
	}

});
