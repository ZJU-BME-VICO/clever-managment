angular.module('clever.management.service.archetypeSerialize',[]).service('archetypeSerializeService',function(){
	this.lineSeparator="\r\n";
	this.adlOutput = "";
	this.indent="    ";//4 white space characters
	this.serializeArchetype = function(archetype){
		adl_writer='';
		this.printHeader(archetype);
		this.newLine();
		this.printLanguage(archetype);
		this.newLine();
		if(archetype.description){
			this.printDescription(archetype.description);
			this.newLine();
		}
		this.printDefinition(archetype.definition, archetype.ontology);
		this.newLine();
		this.printOntology(archetype.ontology);
		
	  return this.adlOutput;
	};
	this.printHeader = function(archetype){
		//this.write("this is header");
		this.write("archetype");
		if(archetype.adl_version||(archetype.uid&&archetype.uid.length!=0)){
			this.write(" (");
		}
		if(archetype.adl_version){
			this.write("adl_version=");
			this.write(archetype.adl_version);
		}
		if(archetype.uid&&uid.length!=0){
			this.write("uid=");
			this.write(archetype.uid);		
		}
		if(archetype.adl_version||(archetype.uid&&archetype.uid.length!=0)){
			this.write(")");
		}
		this.newLine();
		this.writeIndent(1);
		this.write(archetype.archetype_id.value);
		this.newLine();
		
		if(archetype.parent_archetype_id){
			this.write("specialize");
			this.newLine();
			this.writeIndent(1);
			this.write(archetype.parent_archetype_id.value);
			this.newLine();
		}
		this.newLine();
		this.write("concept");
		this.newLine();
		this.writeIndent(1);
		this.write("["+archetype.concept+"]");
		this.newLine();	
	};
	this.printLanguage = function(archetype){
		//this.write("this is language");
		this.write("language");
		this.newLine();
		this.writeIndent(1);
		this.write("original_language = <");
		this.write("[");
		this.write(archetype.original_language.terminology_id.value);
		this.write("::");
		this.write(archetype.original_language.code_string);
		this.write("]");
		this.write(">");
		this.newLine();
		if(archetype.translations){
			this.writeIndent(1);
			this.write("translation = <");
			this.newLine();
		    for(var i=0, len =archetype.translations.length;i<len;i++){
				var tr = archetype.translations[i];
				this.writeIndent(2);
				this.write("[\"");
				this.write(tr.language.code_string);
				this.write("\"] = <");
				this.newLine();
			
				this.writeIndent(3);
				this.write("language = <");
				this.write(tr.language.terminology_id.value);
				this.write("::");
				this.write(tr.language.code_string);
				this.write("]");
				this.write(">");
				this.newLine();
			
				this.writeIndent(3);
				this.write("author = <");
				this.newLine();
				this.printMapArray(tr.author,4);
				this.writeIndent(3);
				this.write(">");
				this.newLine();
			
				if(tr.accreditation){
					this.writeIndent(3);
					this.write("accreditation = <\"");
					this.write(tr.accreditation);
					this.write("\">");
					this.newLine();
			    }
			
				if(tr.other_details){
					this.writeIndent(3);
					this.write("other_details = <");
					this.newLine();
					this.printMapArray(tr.other_details,4);
			    	this.writeIndent(3);
			    	this.write(">");
			    
				}
				this.writeIndent(2);
				this.write(">");
				this.newLine();
			}
			this.writeIndent(1);
			this.write(">");
			this.newLine();
		}
		
	};
	this.printDescription = function(description){
		//this.write('this is description');
		if(description == null){
			return;
		}
		
		this.write("description");
		this.newLine();
		
		this.writeIndent(1);
		this.write("original_author = <");
		this.newLine();
		this.printMapArray(description.original_author,2);
		this.writeIndent(1);
		this.write(">");
		this.newLine();
		
		this.writeIndent(1);
		this.write("lifecycle_state = <\"");
		this.write(description.lifecycle_state);
		this.write("\">");
		this.newLine();
		
		this.printNonEmptyString("resource_package_uri", description.resource_package_uri,1);
		
	    this.writeIndent(1);
	    this.write("details = <");
	    this.newLine();
	    for(item in description.details){
	    	this.printDescriptionItem(description.details[item],2);
	    }
	    this.writeIndent(1);
	    this.write(">");
	    this.newLine();
	    
	    
	    this.writeIndent(1);
	    this.write("other_details = <");
	    this.newLine();
	    if(description.other_details){
	    	this.printMapArray(description.other_details,2);
	    }
	    this.writeIndent(1);
	    this.write(">");
	    this.newLine();
	    
		
		
	};
	this.printDefinition = function(definition,ontology){
		this.write('this is definition');
		
	};
	this.printOntology = function(ontology){
		this.write('this is ontology');
	};
	
	
	this.printMapArray = function(array,number){
		var self = this;
		if(angular.isArray(array)){
			angular.forEach(array,function(item){
				 
				 self.writeIndent(number);
				 self.write("[\"");
				 self.write(item._id);
				 self.write("\"] = <\"");
				 self.write(item.__text);
				 self.write("\">");
				 self.newLine();
			});
			
			}
			else{ 
			     self.writeIndent(number);
				 self.write("[\"");
				 self.write(array._id);
				 self.write("\"] = <\"");
				 self.write(array.__text);
				 self.write("\">");
				 self.newLine();
		    }
	};
	
	this.printDescriptionItem = function(item,number){
		this.writeIndent(number);
		this.write("[\"");
		this.write(item.language.code_string);
		this.write("\"] = <");
		this.newLine();
         
        this.writeIndent(number+1);
        this.write("language = <");
        this.write("[");
        this.write(item.language.terminology_id.value);
        this.write("::");
        this.write(item.language.code_string);
        this.write("]>");
        this.newLine();
        
        this.printNonEmptyString("purpose",item.purpose,number+1);
        this.printNonEmptyStringList("keywords", item.keywords,number+1);
        this.printNonEmptyString("copyright",item.copyright,number+1);
        this.printNonEmptyString("use",item.use,number+1);
        this.printNonEmptyString("missue",item.missue,number+1);
        this.printNonEmptyString("original_resource_uri",item.original_resource_uri);
        
        this.writeIndent(number);
        this.write(">");
        this.newLine();
		
	};
	this.printNonEmptyString = function(label,value,number){
		var self = this;
		if(value){
			this.writeIndent(number);
			this.write(label);
			this.write(" = <\"");
			this.write(value.replace("\"", "\\\""));
			this.write("\">");
			this.newLine();
		}
	};
	
	this.printNonEmptyStringList = function(label,list,number){
		if(list){
			if(angular.isArray(list)){
				this.writeIndent(number);
				this.write(label);
				this.write(" = <");
				for(i = 0;i<list.length;i++){
					this.write("\"");
					this.write(list[i].replace("\"", "\\\""));
					this.write("\"");
					if(i!=list.length-1){
						this.write(",");
			 		}
				}
				this.write(">");
				this.newLine();
	  		}
	  		else{
	  			this.printNonEmptyString(label,list,number);
	  		}
	  	}
	};
	this.write = function(string){
		this.adlOutput+=string;
	};
	this.writeIndent = function(number){
		for(i=0;i<number;i++){
			this.write(this.indent);
		}
	};
	this.newLine = function(){
		this.adlOutput+=this.lineSeparator;
	};
	
});
