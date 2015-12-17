package edu.zju.bme.clever.management.service.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table
@DynamicUpdate(true)
public class ErrorCode extends AbstractIndentifiedEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1928111475757751795L;

	@ManyToOne(fetch = FetchType.LAZY)
	private ApiInformation apiInformation;
	@Column
	private String code;
	@Column
	private String descriptionEn;
	@Column
	private String descriptionZh;

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

	public ApiInformation getApiInformation() {
		return apiInformation;
	}

	public void setApiInformation(ApiInformation apiInformation) {
		this.apiInformation = apiInformation;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

}
