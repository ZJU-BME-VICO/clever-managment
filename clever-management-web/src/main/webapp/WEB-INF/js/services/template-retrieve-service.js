angular.module('clever.management.services.templateRetrieve',[]).service('templateRetreiveService', ['$http','TEMPLATE_BY_ID',function($http,TEMPLATE_BY_NAME_URL){
      this.getTemplateXmlByName=function(templateName){
      	return getFromUrl(TEMPLATE_BY_NAME_URL+templateName+'.xml')
      };
      function getFromUrl(url){
		return $http.get(url).then(function(response){
			return response.data;
		})
	  }
	  
	  
}])
