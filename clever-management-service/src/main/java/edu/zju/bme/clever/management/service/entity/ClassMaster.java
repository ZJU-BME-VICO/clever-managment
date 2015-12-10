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
public class ClassMaster extends AbstractIndentifiedEntity{

	/**
	 * 
	 */
	private static final long serialVersionUID = 3012802329943633410L;
	
	@Column 
	private String name;
	@Column
	private String type;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "classMaster", orphanRemoval = true, cascade = CascadeType.ALL)
	private Set<ClassAttribute> attributes;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Set<ClassAttribute> getAttributes() {
		return attributes;
	}
	public void setAttributes(Set<ClassAttribute> attributes) {
		this.attributes = attributes;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
}
