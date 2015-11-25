package edu.zju.bme.clever.management.web.entity;

import java.util.HashSet;
import java.util.Set;

public class ApiRootUrlMasterInfo {
	private Integer id;
	private Integer apiVersion;
	private Set<ApiInfo> apiList = new HashSet<ApiInfo>();


	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getApiVersion() {
		return apiVersion;
	}

	public void setApiVersion(Integer apiVersion) {
		this.apiVersion = apiVersion;
	}

	public Set<ApiInfo> getApiList() {
		return apiList;
	}

	public void setApiList(Set<ApiInfo> apiList) {
		this.apiList = apiList;
	}

}
