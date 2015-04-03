package edu.zju.bme.clever.management.service.entity;

import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table
@DynamicUpdate(true)
public class ArchetypeActionLog extends AbstractIndentifiedEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4884485455464548573L;

	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeVersionMaster archetypeVersionMaster;
	@Column(nullable = false)
	private String version;
	@Column(nullable = false)
	private LifecycleState lifecycleState;
	@Column(nullable = false)
	private ActionType actionType;
	@ManyToOne(fetch = FetchType.LAZY)
	private User operator;
	@Column(nullable = false)
	private String operatorName;
	@Column(nullable = false)
	@Temporal(TemporalType.TIMESTAMP)
	private Calendar recordTime;

	public ArchetypeVersionMaster getArchetypeVersionMaster() {
		return archetypeVersionMaster;
	}

	public void setArchetypeVersionMaster(
			ArchetypeVersionMaster archetypeVersionMaster) {
		this.archetypeVersionMaster = archetypeVersionMaster;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public LifecycleState getLifecycleState() {
		return lifecycleState;
	}

	public void setLifecycleState(LifecycleState lifecycleState) {
		this.lifecycleState = lifecycleState;
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
