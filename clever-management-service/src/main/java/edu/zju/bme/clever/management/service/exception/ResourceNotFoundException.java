package edu.zju.bme.clever.management.service.exception;

public class ResourceNotFoundException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5420865058783685783L;

	public ResourceNotFoundException() {
		super();
	}

	public ResourceNotFoundException(String message) {
		super(message);
	}

	public ResourceNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}

	public ResourceNotFoundException(Throwable cause) {
		super(cause);
	}
}
