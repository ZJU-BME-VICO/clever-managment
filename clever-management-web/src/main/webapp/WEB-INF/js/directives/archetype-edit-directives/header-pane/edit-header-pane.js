angular.module('clever.management.directives.editHeaderPane',[]).directive('editHeaderPane',function(){
   return {
     restrict: 'E',
     transclude:true,
     scope:{
     	header:'=',
     },
     templateUrl:'js/directives/archetype-edit-directives/header-pane/edit-header-pane.html',
                 
     controller: function($scope){
     	
     	$scope.authorList=[
     	{name:"Mecro"},
     	{name:"Jame"},
     	{name:"Timee"}];
     	
     	$scope.language = "asdf";
     
     	$scope.selectAuthor=function(author){
     		$scope.selectedAuthor = author;
     	};
     	$scope.newAuthor = function()
     	{   
     		$scope.selectedAuthor = {name: "newAuthor"};
     		$scope.authorList.push($scope.selectedAuthor);
     	};
     	$scope.languageList=["english","france","chinese"];
     	$scope.concept="sda";
     	$scope.oneAtATime = false;
     	$scope.status={
     		isBaseInfoOpen:true,
     		isBaseInfoDisabled:false,
     		
     		isAuthorShipOpen:true,
     		isAuthorShipDisabled: false,
     		
     		isDetailsOpen: true,
     		isDetailsDisabled: false,
     	};
     	
     	
     	
     	
     	
     	
     },
     links:function(scope,elemetn,attr){
     	
     }
   };	
});

