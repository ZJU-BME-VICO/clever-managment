package edu.zju.bme.clever.management.web.entity;

import java.util.List;

import edu.zju.bme.clever.management.service.entity.EntityClass;
import edu.zju.bme.clever.management.service.entity.LifecycleState;

public class TemplateInfo {
	private Integer id;
	private Integer specialiseArchetypeId;
	private Integer editorId;
	private String editorName;
	private String source;
	private String name;
	private String content;
	private String version;
	private String lifecycleState;

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

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
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

	public String getLifecycleState() {
		return lifecycleState;
	}

	public void setLifecycleState(String lifecycleState) {
		this.lifecycleState = lifecycleState;
	}

}
