package edu.zju.bme.clever.management.service.entity;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.MapKeyColumn;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table
@DynamicUpdate(true)
public class TemplateRevisionFile extends
		AbstractRevisionFile<TemplateRevisionFile> {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8715669749258421079L;

	@Column
	private TemplateType templateType;
	@Lob
	@Column(nullable = false)
	private String oet;
	@ElementCollection(fetch = FetchType.LAZY)
	@CollectionTable
	@Column(name = "value")
	@Lob
	@MapKeyColumn(name = "attribute")
	private Map<TemplatePropertyType, String> properties = new HashMap<TemplatePropertyType, String>();
	@ManyToOne(fetch = FetchType.LAZY)
	private TemplateMaster templateMaster;
	@Column
	private String templateMasterVersion;

	public Map<TemplatePropertyType, String> getPropertyMap() {
		return properties;
	}

	public String getPropertyValue(TemplatePropertyType propertyName) {
		return this.properties.get(propertyName);
	}

	public void addProperty(TemplatePropertyType propertyName, String value) {
		this.properties.put(propertyName, value);
	}

	public TemplateType getTemplateType() {
		return templateType;
	}

	public void setTemplateType(TemplateType templateType) {
		this.templateType = templateType;
	}

	public String getOet() {
		return oet;
	}

	public void setOet(String oet) {
		this.oet = oet;
	}

	public Map<TemplatePropertyType, String> getProperties() {
		return properties;
	}

	public TemplateMaster getTemplateMaster() {
		return templateMaster;
	}

	public void setTemplateMaster(TemplateMaster templateMaster) {
		this.templateMaster = templateMaster;
	}

	public String getTemplateMasterVersion() {
		return templateMasterVersion;
	}

	public void setTemplateMasterVersion(String templateMasterVersion) {
		this.templateMasterVersion = templateMasterVersion;
	}

}
