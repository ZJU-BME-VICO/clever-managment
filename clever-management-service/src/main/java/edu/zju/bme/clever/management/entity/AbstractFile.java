package edu.zju.bme.clever.management.entity;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToOne;

@SuppressWarnings({ "serial", "rawtypes" })
@MappedSuperclass
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class AbstractFile<T extends AbstractMaster> extends
		AbstractIndentifiedEntity {

	public enum SourceType {
		CKM("CKM"), ZJU("ZJU"), CLEVER("CLEVER");

		private final String value;

		public String getValue() {
			return value;
		}

		public String toString() {
			return value;
		}

		SourceType(String value) {
			this.value = value;
		}
	}

	@ManyToOne(fetch = FetchType.LAZY)
	private T master;
	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeFile specialiseArchetype;
	@Column
	private String specialiseArchetypeVersion;
	@Column
	private Integer specialiseArchetypeInternalVersion;
	@ManyToOne(fetch = FetchType.LAZY)
	private User editor;
	@Column
	@Enumerated(EnumType.STRING)
	private SourceType source;
	@Column
	private String name;
	@Column
	private String content;
	@Column
	private String version;
	@Column
	private Integer internalVersion;
	@Column
	private String lifecycleState;

	public T getMaster() {
		return master;
	}

	public void setMaster(T master) {
		this.master = master;
	}

	public ArchetypeFile getSpecialiseArchetype() {
		return specialiseArchetype;
	}

	public void setSpecialiseArchetype(ArchetypeFile specialiseArchetype) {
		this.specialiseArchetype = specialiseArchetype;
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

	public String getLifecycleState() {
		return lifecycleState;
	}

	public void setLifecycleState(String lifecycleState) {
		this.lifecycleState = lifecycleState;
	}

}
