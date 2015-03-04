angular.module('ngVisible', []).directive('ngVisible', function() {
	return {
		restrict : 'A',
		multiElement : true,
		link : function(scope, element, attr) {
			scope.$watch(attr.ngVisible, function ngVisibleWatchAction(value) {
				element.css({
					'visibility' : value ? 'visible' : 'hidden',
				});
			});
		}
	};
});
