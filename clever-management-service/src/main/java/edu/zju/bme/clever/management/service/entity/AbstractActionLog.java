package edu.zju.bme.clever.management.service.entity;

import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@MappedSuperclass
@Inheritance(strategy = InheritanceType.JOINED)
public class AbstractActionLog<T extends AbstractMaster> extends
		AbstractIndentifiedEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = -638356369400730693L;
	
	@ManyToOne(fetch = FetchType.LAZY)
	private T master;
	@Column(nullable = false)
	private String version;
	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private LifecycleState lifecycleState;
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

	public T getMaster() {
		return master;
	}

	public void setMaster(T master) {
		this.master = master;
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
