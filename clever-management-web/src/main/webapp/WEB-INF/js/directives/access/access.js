angular.module('clever.management.directives.access',[]).directive('access', function(authenticationService){
	return {
		link: function(scope, elem, attr){
			
			if(!authenticationService.allowed(attr.access)){
				elem.hide();
			}
		}
	};
});
