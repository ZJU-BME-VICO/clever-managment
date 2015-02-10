package edu.zju.bme.clever.management.service.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table
@DynamicUpdate(true)
public class TemplateMaster extends AbstractMaster<TemplateFile> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3362168676489019640L;

	@Column
	@Enumerated(EnumType.STRING)
	private TemplateType templateType;

	public TemplateType getTemplateType() {
		return templateType;
	}

	public void setTemplateType(TemplateType templateType) {
		this.templateType = templateType;
	}

}
