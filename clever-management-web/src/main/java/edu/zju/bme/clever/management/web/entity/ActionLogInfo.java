package edu.zju.bme.clever.management.web.entity;

import java.util.Calendar;

public class ActionLogInfo {

	private Integer id;
	private String archetypeVersion;
	private String archetypeLifecycleState;
	private String action;
	private String operatorName;
	private Calendar recordTime;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getArchetypeVersion() {
		return archetypeVersion;
	}

	public void setArchetypeVersion(String archetypeVersion) {
		this.archetypeVersion = archetypeVersion;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public String getArchetypeLifecycleState() {
		return archetypeLifecycleState;
	}

	public void setArchetypeLifecycleState(String archetypeLifecycleState) {
		this.archetypeLifecycleState = archetypeLifecycleState;
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

}
