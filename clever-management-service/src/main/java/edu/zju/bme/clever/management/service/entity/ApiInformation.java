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

@Entity
@Table
@DynamicUpdate(true)
public class ApiInformation extends AbstractIndentifiedEntity {

	/**
	 * author Mecro
	 */
	private static final long serialVersionUID = 7996299782990479255L;

	@ManyToOne
	@JoinColumn(name = "root_url_type_id", nullable = false)
	private ApiRootUrlMaster apiRootUrlMaster;
	@Column
	private String url;
	@Column
	private String name;

	@Column
	private String requestMethod;

	@OneToMany(mappedBy = "apiInformation", orphanRemoval = true, cascade = CascadeType.ALL)
	private List<RequestParam> requestParamList;

	@OneToMany(mappedBy = "apiInformation", orphanRemoval = true, cascade = CascadeType.ALL)
	private List<ReturnParam> returnParamList;

	@OneToMany(mappedBy = "apiInformation", cascade = CascadeType.ALL)
	private Set<ApiMediaType> apiMediaTypeSet;

	@Lob
	@Column
	private String apiDescription;

	// getter and setter

	public String getUrl() {
		return url;
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

	public List<RequestParam> getRequestParamList() {
		return requestParamList;
	}

	public void setRequestParamList(List<RequestParam> requestParamList) {
		this.requestParamList = requestParamList;
	}

	public List<ReturnParam> getReturnParamList() {
		return returnParamList;
	}

	public void setReturnParamList(List<ReturnParam> returnParamList) {
		this.returnParamList = returnParamList;
	}

	public Set<ApiMediaType> getApiMediaTypeSet() {
		return apiMediaTypeSet;
	}

	public void setApiMediaTypeSet(Set<ApiMediaType> apiMediaTypeSet) {
		this.apiMediaTypeSet = apiMediaTypeSet;
	}

	public String getApiDescription() {
		return apiDescription;
	}

	public void setApiDescription(String apiDescription) {
		this.apiDescription = apiDescription;
	}

}
