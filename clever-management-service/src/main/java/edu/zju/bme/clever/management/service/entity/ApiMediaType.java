package edu.zju.bme.clever.management.service.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table
@DynamicUpdate(true)
public class ApiMediaType extends AbstractIndentifiedEntity{

	/**
	 * 
	 */
	private static final long serialVersionUID = -5949192627317253014L;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "api_id")
	private ApiInformation apiInformation;
	
	@Column
	private String mediaType;

	public ApiInformation getApiInformation() {
		return apiInformation;
	}

	public void setApiInformation(ApiInformation apiInformation) {
		this.apiInformation = apiInformation;
	}

	public String getMediaType() {
		return mediaType;
	}

	public void setMediaType(String mediaType) {
		this.mediaType = mediaType;
	}
	
}
