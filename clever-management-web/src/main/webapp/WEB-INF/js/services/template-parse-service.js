angular.module('clever.management.services.templateParse',[]).service('templateParseService',function(resourceService,archetypeParseService,ARCHETYPE_BY_NAME_URL){
    this.parseTemplate=function(template){
    	var id=template.id.value;
    	var name=template.name;
    	var description=this.parseDescription(template);
      	var definitions=this.parseDefinition(template);// xml after deleting some node
    	return {
    		id:id,
    		name:name,
    		description:description,
    		definitions:definitions 		
       };
    };	
    this.parseDescription=function(template){    	   	
    };
    this.parseDefinition=function(template){
    	var definitions=[];
    	processRules(template.definition,definitions);    	
    	return definitions;
    };
    function processRules(node,listTree){
        if(angular.isArray(node)){
            var leafnode=leafNode(node);
            listTree.push(leafnode);
            if(node.items){
                leafNode.children=[];
                processRules(node.items,leafNode.children);
            }            
        }else{
            var leafnode=leafNode(node);
            listTree.push(leafnode);
            if(node.items){
                leafNode.children=[];
                processRules(node.items,leafNode.children);
            }
         }      
    }
    
    function leafNode(node){
            var archetype_id=node._archetype_id+".xml";
            var conceptName=node._concept_name;
            var leafInfo=[];  var archetype;
            if(angular.isArray(node.Rule)){
               angular.forEach(node.Rule,function(value){//get info in each rule
                if(value._max==1){
                   var path=value._path;
                   leafInfo.push(path);                 
                    resourceService.get(ARCHETYPE_BY_NAME_URL+'openEHR-EHR-INSTRUCTION.request-imaging_exam.v1.xml').then(function(result){
                    archetype=result;
                    nodeInfo = archetypeParseService.parseArchetypeXml(archetype);
                    var item=Mapping(path,nodeInfo.treeItems);
                    leafInfo.push(item);
                });
                }
            }); 
            }else{
                if(node._max==1){
                   var path=value._path;
                   leafInfo.push(path);
                  }
            }
            if(angular.isArray(node.Items)){
               angular.forEach(node.Items,function(value){//get info in each rule
                if(value._max==1||value._max==undefined){
                    var path=value._path;
                    leafInfo.push(path);
                    resourceService.get(ARCHETYPE_BY_NAME_URL+'openEHR-EHR-INSTRUCTION.request-imaging_exam.v1.xml').then(function(result){
                    archetype=result;
                    nodeInfo = archetypeParseService.parseArchetypeXml(archetype);
                     });
                } 
            }); 
            }
            return info={
                archetype_id:archetype_id,
                conceptName:conceptName,
                leafInfo:leafInfo ,
                archetype:archetype           
            };
    }
    function Mapping(path,archetypeInfo){
        if(angular.isArray(archetypeInfo)){
            angualr.forEach(archetypeInfo,function(value){
                if(value.label.text==""&&value.label.code==""){}
            });
        }else{
            
        }
    }
    
});