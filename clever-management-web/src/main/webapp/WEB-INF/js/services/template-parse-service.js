angular.module('clever.management.services.templateParse',[]).service('templateParseService',
function(){
    this.parseTemplate=function(tempalte){
    	var id=template.template_id.value;
    	var concept=template.concept;
    	var language=this.parseLanguage(tempalte);
    	var description=this.parseDescription(tempalte);
    	var defination=this.parseDefination(template);
    	return {
    		header:header,
    		description:description,
    		defination:defination
       };
    };	
    
    this.parseLanguage=function(template){
    	var language={
    		terminology:template.language.terminology_id.value,
    		code:template.code_string,
    	};
    }
    this.parseDescription=function(template){
    	
    	
    }
    this.parseDefination=function(template){
    	var definationTree=[];
    	//取什么样的节点显示？
    }
})
