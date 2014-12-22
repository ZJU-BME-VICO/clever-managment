package edu.zju.bme.clever.management.service.exception;

public class ApplicationPersistException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1113002091256932778L;

	public ApplicationPersistException() {
		super();
	}

	public ApplicationPersistException(String message) {
		super(message);
	}

	public ApplicationPersistException(String message, Throwable cause) {
		super(message, cause);
	}

	public ApplicationPersistException(Throwable cause) {
		super(cause);
	}

}
