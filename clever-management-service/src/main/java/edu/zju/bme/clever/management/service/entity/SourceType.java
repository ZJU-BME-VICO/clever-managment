package edu.zju.bme.clever.management.service.entity;

public enum SourceType implements StringValueEnum {
	CKM("CKM"), ZJU("ZJU"), CLEVER("CLEVER");

	private final String value;

	public String getValue() {
		return value;
	}

	public String toString() {
		return value;
	}

	SourceType(String value) {
		this.value = value;
	}
}