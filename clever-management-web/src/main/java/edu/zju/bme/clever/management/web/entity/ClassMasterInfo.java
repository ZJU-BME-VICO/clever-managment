package edu.zju.bme.clever.management.web.entity;

import java.util.List;

public class ClassMasterInfo {
	private Integer id;
	private String name;
	private Integer versionId;

	private String type;
	private List<ClassAttributeInfo> attributes;

	public List<ClassAttributeInfo> getAttributes() {
		return attributes;
	}

	public void setAttributes(List<ClassAttributeInfo> attributes) {
		this.attributes = attributes;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Integer getVersionId() {
		return versionId;
	}

	public void setVersionId(Integer versionId) {
		this.versionId = versionId;
	}

}
