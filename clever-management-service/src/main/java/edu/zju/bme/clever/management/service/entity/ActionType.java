package edu.zju.bme.clever.management.service.entity;

public enum ActionType {
	CREATE("Create"), EDIT("Edit"), SUBMIT("Submit"), REJECT("Reject"), REJECT_AND_REMOVE(
			"RejectAndRelease"), APPROVE("Approve"), DEPLOY("Deploy");

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
