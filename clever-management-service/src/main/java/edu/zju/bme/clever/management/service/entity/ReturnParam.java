package edu.zju.bme.clever.management.service.entity;

import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table
@DynamicUpdate(true)
public class ReturnParam extends AbstractParam {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6360606306529129342L;

}
