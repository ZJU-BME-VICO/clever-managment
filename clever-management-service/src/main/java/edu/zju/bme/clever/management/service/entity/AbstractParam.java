package edu.zju.bme.clever.management.service.entity;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

@MappedSuperclass
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class AbstractParam extends AbstractIndentifiedEntity {

	/**
	 * author Mecro
	 */
	private static final long serialVersionUID = -7666433767213489746L;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "api_id")
	private ApiInformation apiInformation;

	@Column
	private String type;

	@Column
	private String name;
	@Column
	private Boolean isBaseType;
	@Column
	private Boolean isList;
	@Lob
	@Column
	private String description;
	@OneToOne(fetch = FetchType.LAZY, orphanRemoval = true, cascade = CascadeType.ALL)
	private ClassMaster classMaster;
	@Lob
	@Column
	private String chineseDescription;

	public ClassMaster getClassMaster() {
		return classMaster;
	}

	public void setClassMaster(ClassMaster classMaster) {
		this.classMaster = classMaster;
	}

	public String getChineseDescription() {
		return chineseDescription;
	}

	public void setChineseDescription(String chineseDescription) {
		this.chineseDescription = chineseDescription;
	}

	public ApiInformation getApiInformation() {
		return apiInformation;
	}

	public void setApiInformation(ApiInformation apiInformation) {
		this.apiInformation = apiInformation;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Boolean getIsBaseType() {
		return isBaseType;
	}

	public void setIsBaseType(Boolean isBaseType) {
		this.isBaseType = isBaseType;
	}

	public Boolean getIsList() {
		return isList;
	}

	public void setIsList(Boolean isList) {
		this.isList = isList;
	}

}
