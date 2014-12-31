angular.module('clever.management.services.appLibrary', []).service('appLibraryService', ['resourceService', 'APPLICATION_LIST_URL', 'TEMP_URL', 'APPLICATION_UPLOAD_URL', 'APPLICATION_BY_ID_URL',
function(rescourceService, APPLICATION_LIST_URL, TEMP_URL, APPLICATION_UPLOAD_URL, APPLICATION_BY_ID_URL) {

	var currentApp = null;

	this.setCurrentApp = function(application){
		currentApp = application;
	}

	this.getCurrentApp = function(){
		return currentApp;
	}

	this.getAllApplications = function() {
		return rescourceService.get(APPLICATION_LIST_URL).then(function(response) {
			return response;
		});
	};
 
	this.getApplicationById = function(id){
		return rescourceService.get(APPLICATION_BY_ID_URL + id).then(function(respose){
			return respose;
		});
	}

	this.uploadTempImage = function(img) {
		var formData = new FormData();
		formData.append('img', img);
		return rescourceService.post(TEMP_URL + '/img', formData, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).then(function(response) {
			return response;
		});
	};

	this.uploadNewApplication = function(application) {
		var formData = new FormData();
		formData.append('name', application.name);
		formData.append('description', application.description);
		formData.append('url', application.url);
		formData.append('img', application.img.file);
		return rescourceService.post(APPLICATION_UPLOAD_URL, formData, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).then(function(response) {
			return response;
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
		return rescourceService.post(APPLICATION_BY_ID_URL + application.id, formData, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).then(function(response) {
			return response;
		});
	};

	this.deleteApplication = function(application) {
		return rescourceService.delete(APPLICATION_BY_ID_URL + application.id).then(function(response) {
			return response;
		});
	};
}]);
