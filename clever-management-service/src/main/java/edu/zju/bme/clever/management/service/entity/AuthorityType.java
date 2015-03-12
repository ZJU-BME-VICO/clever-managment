package edu.zju.bme.clever.management.service.entity;

public enum AuthorityType implements StringValueEnum {

	JMX_MANAGE("JmxManage", 1);

	private final String value;
	private final Integer index;

	public String getValue() {
		return value;
	}

	public Integer getIndex() {
		return index;
	}

	public String toString() {
		return value;
	}

	AuthorityType(String value, Integer index) {
		this.value = value;
		this.index = index;
	}

}
