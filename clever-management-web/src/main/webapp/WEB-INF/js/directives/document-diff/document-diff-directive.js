angular.module('clever.management.drectives.documentDiff', []).directive('documentDiff', function() {

    return {
        restrict: 'E',
        scope: {
            baseFile: '=',
            newFile: '=',
            viewMode: '=',
        },
        link: function(scope, element, attr) {
            var basetxt = difflib.stringAsLines(scope.baseFile),
                newtxt = difflib.stringAsLines(scope.newFile),
                sm = new difflib.SequenceMatcher(basetxt, newtxt),
                opcodes = sm.get_opcodes();
            // contextSize = contextSize || null;
            element.append(buildView({
                baseTextLines: basetxt,
                newTextLines: newtxt,
                opcodes: opcodes,
                baseTextName: "Base Text",
                newTextName: "New Text",
                contextSize: '10',
                viewType: scope.viewMode
            }));

            scope.$watch('viewMode', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    element.html("");
                    element.append(buildView({
                        baseTextLines: basetxt,
                        newTextLines: newtxt,
                        opcodes: opcodes,
                        baseTextName: "Base Text",
                        newTextName: "New Text",
                        contextSize: '10',
                        viewType: newValue,
                    }));
                }
            });
        }
    };

    function buildView(obj) {
        return diffview.buildView({
            baseTextLines: obj.baseTextLines,
            newTextLines: obj.newTextLines,
            opcodes: obj.opcodes,
            baseTextName: obj.baseTextName,
            newTextName: obj.newTextName,
            contextSize: obj.contextSize,
            viewType: obj.viewType,
        });
    }
});
