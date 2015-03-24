package edu.zju.bme.clever.management.web.entity;

import java.util.Calendar;

public class ActionLogInfo {

	private Integer id;
	private String version;
	private String lifecycleState;
	private String action;
	private String operatorName;
	private Calendar recordTime;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	
	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}


	public String getOperatorName() {
		return operatorName;
	}

	public void setOperatorName(String operatorName) {
		this.operatorName = operatorName;
	}

	public Calendar getRecordTime() {
		return recordTime;
	}

	public void setRecordTime(Calendar recordTime) {
		this.recordTime = recordTime;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getLifecycleState() {
		return lifecycleState;
	}

	public void setLifecycleState(String lifecycleState) {
		this.lifecycleState = lifecycleState;
	}

	
}
