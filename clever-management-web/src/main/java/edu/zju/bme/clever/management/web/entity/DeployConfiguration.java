package edu.zju.bme.clever.management.web.entity;

import java.util.List;

public class DeployConfiguration {

	private List<String> templateNames;
	private String comment;
	private String userName;

	public List<String> getTemplateNames() {
		return templateNames;
	}

	public void setTemplateNames(List<String> templateNames) {
		this.templateNames = templateNames;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

}
