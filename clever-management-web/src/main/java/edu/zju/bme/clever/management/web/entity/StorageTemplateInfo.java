package edu.zju.bme.clever.management.web.entity;

import java.util.List;

import edu.zju.bme.clever.management.service.entity.AbstractFile.SourceType;
import edu.zju.bme.clever.management.service.entity.EntityClass;
import edu.zju.bme.clever.management.service.entity.LifecycleState;

public class StorageTemplateInfo {
	private Integer id;
	private Integer specialiseArchetypeId;
	private Integer editorId;
	private String editorName;
	private SourceType source;
	private String name;
	private String content;
	private String version;
	private LifecycleState lifecycleState;
	private List<EntityClassInfo> entityClasses;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getSpecialiseArchetypeId() {
		return specialiseArchetypeId;
	}

	public void setSpecialiseArchetypeId(Integer specialiseArchetypeId) {
		this.specialiseArchetypeId = specialiseArchetypeId;
	}

	public Integer getEditorId() {
		return editorId;
	}

	public void setEditorId(Integer editorId) {
		this.editorId = editorId;
	}

	public String getEditorName() {
		return editorName;
	}

	public void setEditorName(String editorName) {
		this.editorName = editorName;
	}

	public SourceType getSource() {
		return source;
	}

	public void setSource(SourceType source) {
		this.source = source;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public LifecycleState getLifecycleState() {
		return lifecycleState;
	}

	public void setLifecycleState(LifecycleState lifecycleState) {
		this.lifecycleState = lifecycleState;
	}

	public List<EntityClassInfo> getEntityClasses() {
		return entityClasses;
	}

	public void setEntityClasses(List<EntityClassInfo> entityClasses) {
		this.entityClasses = entityClasses;
	}

}
