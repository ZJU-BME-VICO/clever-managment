package edu.zju.bme.clever.management.service.entity;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table
@DynamicUpdate(true)
public class ApiRootUrlMaster extends AbstractIndentifiedEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2360685789894589598L;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "api_version_master_id")
	private ApiVersionMaster apiVersionMaster;
	@OneToMany(mappedBy = "apiRootUrlMaster", orphanRemoval = true, cascade = CascadeType.ALL)
	private List<ApiInformation> apiInformationList;
	@Column(nullable = false)
	private String name;

	// getter and setter

	public ApiVersionMaster getApiVersionMaster() {
		return apiVersionMaster;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setApiVersionMaster(ApiVersionMaster apiVersionMaster) {
		this.apiVersionMaster = apiVersionMaster;
	}

	public List<ApiInformation> getApiInformationList() {
		return apiInformationList;
	}

	public void setApiInformationList(List<ApiInformation> apiInformationList) {
		this.apiInformationList = apiInformationList;
	}

}
