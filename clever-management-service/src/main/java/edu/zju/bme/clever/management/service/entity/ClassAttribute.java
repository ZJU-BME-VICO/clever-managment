package edu.zju.bme.clever.management.service.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.ManyToAny;

@Entity
@Table
@DynamicUpdate
public class ClassAttribute extends AbstractIndentifiedEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2976871582262311497L;

	@ManyToOne(fetch = FetchType.LAZY)
	private ClassMaster classMaster;
	@Column
	private String name;
	@Column
	private String type;
	@Column
	private String descriptionEn;
	@Column
	private String descriptionZh;
	@Column
	private Boolean isRequired;
	@Column
	private Boolean isBaseType;
	@Column
	private Boolean isList;

	public Boolean getIsList() {
		return isList;
	}

	public void setIsList(Boolean isList) {
		this.isList = isList;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getDescriptionEn() {
		return descriptionEn;
	}

	public void setDescriptionEn(String descriptionEn) {
		this.descriptionEn = descriptionEn;
	}

	public String getDescriptionZh() {
		return descriptionZh;
	}

	public void setDescriptionZh(String descriptionZh) {
		this.descriptionZh = descriptionZh;
	}

	public Boolean getIsRequired() {
		return isRequired;
	}

	public void setIsRequired(Boolean isRequired) {
		this.isRequired = isRequired;
	}

	public Boolean getIsBaseType() {
		return isBaseType;
	}

	public void setIsBaseType(Boolean isBaseType) {
		this.isBaseType = isBaseType;
	}

	public ClassMaster getClassMaster() {
		return classMaster;
	}

	public void setClassMaster(ClassMaster classMaster) {
		this.classMaster = classMaster;
	}
}
