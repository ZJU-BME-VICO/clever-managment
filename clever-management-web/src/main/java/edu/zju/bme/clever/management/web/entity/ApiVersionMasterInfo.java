package edu.zju.bme.clever.management.web.entity;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ApiVersionMasterInfo {
	private Integer Id;
	private Integer apiVersion;
	private List<ApiRootUrlMasterInfo> apiRootUrlMasters = new ArrayList<ApiRootUrlMasterInfo>();
	

	private String apiMasterName;



	public Integer getId() {
		return Id;
	}

	public void setId(Integer id) {
		Id = id;
	}


	public Integer getApiVersion() {
		return apiVersion;
	}

	public void setApiVersion(Integer apiVersion) {
		this.apiVersion = apiVersion;
	}


	public String getApiMasterName() {
		return apiMasterName;
	}

	public void setApiMasterName(String apiMasterName) {
		this.apiMasterName = apiMasterName;
	}
	public List<ApiRootUrlMasterInfo> getApiRootUrlMasters() {
		return apiRootUrlMasters;
	}

	public void setApiRootUrlMasters(List<ApiRootUrlMasterInfo> apiRootUrlMasters) {
		this.apiRootUrlMasters = apiRootUrlMasters;
	}

}
