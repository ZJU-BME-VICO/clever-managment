package edu.zju.bme.clever.management.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table
public class ArchetypeMaster extends AbstractIndentifiedEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 4711360469654915674L;

	@Column
	private String masterName;
	@Column
	private String rmOrginator;
	@Column
	private String rmName;
	@Column
	private String rmEntity;
	@Column
	private String conceptName;
	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeMaster specialiseArchetypeMaster;
	@Column
	private String latestSpecialiseArchetypeVersion;
	@Column
	private String currentSpecialiseArchetypeVersion;
	

}
