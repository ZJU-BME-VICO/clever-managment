package edu.zju.bme.clever.management.entity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table
public class ArchetypeFile extends AbstractIndentifiedEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3337605787682889359L;
	
	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeMaster archetypeMaster;
	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeFile specialiseArchetype;
	@ManyToOne(fetch = FetchType.LAZY)
	private User editor;
	

}
