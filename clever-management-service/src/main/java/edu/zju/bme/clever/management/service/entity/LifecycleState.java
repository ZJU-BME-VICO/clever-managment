package edu.zju.bme.clever.management.service.entity;

public enum LifecycleState {

	DRAFT("Draft"), TEAMREVIEW("Teamreview"), PUBLISHED("Published");

	private final String value;

	public String getValue() {
		return value;
	}

	public String toString() {
		return value;
	}

	LifecycleState(String value) {
		this.value = value;
	}
}
