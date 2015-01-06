package edu.zju.bme.clever.management.service.entity;

import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table
public class ArchetypeActionLog extends AbstractIndentifiedEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4884485455464548573L;

	public enum ActionType {
		Create("Create"), Edit("Edit"), Submit("Submit"), Reject("Reject"), RejectAndRelease(
				"RejectAndRelease"), Approve("Approve"), Deploy("Deploy");

		private final String value;

		public String getValue() {
			return value;
		}

		public String toString() {
			return value;
		}

		ActionType(String value) {
			this.value = value;
		}
	}

	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeMaster archetypeMaster;
	@Column(nullable = false)
	private String archetypeVersion;
	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private LifecycleState archetypeLifecycleState;
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ActionType actionType;
	@ManyToOne(fetch = FetchType.LAZY)
	private User operator;
	@Column(nullable = false)
	private String operatorName;
	@Column(nullable = false)
	@Temporal(TemporalType.TIMESTAMP)
	private Calendar recordTime;

	public ArchetypeMaster getArchetypeMaster() {
		return archetypeMaster;
	}

	public void setArchetypeMaster(ArchetypeMaster archetypeMaster) {
		this.archetypeMaster = archetypeMaster;
	}

	public String getArchetypeVersion() {
		return archetypeVersion;
	}

	public void setArchetypeVersion(String archetypeVersion) {
		this.archetypeVersion = archetypeVersion;
	}

	public LifecycleState getArchetypeLifecycleState() {
		return archetypeLifecycleState;
	}

	public void setArchetypeLifecycleState(
			LifecycleState archetypeLifecycleState) {
		this.archetypeLifecycleState = archetypeLifecycleState;
	}

	public ActionType getActionType() {
		return actionType;
	}

	public void setActionType(ActionType actionType) {
		this.actionType = actionType;
	}

	public User getOperator() {
		return operator;
	}

	public void setOperator(User operator) {
		this.operator = operator;
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
