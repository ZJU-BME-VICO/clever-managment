package edu.zju.bme.clever.management.service.exception;

public class ResourceExportException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1113002091256932778L;

	public ResourceExportException() {
		super();
	}

	public ResourceExportException(String message) {
		super(message);
	}

	public ResourceExportException(String message, Throwable cause) {
		super(message, cause);
	}

	public ResourceExportException(Throwable cause) {
		super(cause);
	}

}
