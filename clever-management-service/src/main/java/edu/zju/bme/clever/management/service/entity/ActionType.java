package edu.zju.bme.clever.management.service.entity;

public enum ActionType {
	Create("Create"), Edit("Edit"), Submit("Submit"), Reject("Reject"), RejectAndRelease(
			"RejectAndRelease"), Approve("Approve"), Deploy("Deploy");

	private final String value;

	public String getValue() {
		return value;
	}

	public String toString() {
		return value;
	}

	ActionType(String value) {
		this.value = value;
	}
}
