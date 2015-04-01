package edu.zju.bme.clever.management.service.entity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.MapKeyColumn;
import javax.persistence.MapKeyJoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table(indexes = { @Index(name = "Index_Template_File_Name", columnList = "name") })
@DynamicUpdate(true)
public class TemplateFile extends AbstractFile<TemplateMaster> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 16763153667340880L;

	@Column
	private Integer subVersion;
	@ManyToOne(fetch = FetchType.LAZY)
	private TemplateFile lastVersionTemplate;
	@ElementCollection(fetch = FetchType.LAZY)
	@CollectionTable
	@Column(name = "value")
	@Lob
	@MapKeyColumn(name = "attribute")
	private Map<TemplatePropertyType, String> properties = new HashMap<TemplatePropertyType, String>();
	@Column
	private TemplateType templateType;

	public Integer getSubVersion() {
		return subVersion;
	}

	public void setSubVersion(Integer subVersion) {
		this.subVersion = subVersion;
	}

	public TemplateFile getLastVersionTemplate() {
		return lastVersionTemplate;
	}

	public void setLastVersionTemplate(TemplateFile lastVersionTemplate) {
		this.lastVersionTemplate = lastVersionTemplate;
	}

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

}
