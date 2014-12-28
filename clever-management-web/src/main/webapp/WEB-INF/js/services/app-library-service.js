angular.module('clever.management.services.appLibrary', []).service('appLibraryService', ['$http', 'APPLICATION_LIST_URL', 'TEMP_URL', 'APPLICATION_UPLOAD_URL', 'APPLICATION_BY_ID_URL',
function($http, APPLICATION_LIST_URL, TEMP_URL, APPLICATION_UPLOAD_URL, APPLICATION_BY_ID_URL) {

	this.getAllApplications = function() {
		return $http.get(APPLICATION_LIST_URL).then(function(response) {
			return response.data;
		});
	};
 
	this.getApplicationById = function(id){
		return $http.get(APPLICATION_BY_ID_URL + id).then(function(respose){
			return respose.data;
		});
	}

	this.uploadTempImage = function(img) {
		var formData = new FormData();
		formData.append('img', img);
		return $http.post(TEMP_URL + '/img', formData, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).then(function(response) {
			return response.data;
		});
	};

	this.uploadNewApplication = function(application) {
		var formData = new FormData();
		formData.append('name', application.name);
		formData.append('description', application.description);
		formData.append('url', application.url);
		formData.append('img', application.img.file);
		return $http.post(APPLICATION_UPLOAD_URL, formData, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).then(function(response) {
			return response.data;
		});
	};

	this.updateApplication = function(application) {
		var formData = new FormData();
		formData.append('name', application.name);
		formData.append('description', application.description);
		formData.append('url', application.url);
		if (application.img.file) {
			formData.append('img', application.img.file);
		}
		return $http.post(APPLICATION_BY_ID_URL + application.id, formData, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).then(function(response) {
			return response.data;
		});
	};

	this.deleteApplication = function(application) {
		return $http.delete (APPLICATION_BY_ID_URL + application.id
		).then(function(response) {
			return response.data;
		});
	};
}]);
