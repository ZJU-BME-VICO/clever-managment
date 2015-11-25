package edu.zju.bme.clever.management.web.entity;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ApiRootUrlMasterInfo {
	private Integer id;
	// private Integer apiVersion;
	private String rootUrlName;

	private List<ApiInfo> apiList = new ArrayList<ApiInfo>();

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	

	public List<ApiInfo> getApiList() {
		return apiList;
	}

	public void setApiList(List<ApiInfo> apiList) {
		this.apiList = apiList;
	}

	public String getRootUrlName() {
		return rootUrlName;
	}

	public void setRootUrlName(String rootUrlName) {
		this.rootUrlName = rootUrlName;
	}

}
