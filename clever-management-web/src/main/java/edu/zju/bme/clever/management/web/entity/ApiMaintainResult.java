package edu.zju.bme.clever.management.web.entity;

public class ApiMaintainResult {
	private boolean succeeded;
	private String message;

	public boolean isSucceeded() {
		return succeeded;
	}

	public void setSucceeded(boolean isSucceeded) {
		this.succeeded = isSucceeded;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
