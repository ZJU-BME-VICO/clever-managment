angular.module('clever.management.filters.unsafe', []).filter('unsafe', function($sce) {
	return function(value) {
		return $sce.trustAsHtml(value);
	};
});
