package edu.zju.bme.clever.management.service.entity;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

@SuppressWarnings({ "serial", "rawtypes" })
@MappedSuperclass
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class AbstractFile<T extends AbstractMaster> extends
		AbstractIndentifiedEntity {

	@ManyToOne(fetch = FetchType.LAZY)
	private T master;
	@Column(name = "master_id", updatable = false, insertable = false)
	private Integer masterId;
	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeFile specialiseArchetype;
	@Column(name = "specialise_archetype_id", updatable = false, insertable = false)
	private Integer specialiseArchetypeId;
	@Column
	private String specialiseArchetypeVersion;
	@Column
	private Integer specialiseArchetypeInternalVersion;
	@ManyToOne(fetch = FetchType.LAZY)
	private User editor;
	@Column(nullable = false)
	private SourceType source;
	@Column(nullable = false)
	private String name;
	@Lob
	@Column(nullable = false)
	private String content;
	@Column(nullable = false)
	private String version;
	@Column(nullable = false)
	private Integer internalVersion;
	@Column(nullable = false)
	private LifecycleState lifecycleState;

	public T getMaster() {
		return master;
	}

	public void setMaster(T master) {
		this.master = master;
	}

	public Integer getMasterId() {
		return masterId;
	}

	public ArchetypeFile getSpecialiseArchetype() {
		return specialiseArchetype;
	}

	public void setSpecialiseArchetype(ArchetypeFile specialiseArchetype) {
		this.specialiseArchetype = specialiseArchetype;
	}

	public Integer getSpecialiseArchetypeId() {
		return specialiseArchetypeId;
	}

	public String getSpecialiseArchetypeVersion() {
		return specialiseArchetypeVersion;
	}

	public void setSpecialiseArchetypeVersion(String specialiseArchetypeVersion) {
		this.specialiseArchetypeVersion = specialiseArchetypeVersion;
	}

	public Integer getSpecialiseArchetypeInternalVersion() {
		return specialiseArchetypeInternalVersion;
	}

	public void setSpecialiseArchetypeInternalVersion(
			Integer specialiseArchetypeInternalVersion) {
		this.specialiseArchetypeInternalVersion = specialiseArchetypeInternalVersion;
	}

	public User getEditor() {
		return editor;
	}

	public void setEditor(User editor) {
		this.editor = editor;
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

	public Integer getInternalVersion() {
		return internalVersion;
	}

	public void setInternalVersion(Integer internalVersion) {
		this.internalVersion = internalVersion;
	}

	public LifecycleState getLifecycleState() {
		return lifecycleState;
	}

	public void setLifecycleState(LifecycleState lifecycleState) {
		this.lifecycleState = lifecycleState;
	}

}
