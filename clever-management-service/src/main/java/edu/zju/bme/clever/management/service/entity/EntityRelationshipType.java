package edu.zju.bme.clever.management.service.entity;

public enum EntityRelationshipType implements StringValueEnum {

	ONE_TO_MANY("OneToMany"), LINK("Link");

	private final String value;

	public String getValue() {
		return value;
	}

	public String toString() {
		return value;
	}

	EntityRelationshipType(String value) {
		this.value = value;
	}

}
