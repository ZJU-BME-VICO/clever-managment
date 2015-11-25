package edu.zju.bme.clever.management.web.entity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ApiMasterInfo {
	private Integer Id;
	private String ApiMasterName;

	private List<Integer> apiVersionList = new ArrayList<Integer>();

	// private ApiVersionMasterInfo latestApiVersionMasterInfo;
	private Integer latestVersion;

	// getter and setter
	// public ApiVersionMasterInfo getLatestApiVersionMasterInfo() {
	// return latestApiVersionMasterInfo;
	// }
	//
	// public void setLatestApiVersionMasterInfo(
	// ApiVersionMasterInfo latestApiVersionMasterInfo) {
	// this.latestApiVersionMasterInfo = latestApiVersionMasterInfo;
	// }

	public Integer getId() {
		return Id;
	}

	public void setId(Integer id) {
		Id = id;
	}

	public String getApiMasterName() {
		return ApiMasterName;
	}

	public List<Integer> getApiVersionList() {
		return apiVersionList;
	}

	public void setApiVersionList(List<Integer> apiVersionList) {
		this.apiVersionList = apiVersionList;
	}

	public Integer getLatestVersion() {
		return latestVersion;
	}

	public void setLatestVersion(Integer latestVersion) {
		this.latestVersion = latestVersion;
	}

	public void setApiMasterName(String apiMasterName) {
		ApiMasterName = apiMasterName;
	}

}
