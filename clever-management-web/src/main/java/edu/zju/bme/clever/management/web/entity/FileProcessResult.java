package edu.zju.bme.clever.management.web.entity;

public class FileProcessResult {
	
	private String name;
	private String status;
	private String message = "";

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}



	public class FileStatusConstant {
		public static final String UPLOADED = "UPLOADED";
		public static final String EXISTED = "EXISTED";
		public static final String CHANGED = "CHANGED";
		public static final String INVALID = "INVALID";
		public static final String VALID = "VALID";
		public static final String DEFAULT = "DEFAULT";
	}
}