package edu.zju.bme.clever.management.web.entity;

public class ApiParamInfo {
	private Integer Id;
	private String type;
	private String name;
	private Boolean required;
	private String description;
	private String chineseDescription;
	private Boolean indirect;// describe where dose the param come from. true: from class attribute table , false : from param table
    private Boolean isList;
    private Boolean isBaseType;

	public Boolean getIsList() {
		return isList;
	}

	public void setIsList(Boolean isList) {
		this.isList = isList;
	}

	public Boolean getIsBaseType() {
		return isBaseType;
	}

	public void setIsBaseType(Boolean isBaseType) {
		this.isBaseType = isBaseType;
	}

	public Boolean getIndirect() {
		return indirect;
	}

	public void setIndirect(Boolean indirect) {
		this.indirect = indirect;
	}

	public Integer getId() {
		return Id;
	}

	public void setId(Integer id) {
		Id = id;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Boolean getRequired() {
		return required;
	}

	public void setRequired(Boolean required) {
		this.required = required;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getChineseDescription() {
		return chineseDescription;
	}

	public void setChineseDescription(String chineseDescription) {
		this.chineseDescription = chineseDescription;
	}
}
