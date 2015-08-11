angular.module('clever.management.directives.editHeaderPane',[]).directive('editHeaderPane',function(){
   return {
     restrict: 'E',
     transclude:true,
     scope:{  	
     	header:'=',
     	languages:"=",
     	ontology:"=",
     	     
     },
     templateUrl:'js/directives/archetype-edit-directives/header-pane/edit-header-pane.html',
                 
     controller: function($scope){
     	
     /*------edit information------------
      * base information 
      *    ---concept
      *    ---description
      *    ---comment
      *    ---languages(select a language for display)
      * authorship
      *    ---original author information
      *    ---other contributors
      * details
      *    ---purpose
      *    ---use
      *    ---copyright
      *    ---issue
      * 
      */
      
      /*--------infomation getted------------
       * header
       *    ---
       *
       *
       *
       */
     	
     
     // other_contributors
        $scope.otherContributorList = [];
     	$scope.selectContributor=function(contributor){
     		$scope.selectedContributor = contributor;
     	};
     	$scope.addContributor = function()
     	{   
     		$scope.selectedContributor ={name:'newContributors'};
     		$scope.otherContributorList.push($scope.selectedContributor);
     		console.log($scope.otherContributorList);
     	};
     	
     //original_author_info
       $scope.originalAuthorInfo = {
       	name:"*",
       	email:"*",
       	orgnization:"*",
       	date:"*",
        }	;
     	
     	
     	//language
     	$scope.$watch('languages',function(newValue){
           if(newValue){         
           	$scope.languageList = [];
           	angular.forEach($scope.languages.languages,function(language){
           		$scope.languageList.push(language.code);
           	});
           
           	$scope.selectedLanguage = $scope.languages.selectedLanguage.code;
            
         	$scope.originalLanguage = $scope.originalLanguages;
           }     		
           
     	});
     	
     	$scope.$watch('selectedLanguage',function(newValue){
     		if(newValue){
     			initDetail();
     		}
     	});       
     	       
     	
     	  
        //concept
      
        $scope.$watch('header',function(newValue){
        	if(newValue){
        		console.log("this is the header");
        		console.log($scope.header);
        		$scope.conceptCode= $scope.header.concept;        		
        	    $scope.baseInfo = getBaseInfoByCode();
        	    var oriAuthorInfo = $scope.header.description.original_author;
        	    initOriginalAuthorInfo();
        	    initOtherContributorList();
        	    initDetail();
        	    console.log($scope.otherContributorList);
        	   // $scope.otherContributorList = $scope.header.description.other_contributors;        	   
        		$scope.originalAuthor = $scope.header.description.original_author;
                //$scope.otherContributors = $scope.header.description.other_contributors;      
                $scope.archetypeId = $scope.header.id;      
        		
        	}
        });
     	  initDetail = function(){
     	  	$scope.detail = {};
     	  	var details = $scope.header.description.details;
     	  	if(details!=undefined){
     	  		if(angular.isArray(details)){
     	  			angular.forEach(details,function(detail){
     	  				if(detail.language==$scope.selectedLanguage){
     	  					$scope.detail = detail;
     	  					console.log("this is detail");
     	  					console.log($scope.detail);
     	  				}
     	  			});
     	  		};
     	  	}
     	  };
     	  
     	 initOtherContributorList = function(){
     	 	otherContributors = $scope.header.description.other_contributors;
     	 	$scope.otherContributorList=[];
     	   if(otherContributors!=undefined){
     	   	 if(angular.isArray(otherContributors)){
     	   	 	angular.forEach(otherContributors,function(contributor){
     	   	 		$scope.otherContributorList.push({name:contributor});
     	   	 	});
     	   	 }
     	   	 else $scope.otherContributorList.push({name:otherContributors});
     	   }
     	  };
     	initOriginalAuthorInfo = function(){
     		
     		oriAuthorInfo = $scope.header.description.original_author;
     		console.log(oriAuthorInfo);
     	 	if(oriAuthorInfo!=undefined){
     	 	   	 			
     	 		angular.forEach(oriAuthorInfo, function(item){
     	 			if(item.id == "name"){
     	 				$scope.originalAuthorInfo.name = item.text;   	 				
     	 			}  	
     	 			if(item.id == "email"){
     	 				$scope.originalAuthorInfo.email = item.text;	 				
     	 			} 	
     	 			if(item.id == "orgnization"){
     	 				$scope.originalAuthorInfo.orgization = item.text;
     	 			}
     	 			if(item.id == "date"){
     	 				$scope.originalAuthorInfo.date = item.text;
     	 			}
     	 		});
     	 		
     	 	}
     	 };
     	getBaseInfoByCode = function(){
     	
     		baseInfo = {
     			concept:'',
     			description:'',
     			comment:'',
     		};
     		if($scope.languages.selectedLanguage!=undefined){     		 			
     			angular.forEach($scope.ontology.terms,function(term){
     				if(term.language==$scope.languages.selectedLanguage.code){    					     			 					
     				      angular.forEach(term.items,function(item){
     				      	 if(item.code == $scope.conceptCode){   
     				      	 	console.log(item); 				      	 		
     				      	 	baseInfo = {
     			                  concept:item.text,
     			                  description:item.description,
     			                  comment:item.comment,
     		                    };			      	 	
     				      	 }
     				    });   
     				}    				
     			});
     		}
     		return baseInfo;
     	
     	};
            	
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
     	
     	
     //datepicker logic
      $scope.today = function() {
       $scope.dt = new Date();
      };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['-MM-dd','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);
  $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  $scope.getDayClass = function(date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i=0;i<$scope.events.length;i++){
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  
  };
     	
     	
     },
     links:function(scope,elemetn,attr){
     	
     }
   };	
});

