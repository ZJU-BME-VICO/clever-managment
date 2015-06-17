package edu.zju.bme.clever.management.service.entity;

import javax.persistence.Column;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Lob;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class AbstractMaster extends AbstractIndentifiedEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 4837517801780363223L;

	@Column(nullable = false)
	private String name;
	@Column(nullable = false)
	private String rmOrginator;
	@Column(nullable = false)
	private String rmName;
	@Column(nullable = false)
	private String rmEntity;
	@Column(nullable = false)
	private String conceptName;
	@Lob
	@Column
	private String conceptDescription;
	@Column
	private String keywords;
	@Lob
	@Column
	private String purpose;
	@Lob
	@Column
	private String use;
	@Lob
	@Column
	private String misuse;
	@Lob
	@Column
	private String copyright;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRmOrginator() {
		return rmOrginator;
	}

	public void setRmOrginator(String rmOrginator) {
		this.rmOrginator = rmOrginator;
	}

	public String getRmName() {
		return rmName;
	}

	public void setRmName(String rmName) {
		this.rmName = rmName;
	}

	public String getRmEntity() {
		return rmEntity;
	}

	public void setRmEntity(String rmEntity) {
		this.rmEntity = rmEntity;
	}

	public String getConceptName() {
		return conceptName;
	}

	public void setConceptName(String conceptName) {
		this.conceptName = conceptName;
	}

	public String getConceptDescription() {
		return conceptDescription;
	}

	public void setConceptDescription(String conceptDescription) {
		this.conceptDescription = conceptDescription;
	}

	public String getKeywords() {
		return keywords;
	}

	public void setKeywords(String keywords) {
		this.keywords = keywords;
	}

	public String getPurpose() {
		return purpose;
	}

	public void setPurpose(String purpose) {
		this.purpose = purpose;
	}

	public String getUse() {
		return use;
	}

	public void setUse(String use) {
		this.use = use;
	}

	public String getMisuse() {
		return misuse;
	}

	public void setMisuse(String misuse) {
		this.misuse = misuse;
	}

	public String getCopyright() {
		return copyright;
	}

	public void setCopyright(String copyright) {
		this.copyright = copyright;
	}

}
