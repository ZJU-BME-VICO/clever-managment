package edu.zju.bme.clever.management.entity;

import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table
public class ArchetypeAuditLog extends AbstractIndentifiedEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4884485455464548573L;

	public enum ActionType {
		Create("Create"), Edit("Edit"), Submit("Submit"), Approve("Approve"), Deploy(
				"Deploy");

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
	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeFile archetypeFile;
	@Column
	private String archetypeVersion;
	@Column
	private ActionType actionType;
	@ManyToOne(fetch = FetchType.LAZY)
	private User operator;
	@Column
	@Temporal(TemporalType.TIMESTAMP)
	private Calendar recordTime;

	public ArchetypeMaster getArchetypeMaster() {
		return archetypeMaster;
	}

	public void setArchetypeMaster(ArchetypeMaster archetypeMaster) {
		this.archetypeMaster = archetypeMaster;
	}

	public ArchetypeFile getArchetypeFile() {
		return archetypeFile;
	}

	public void setArchetypeFile(ArchetypeFile archetypeFile) {
		this.archetypeFile = archetypeFile;
	}

	public String getArchetypeVersion() {
		return archetypeVersion;
	}

	public void setArchetypeVersion(String archetypeVersion) {
		this.archetypeVersion = archetypeVersion;
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

	public Calendar getRecordTime() {
		return recordTime;
	}

	public void setRecordTime(Calendar recordTime) {
		this.recordTime = recordTime;
	}

}
