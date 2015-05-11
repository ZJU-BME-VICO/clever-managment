angular.module('clever.management.directives.headerPane', []).directive('headerPane', function(containerService) {
	return {
		restrict : 'E',
		scope : {
			header : '=',
			description : '=',
			terminology : '=',
		},
		template :  '<div class="row" ng-style="{height: maxHeight}"> style' +
						'<table class="table table-hover">' +
							'<tbody>' +
								'<tr>' +
									'<th ng-style="{width: titleWidth + \'px\'}"><b>Archetype ID</b></th>' +
									'<th style="font-weight: normal">{{header.id}}</th>' +
								'</tr>' +
								'<tr>' +
									'<th ng-style="{width: titleWidth + \'px\'}"><b>Concept name</b></th>' +
									'<th style="font-weight: normal">{{getOntologyByCode(header.concept).text}}</th>' +
								'</tr>' +
								'<tr>' +
									'<th ng-style="{width: titleWidth + \'px\'}"><b>Concept description</b></th>' +
									'<th style="font-weight: normal">{{getOntologyByCode(header.concept).description}}</th>' +
								'</tr>' +
								'<tr>' +
									'<th ng-style="{width: titleWidth + \'px\'}"><b>Copyright</b></th>' +
									'<th style="font-weight: normal">{{description.copyright}}</th>' +
								'</tr>' +
								'<tr>' +
									'<th ng-style="{width: titleWidth + \'px\'}"><b>Purpose</b></th>' +
									'<th style="font-weight: normal">{{description.purpose}}</th>' +
								'</tr>' +
								'<tr>' +
									'<th ng-style="{width: titleWidth + \'px\'}"><b>Use</b></th>' +
									'<th style="font-weight: normal">{{description.use}}</th>' +
								'</tr>' +
								'<tr>' +
									'<th ng-style="{width: titleWidth + \'px\'}"><b>Misuse</b></th>' +
									'<th style="font-weight: normal">{{description.misuse}}</th>' +
								'</tr>' +
							'</tbody>' +
						'</table>' +
					'</div>',
		replace : true,
		link : function(scope, elm, attrs) {
			scope.maxHeight = containerService.getHeight() - 280;
            scope.$watch(function() {
                return containerService.getHeight()
            }, function(newValue) {
                scope.maxHeight = newValue - 280 < 180 ? 180 : newValue - 280;
            });
			// scope.maxHeight = angular.isDefined(attrs.maxHeight) ? scope.$parent.$eval(attrs.maxHeight) : undefined;
			scope.titleWidth = angular.isDefined(attrs.titleWidth) ? scope.$parent.$eval(attrs.titleWidth) : 200;
			scope.getOntologyByCode = function(code) {
				if (scope.terminology && code) {
					var matchedOntology;
					if (scope.terminology.term) {
						angular.forEach(scope.terminology.term.items, function(value) {
							if (value.code == code) {
								matchedOntology = value;
							}
						});
					}
					if (scope.terminology.constraint) {
						angular.forEach(scope.terminology.constraint.items, function(value) {
							if (value.code == code) {
								matchedOntology = value;
							}
						});
					}
					return matchedOntology;
				}
			}; 
		}
	};
});