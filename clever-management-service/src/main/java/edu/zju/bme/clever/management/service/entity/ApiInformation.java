package edu.zju.bme.clever.management.service.entity;

import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.FetchMode;

@Entity
@Table
@DynamicUpdate(true)
public class ApiInformation extends AbstractIndentifiedEntity {

	/**
	 * author Mecro
	 */
	private static final long serialVersionUID = 7996299782990479255L;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "root_url_type_id", nullable = false)
	private ApiRootUrlMaster apiRootUrlMaster;
	@Column
	private String url;
	@Column
	private String name;
	@Column
	private String chineseName;

	@Column
	private String requestMethod;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "apiInformation", orphanRemoval = true, cascade = CascadeType.ALL)
	private Set<RequestParam> requestParams;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "apiInformation", orphanRemoval = true, cascade = CascadeType.ALL)
	private Set<ReturnParam> returnParams;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "apiInformation", cascade = CascadeType.ALL)
	private Set<ApiMediaType> apiMediaTypes;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "apiInformation", orphanRemoval = true, cascade = CascadeType.ALL)
	private Set<ErrorCode> errorCodes;

	@Lob
	@Column
	private String description;

	@Lob
	@Column
	private String chineseDescription;

	// getter and setter

	public String getUrl() {
		return url;
	}

	public String getChineseName() {
		return chineseName;
	}

	public void setChineseName(String chineseName) {
		this.chineseName = chineseName;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRequestMethod() {
		return requestMethod;
	}

	public void setRequestMethod(String requestMethod) {
		this.requestMethod = requestMethod;
	}

	public ApiRootUrlMaster getApiRootUrlMaster() {
		return apiRootUrlMaster;
	}

	public void setApiRootUrlMaster(ApiRootUrlMaster apiRootUrlMaster) {
		this.apiRootUrlMaster = apiRootUrlMaster;
	}

	public Set<RequestParam> getRequestParams() {
		return requestParams;
	}

	public void setRequestParams(Set<RequestParam> requestParams) {
		this.requestParams = requestParams;
	}

	public Set<ReturnParam> getReturnParams() {
		return returnParams;
	}

	public void setReturnParams(Set<ReturnParam> returnParams) {
		this.returnParams = returnParams;
	}

	public Set<ApiMediaType> getApiMediaTypes() {
		return apiMediaTypes;
	}

	public void setApiMediaTypes(Set<ApiMediaType> apiMediaTypes) {
		this.apiMediaTypes = apiMediaTypes;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getChineseDescription() {
		return chineseDescription;
	}

	public void setChineseDescription(String chineseDescription) {
		this.chineseDescription = chineseDescription;
	}

	public Set<ErrorCode> getErrorCodes() {
		return errorCodes;
	}

	public void setErrorCodes(Set<ErrorCode> errorCodes) {
		this.errorCodes = errorCodes;
	}

}
