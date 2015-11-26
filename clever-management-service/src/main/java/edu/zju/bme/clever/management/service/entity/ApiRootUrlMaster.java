package edu.zju.bme.clever.management.service.entity;

import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

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
	
	@LazyCollection(LazyCollectionOption.FALSE)
	@CollectionTable
	@OneToMany(mappedBy = "apiRootUrlMaster", orphanRemoval = true, cascade = CascadeType.ALL)
	private Set<ApiInformation> apiInformations;
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

	public Set<ApiInformation> getApiInformations() {
		return apiInformations;
	}

	public void setApiInformations(Set<ApiInformation> apiInformations) {
		this.apiInformations = apiInformations;
	}


}
