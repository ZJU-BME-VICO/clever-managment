package edu.zju.bme.clever.management.service.entity;

import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table
@DynamicUpdate(true)
public class ApiVersionMaster extends AbstractIndentifiedEntity implements Comparable<ApiVersionMaster>{

	/**
	 * 
	 */
	private static final long serialVersionUID = 2336528915710441406L;

	@ManyToOne(fetch = FetchType.LAZY)
	private ApiMaster apiMaster;
	@Column(nullable = false)
	private Integer version;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "apiVersionMaster", cascade = CascadeType.ALL)
	private Set<ApiRootUrlMaster> apiRootUrlMasters;
	@OneToOne
	private ApiVersionMaster lastVersionMaster;

    @OneToOne
    private ApiVersionMaster nextVersionMaster;
    

	public ApiVersionMaster getNextVersionMaster() {
		return nextVersionMaster;
	}

	public void setNextVersionMaster(ApiVersionMaster nextVersionMaster) {
		this.nextVersionMaster = nextVersionMaster;
	}

	public ApiVersionMaster getLastVersionMaster() {
		return lastVersionMaster;
	}

	public void setLastVersionMaster(ApiVersionMaster lastVersionMaster) {
		this.lastVersionMaster = lastVersionMaster;
	}

	// getter and setter
	public ApiMaster getApiMaster() {
		return apiMaster;
	}

	public void setApiMaster(ApiMaster apiMaster) {
		this.apiMaster = apiMaster;
	}

	public Integer getVersion() {
		return version;
	}

	public void setVersion(Integer version) {
		this.version = version;
	}

	public Set<ApiRootUrlMaster> getApiRootUrlMasters() {
		return apiRootUrlMasters;
	}

	public void setApiRootUrlMasters(Set<ApiRootUrlMaster> apiRootUrlMasters) {
		this.apiRootUrlMasters = apiRootUrlMasters;
	}
	
	public boolean equals(ApiVersionMaster master){
		return master.getId().equals(this.getId());
	}

	@Override
	public int compareTo(ApiVersionMaster master) {
		if (this.getVersion() < master.getVersion()) {
			return -1;
		} else {
			return 1;
		}
	}
}
