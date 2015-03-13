package edu.zju.bme.clever.management.service.entity;

public enum TemplatePropertyType implements StringValueEnum {
	ARM("ArchetypeRelationshipMapping");

	private final String value;

	public String getValue() {
		return value;
	}

	public String toString() {
		return value;
	}

	TemplatePropertyType(String value) {
		this.value = value;
	}
}
