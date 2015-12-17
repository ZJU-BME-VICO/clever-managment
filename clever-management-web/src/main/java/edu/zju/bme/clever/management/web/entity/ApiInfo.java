package edu.zju.bme.clever.management.web.entity;

import java.util.ArrayList;
import java.util.List;

public class ApiInfo {
	private Integer Id;

	private List<ApiParamInfo> requestParams = new ArrayList<ApiParamInfo>();
	private List<ApiParamInfo> returnParams = new ArrayList<ApiParamInfo>();
	private String name;
	private String url;
	private String reuqestMethod;
	private String description;
	private String chineseDescription;
	private String chineseName;
	private List<String> mediaTypes = new ArrayList<String>();
	private List<ErrorCodeInfo> errorCodes = new ArrayList<ErrorCodeInfo>();

	public Integer getId() {
		return Id;
	}

	public void setId(Integer id) {
		Id = id;
	}

	public String getChineseDescription() {
		return chineseDescription;
	}

	public void setChineseDescription(String chineseDescription) {
		this.chineseDescription = chineseDescription;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getChineseName() {
		return chineseName;
	}

	public void setChineseName(String chineseName) {
		this.chineseName = chineseName;
	}

	public String getReuqestMethod() {
		return reuqestMethod;
	}

	public void setReuqestMethod(String reuqestMethod) {
		this.reuqestMethod = reuqestMethod;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<String> getMediaTypes() {
		return mediaTypes;
	}

	public void setMediaTypes(List<String> mediaTypes) {
		this.mediaTypes = mediaTypes;
	}

	public List<ErrorCodeInfo> getErrorCodes() {
		return errorCodes;
	}

	public void setErrorCodes(List<ErrorCodeInfo> errorCodes) {
		this.errorCodes = errorCodes;
	}

}
