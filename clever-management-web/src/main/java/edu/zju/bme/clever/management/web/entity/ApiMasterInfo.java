package edu.zju.bme.clever.management.web.entity;

import java.util.ArrayList;
import java.util.List;

public class ApiMasterInfo {
	private String ApiMasterName;
	private List<ApiVersionMasterInfo> apiVersionMasterList = new ArrayList<ApiVersionMasterInfo>();
    private ApiVersionMasterInfo latestApiVersionMasterInfo;
	
    
    //getter and setter
    public ApiVersionMasterInfo getLatestApiVersionMasterInfo() {
		return latestApiVersionMasterInfo;
	}

	public void setLatestApiVersionMasterInfo(
			ApiVersionMasterInfo latestApiVersionMasterInfo) {
		this.latestApiVersionMasterInfo = latestApiVersionMasterInfo;
	}

	public String getApiMasterName() {
		return ApiMasterName;
	}

	public void setApiMasterName(String apiMasterName) {
		ApiMasterName = apiMasterName;
	}

	public List<ApiVersionMasterInfo> getApiVersionMasterList() {
		return apiVersionMasterList;
	}

	public void setApiVersionMasterList(
			List<ApiVersionMasterInfo> apiVersionMasterList) {
		this.apiVersionMasterList = apiVersionMasterList;
	}

}
