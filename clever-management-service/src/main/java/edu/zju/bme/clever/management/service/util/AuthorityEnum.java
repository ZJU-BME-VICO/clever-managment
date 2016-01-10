package edu.zju.bme.clever.management.service.util;

public enum AuthorityEnum {
	
	    ROLE_ARCHETYPE_VIEW("ROLE_ARCHETYPE_VIEW"),
	    ROLE_ARCHETYPE_UPLOAD("ROLE_ARCHETYPE_UPLOAD"),
	    ROLE_ARCHETYPE_EDIT("ROLE_ARCHETYPE_EDIT"),
	    ROLE_ARCHETYPE_CREATE("ROLE_ARCHETYPE_CREATE"),
	    ROLE_ARCHETYPE_SAVE("ROLE_ARCHETYPE_SAVE"),
	    ROLE_ARCHETYPE_NEW_REVISION("ROLE_ARCHETYPE_NEW_REVISION"),
	    ROLE_ARCHETYPE_NEW_VERSION("ROLE_ARCHETYPE_NEW_VERSION"),
	    ROLE_ARCHETYPE_SPECIALIZE("ROLE_ARCHETYPE_SPECIALIZE"),
	    ROLE_ARCHETYPE_BATCH_SUBMIT("ROLE_ARCHETYPE_BATCH_SUBMIT"),
	    ROLE_ARCHETYPE_STATUS_FALLBACK("ROLE_ARCHETYPE_STATUS_FALLBACK"),
	    ROLE_ARCHETYPE_SUBMIT("ROLE_ARCHETYPE_SUBMIT"),
	    ROLE_ARCHETYPE_VERIFY("ROLE_ARCHETYPE_VERIFY"),
	    ROLE_TEMPLATE_UPLOAD("ROLE_TEMPLATE_UPLOAD"),
	    ROLE_TEMPLATE_VIEW("ROLE_TEMPLATE_VIEW"),
	    ROLE_TEMPLATE_EDIT("ROLE_TEMPLATE_EDIT"),
	    ROLE_TEMPLATE_SAVE("ROLE_TEMPLATE_SAVE"),
	    ROLE_TEMPLATE_NEW_REVISION("ROLE_TEMPLATE_NEW_REVISION"),
	    ROLE_TEMPLATE_NEW_VERSION("ROLE_TEMPLATE_NEW_VERSION"),
	    ROLE_TEMPLATE_CREATE("ROLE_TEMPLATE_CREATE"),
	    ROLE_TEMPLATE_BACTH_SUBMIT("ROLE_TEMPLATE_BACTH_SUBMIT"),
	    ROLE_TEMPLATE_STATUS_FALLBACK("ROLE_TEMPLATE_STATUS_FALLBACK"),
	    ROLE_TEMPLATE_SUBMIT("ROLE_TEMPLATE_SUBMIT"),
	    ROLE_TEMPLATE_VERIFY("ROLE_TEMPLATE_VERIFY"),
	    ROLE_TEMPLATE_DEPLOY("ROLE_TEMPLATE_DEPLOY"),
	    ROLE_APPILCATION_VIEW("ROLE_APPILCATION_VIEW"),
	    ROLE_APPILCATION_EDIT("ROLE_APPILCATION_EDIT"),
	    ROLE_API_VIEW("ROLE_API_VIEW"),
	    ROLE_API_MAINTAIN("ROLE_API_MAINTAIN"),
	    ROLE_AUTHORIZE("ROLE_AUTHORIZE");
	    
        private String string;
        private AuthorityEnum(String s) {
        	this.string = s;
		}
        @Override
        public String toString(){
        	return this.string;
        }        
}
