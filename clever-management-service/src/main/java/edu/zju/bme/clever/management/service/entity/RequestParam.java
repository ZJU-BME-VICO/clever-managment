package edu.zju.bme.clever.management.service.entity;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table
@DynamicUpdate(true)
public class RequestParam extends AbstractParam{

	/**
	 * 
	 */
	private static final long serialVersionUID = 7694873032536694345L;

	@Column 
	private Boolean required;

	

	public Boolean getRequired() {
		return required;
	}

	public void setRequired(Boolean required) {
		this.required = required;
	}
	
}
