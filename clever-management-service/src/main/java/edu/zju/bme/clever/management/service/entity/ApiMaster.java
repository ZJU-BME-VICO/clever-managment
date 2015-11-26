package edu.zju.bme.clever.management.service.entity;

import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;





import org.hibernate.annotations.DynamicUpdate;


@Entity
@Table
@DynamicUpdate(true)
public class ApiMaster extends AbstractIndentifiedEntity {
	/**
	 * 
	 */
	private static final long serialVersionUID = -8987860844917520301L;

	@Column
	private String name;

	@OneToMany(fetch=FetchType.LAZY, mappedBy = "apiMaster",orphanRemoval = true)
	private Set<ApiVersionMaster> versionMasters;

    @OneToOne
    private ApiVersionMaster latestVersionMaster;
  
    
	public ApiVersionMaster getLatestVersionMaster() {
		return latestVersionMaster;
	}

	public void setLatestVersionMaster(ApiVersionMaster latestVersionMaster) {
		this.latestVersionMaster = latestVersionMaster;
	}



	public Set<ApiVersionMaster> getVersionMasters() {
		return versionMasters;
	}

	public void setVersionMasters(Set<ApiVersionMaster> versionMasters) {
		this.versionMasters = versionMasters;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}




}
