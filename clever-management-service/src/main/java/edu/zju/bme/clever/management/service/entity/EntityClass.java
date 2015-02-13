package edu.zju.bme.clever.management.service.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table
@DynamicUpdate(true)
public class EntityClass extends AbstractIndentifiedEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3408157777080650481L;

	@Column(nullable = false)
	private String name;
	@Column(nullable = false)
	private String fullName;
	@Column(nullable = false)
	private String packageName;
	@Column(nullable = false)
	private String entityId;
	@Column(nullable = false)
	private String content;
	@ManyToOne(fetch = FetchType.LAZY)
	private TemplateFile templateFile;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getPackageName() {
		return packageName;
	}

	public void setPackageName(String packageName) {
		this.packageName = packageName;
	}

	public String getEntityId() {
		return entityId;
	}

	public void setEntityId(String entityId) {
		this.entityId = entityId;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public TemplateFile getTemplateFile() {
		return templateFile;
	}

	public void setTemplateFile(TemplateFile templateFile) {
		this.templateFile = templateFile;
	}

}
