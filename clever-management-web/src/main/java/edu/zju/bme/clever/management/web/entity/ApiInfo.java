package edu.zju.bme.clever.management.web.entity;

import java.util.ArrayList;
import java.util.List;



public class ApiInfo {
	private Integer Id;

	private List<ApiParamInfo> requestParams = new ArrayList<ApiParamInfo>();
	private List<ApiParamInfo> returnParams = new ArrayList<ApiParamInfo>();
	private String apiName;
	private String apiUrl;
	private String reuqestMethod;
	private String Description;
	private List<String> mediaTypes = new ArrayList<String>();

	
	public Integer getId() {
		return Id;
	}

	public void setId(Integer id) {
		Id = id;
	}

	public List<ApiParamInfo> getRequestParams() {
		return requestParams;
	}

	public void setRequestParams(List<ApiParamInfo> requestParams) {
		this.requestParams = requestParams;
	}

	public List<ApiParamInfo> getReturnParams() {
		return returnParams;
	}

	public void setReturnParams(List<ApiParamInfo> returnParams) {
		this.returnParams = returnParams;
	}

	public String getApiName() {
		return apiName;
	}

	public void setApiName(String apiName) {
		this.apiName = apiName;
	}

	public String getApiUrl() {
		return apiUrl;
	}

	public void setApiUrl(String apiUrl) {
		this.apiUrl = apiUrl;
	}

	public String getReuqestMethod() {
		return reuqestMethod;
	}

	public void setReuqestMethod(String reuqestMethod) {
		this.reuqestMethod = reuqestMethod;
	}

	public String getDescription() {
		return Description;
	}

	public void setDescription(String description) {
		Description = description;
	}

	public List<String> getMediaTypes() {
		return mediaTypes;
	}

	public void setMediaTypes(List<String> mediaTypes) {
		this.mediaTypes = mediaTypes;
	}

}
