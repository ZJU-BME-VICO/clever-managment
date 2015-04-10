package edu.zju.bme.clever.management.service.entity;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class AbstractRevisionFile<T extends AbstractRevisionFile<?>>
		extends AbstractIndentifiedEntity {

	@Column(nullable = false)
	private String name;
	@Column(nullable = false)
	private String version;
	@Column(nullable = false)
	private Integer serialVersion;
	@ManyToOne(fetch = FetchType.LAZY)
	private User editor;
	@Column(nullable = false)
	private LifecycleState lifecycleState;
	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeRevisionFile specialiseArchetypeRevisionFile;
	@Column
	private String specialiseArchetypeRevisionFileVersion;
	@Column
	private Integer specialiseArchetypeRevisionFileSerialVersion;
	@ManyToOne(fetch = FetchType.LAZY)
	private T lastRevisionFile;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public Integer getSerialVersion() {
		return serialVersion;
	}

	public void setSerialVersion(Integer serialVersion) {
		this.serialVersion = serialVersion;
	}

	public LifecycleState getLifecycleState() {
		return lifecycleState;
	}

	public void setLifecycleState(LifecycleState lifecycleState) {
		this.lifecycleState = lifecycleState;
	}

	public ArchetypeRevisionFile getSpecialiseArchetypeRevisionFile() {
		return specialiseArchetypeRevisionFile;
	}

	public void setSpecialiseArchetypeRevisionFile(
			ArchetypeRevisionFile specialiseArchetypeRevisionFile) {
		this.specialiseArchetypeRevisionFile = specialiseArchetypeRevisionFile;
	}

	public T getLastRevisionFile() {
		return lastRevisionFile;
	}

	public void setLastRevisionFile(T lastRevisionFile) {
		this.lastRevisionFile = lastRevisionFile;
	}

	public User getEditor() {
		return editor;
	}

	public void setEditor(User editor) {
		this.editor = editor;
	}

	public Integer getSpecialiseArchetypeRevisionFileSerialVersion() {
		return specialiseArchetypeRevisionFileSerialVersion;
	}

	public void setSpecialiseArchetypeRevisionFileSerialVersion(
			Integer specialiseArchetypeRevisionFileSerialVersion) {
		this.specialiseArchetypeRevisionFileSerialVersion = specialiseArchetypeRevisionFileSerialVersion;
	}

	public String getSpecialiseArchetypeRevisionFileVersion() {
		return specialiseArchetypeRevisionFileVersion;
	}

	public void setSpecialiseArchetypeRevisionFileVersion(
			String specialiseArchetypeRevisionFileVersion) {
		this.specialiseArchetypeRevisionFileVersion = specialiseArchetypeRevisionFileVersion;
	}

}
