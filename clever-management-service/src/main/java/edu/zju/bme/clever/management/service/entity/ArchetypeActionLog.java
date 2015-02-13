package edu.zju.bme.clever.management.service.entity;

import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table
@DynamicUpdate(true)
public class ArchetypeActionLog extends AbstractActionLog<ArchetypeMaster> {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4884485455464548573L;

}
