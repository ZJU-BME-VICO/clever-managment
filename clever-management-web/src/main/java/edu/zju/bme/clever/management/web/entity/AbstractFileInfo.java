package edu.zju.bme.clever.management.web.entity;

import java.util.Calendar;

public abstract class AbstractFileInfo {
	private int id;
	private String name;
	private String rmOriginator;
	private String rmName;
	private String rmEntity;
	private String conceptName;
	private String version;
	private int versionMasterId;
	private String versionMasterName;
	private String lifecycleState;
	private int serialVersion;
	private int editorId;
	private String editorName;
	private ArchetypeInfo specialiseArchetype;
	private ArchetypeInfo lastRevisionArchetype;
	private Calendar lastModifyTime;
	
	public Calendar getLastModifyTime() {
		return lastModifyTime;
	}

	public void setLastModifyTime(Calendar lastModifyTime) {
		this.lastModifyTime = lastModifyTime;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRmOriginator() {
		return rmOriginator;
	}

	public void setRmOriginator(String rmOriginator) {
		this.rmOriginator = rmOriginator;
	}

	public String getRmName() {
		return rmName;
	}

	public void setRmName(String rmName) {
		this.rmName = rmName;
	}

	public String getRmEntity() {
		return rmEntity;
	}

	public void setRmEntity(String rmEntity) {
		this.rmEntity = rmEntity;
	}

	public String getConceptName() {
		return conceptName;
	}

	public void setConceptName(String conceptName) {
		this.conceptName = conceptName;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public int getVersionMasterId() {
		return versionMasterId;
	}

	public void setVersionMasterId(int versionMasterId) {
		this.versionMasterId = versionMasterId;
	}

	public String getVersionMasterName() {
		return versionMasterName;
	}

	public void setVersionMasterName(String versionMasterName) {
		this.versionMasterName = versionMasterName;
	}

	public String getLifecycleState() {
		return lifecycleState;
	}

	public void setLifecycleState(String lifecycleState) {
		this.lifecycleState = lifecycleState;
	}

	public int getSerialVersion() {
		return serialVersion;
	}

	public void setSerialVersion(int serialVersion) {
		this.serialVersion = serialVersion;
	}

	public int getEditorId() {
		return editorId;
	}

	public void setEditorId(int editorId) {
		this.editorId = editorId;
	}

	public String getEditorName() {
		return editorName;
	}

	public void setEditorName(String editorName) {
		this.editorName = editorName;
	}

	public ArchetypeInfo getSpecialiseArchetype() {
		return specialiseArchetype;
	}

	public void setSpecialiseArchetype(ArchetypeInfo specialiseArchetype) {
		this.specialiseArchetype = specialiseArchetype;
	}

	public ArchetypeInfo getLastRevisionArchetype() {
		return lastRevisionArchetype;
	}

	public void setLastRevisionArchetype(ArchetypeInfo lastRevisionArchetype) {
		this.lastRevisionArchetype = lastRevisionArchetype;
	}

	@Override
	public boolean equals(Object obj) {
		if (this.getClass().isInstance(obj)) {
			return this.getClass().cast(obj).getId() == id;
		}
		return false;
	}

}
