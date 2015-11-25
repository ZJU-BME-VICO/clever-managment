package edu.zju.bme.clever.management.service.exception;

public class ApiParseException extends Exception {
	

	/**
	 * 
	 */
	private static final long serialVersionUID = 1734675140587508269L;

	public ApiParseException() {
		super();
	}

	public ApiParseException(String message) {
		super(message);
	}

	public ApiParseException(String message, Throwable cause) {
		super(message, cause);
	}

	public ApiParseException(Throwable cause) {
		super(cause);
	}
}
