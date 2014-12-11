package edu.zju.bme.clever.management.service.entity;

public class FileProcessResult {

	private String name;
	private FileStatus status;
	private String message = "";

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public FileStatus getStatus() {
		return status;
	}

	public void setStatus(FileStatus status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public enum FileStatus {

		VALID("VALID"), INVALID("INVALID");

		private final String value;

		public String getValue() {
			return value;
		}

		public String toString() {
			return value;
		}

		FileStatus(String value) {
			this.value = value;
		}
	}

}