package edu.zju.bme.clever.management.service.exception;

public class ApiMaintainException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3663595581255861428L;

	public ApiMaintainException() {
		super();
	}

	public ApiMaintainException(String message) {
		super(message);
	}

	public ApiMaintainException(String message, Throwable cause) {
		super(message, cause);
	}

	public ApiMaintainException(Throwable cause) {
		super(cause);
	}
}
