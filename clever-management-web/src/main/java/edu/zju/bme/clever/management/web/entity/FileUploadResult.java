package edu.zju.bme.clever.management.web.entity;

import java.util.ArrayList;
import java.util.List;

public class FileUploadResult {

	private boolean succeeded;
	private String message;
	private List<String> failTemplates = new ArrayList<>();

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

	public List<String> getFailTemplates() {
		return failTemplates;
	}

	public void setFailTemplates(List<String> failTemplates) {
		this.failTemplates = failTemplates;
	}
	
	public void addFailTemplates(String templateName){
		this.failTemplates.add(templateName);
	}
}
