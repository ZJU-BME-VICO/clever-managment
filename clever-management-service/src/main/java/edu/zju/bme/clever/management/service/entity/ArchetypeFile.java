package edu.zju.bme.clever.management.service.entity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

@Entity
@Table
public class ArchetypeFile extends AbstractFile<ArchetypeMaster> {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3337605787682889359L;

	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeFile lastVersionArchetype;

	public ArchetypeFile getLastVersionArchetype() {
		return lastVersionArchetype;
	}

	public void setLastVersionArchetype(ArchetypeFile lastVersionArchetype) {
		this.lastVersionArchetype = lastVersionArchetype;
	}

}
