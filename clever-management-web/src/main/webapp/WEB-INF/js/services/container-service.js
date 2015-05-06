angular.module('clever.management.services.container', []).service('containerService', function(){
	var height;
	
	this.setHeight = function(value){
		height = value;
	}
	
	this.getHeight = function(){
		return height;
	}
});