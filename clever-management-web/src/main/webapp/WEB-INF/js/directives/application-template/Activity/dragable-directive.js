angular.module('clever.management.directives.dragable', []).directive('dragable',//驼峰式命名
function($document) {
    return function(scope, element, attrs) {
        //指令修改DOM通常是在link配置中，link选项接受一个带有如下标签的函数function link(scope,element,attrs) {...}
        //其中： - scope是angular scope对象 - element指令匹配的jqLite封装的元素(angular内部实现的类jquery的库) - attrs是一个带有规范化后属性名字和相应值的对象
        var startX=0,startY,startZ=0,x=0,y=0;
        element.css({
            position:"relative",//初始按顺序排列，位置移动的topleft 是相对于原始位置
            height:'32px',
            width:'auto',
            cursor: 'pointer'
        });
        element.on('mousedown',function(event){
            //event.preventDefault();//阻止浏览器中原来的鼠标选中编辑功能
            if(event.button!=2){
            startX=event.screenX - x;
            startY=event.screenY - y;
            $document.on('mousemove',mousemove);
            $document.on('mouseup',mouseup);
            }
        });
        function mousemove(event){
            y=event.screenY-startY;
            x=event.screenX-startX;
            element.css({
            	position:"absolute",//定位计算根据祖先元素的绝对位置top、left
                top:y+'px',
                left:x+'px',
            });
        }
        function mouseup(){
            $document.unbind('mousemove', mousemove);
            $document.unbind('mouseup', mouseup);
        }
    };
});