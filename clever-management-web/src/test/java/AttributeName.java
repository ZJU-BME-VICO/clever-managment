
public enum AttributeName {
 //规则：NodeName_AttributeName(upperCase)
	ELEMENT_VALUE("value"),
	INTERVAL_UPPER("upper"),
	INTERVAL_LOWER("lower"),
	ITEMTREE_ITEMS("items"),
	MULTIMEDIA_MEDIA_TYPE("media_type"),
	DEFINING_CODE("defining_code"),
	INTERVAL_MAGNITUDE("magnitude")
	;
	
	private final String name;
	AttributeName(String s)
	{
	 name = s;	
	}
    public	String toString()
	{
		return name;
	}
}
 class Language
 {
	 public static final String LANGUAGE_EN = "en";
	 public static final String LANGUAGE_DE = "de";
	 
 }
