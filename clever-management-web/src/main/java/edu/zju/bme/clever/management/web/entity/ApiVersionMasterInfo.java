package edu.zju.bme.clever.management.web.entity;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ApiVersionMasterInfo {
	private Integer Id;
	private Integer version;
	private List<ApiRootUrlMasterInfo> rootUrlMasters = new ArrayList<ApiRootUrlMasterInfo>();

	public Integer getId() {
		return Id;
	}

	public void setId(Integer id) {
		Id = id;
	}

	public Integer getVersion() {
		return version;
	}

	public void setVersion(Integer version) {
		this.version = version;
	}

	public List<ApiRootUrlMasterInfo> getRootUrlMasters() {
		return rootUrlMasters;
	}

	public void setRootUrlMasters(List<ApiRootUrlMasterInfo> rootUrlMasters) {
		this.rootUrlMasters = rootUrlMasters;
	}

}
