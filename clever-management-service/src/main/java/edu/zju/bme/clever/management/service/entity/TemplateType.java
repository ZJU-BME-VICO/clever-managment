package edu.zju.bme.clever.management.service.entity;

public enum TemplateType {
	Storage("Storage"), Application("Application"), Integration("Integration");

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