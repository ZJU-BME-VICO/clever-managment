angular.module('clever.management.directives.splitter', []).directive('splitter', ['$document',
function($document) {
	return {
		restrict : 'EA',
		scope : {
			isAdjustEnabled : '='
		},
		link : function(scope, element, attrs) {

			element.css({
				cursor : 'e-resize',
				display : 'block',
				'text-align' : 'center'
			});

			var resizeEl = null;
			var direction = attrs.direction || 'left';
			var minWidth = attrs.minWidth || 300;
			var maxWidth = attrs.maxWidth || 500;
			var startX = 0;
			var startWidth = 0;
			element.prev().width(minWidth);

			element.on('mousedown', function(event) {
				if (scope.isAdjustEnabled) {
					if (direction == 'right') {
						resizeEl = element.next();
					} else {
						resizeEl = element.prev();
					}
					dragging = true;
					startWidth = resizeEl.width();
					startX = event.screenX;
					jQuery('body').css('-webkit-user-select', 'none').css('-moz-user-select', '-none').css('-ms-user-select', 'none').css('cursor', 'e-resize');
					$document.on('mousemove', mousemove);
					$document.on('mouseup', mouseup);
				}
			});

			function mousemove(event) {
				var newX = event.screenX;
				var delta = newX - startX;
				if (direction == 'right') {
					delta = delta * -1;
				}
				var nextWidth = startWidth + delta;
				if (nextWidth < minWidth) {
					nextWidth = minWidth;
				}
				if (nextWidth > maxWidth) {
					nextWidth = maxWidth;
				}
				resizeEl.width(nextWidth);
			};

			function mouseup() {
				jQuery('body').css('-webkit-user-select', '').css('-moz-user-select', '').css('-ms-user-select', '').css('cursor', '');
				$document.off('mousemove', mousemove);
				$document.off('mouseup', mouseup);
			};

		}
	};
}]);
