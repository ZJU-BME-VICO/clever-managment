package edu.zju.bme.clever.management.service.entity;

public enum TemplateType implements StringValueEnum {
	STORAGE("Storage"), APPLICATION("Application"), INTEGRATION("Integration");

	private final String value;

	public String getValue() {
		return value;
	}

	public String toString() {
		return value;
	}

	TemplateType(String value) {
		this.value = value;
	}
}