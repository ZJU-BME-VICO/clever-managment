package edu.zju.bme.clever.management.web.entity;

import java.util.Calendar;

public class DeployRecordInfo {
	private Integer id;
	private Integer deployerId;
	private String deployerName;
	private String comment;
	private Calendar deployTime;
	private boolean succeeded;
	private String message;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getDeployerId() {
		return deployerId;
	}

	public void setDeployerId(Integer deployerId) {
		this.deployerId = deployerId;
	}

	public String getDeployerName() {
		return deployerName;
	}

	public void setDeployerName(String deployerName) {
		this.deployerName = deployerName;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Calendar getDeployTime() {
		return deployTime;
	}

	public void setDeployTime(Calendar deployTime) {
		this.deployTime = deployTime;
	}

	public boolean getSucceeded() {
		return succeeded;
	}

	public void setSucceeded(boolean succeeded) {
		this.succeeded = succeeded;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
