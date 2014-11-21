package edu.zju.bme.clever.management.service.entity;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table
public class ArchetypeMaster extends AbstractMaster<ArchetypeFile> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 4711360469654915674L;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "archetypeMaster")
	private List<ArchetypeActionLog> actionLogs;

	public List<ArchetypeActionLog> getActionLogs() {
		return actionLogs;
	}

}
