package edu.zju.bme.clever.management.service.entity;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table
@DynamicUpdate(true)
public class ArchetypeRevisionFile extends
		AbstractRevisionFile<ArchetypeRevisionFile> {

	/**
	 * 
	 */
	private static final long serialVersionUID = -9074003964018886418L;

	@Lob
	@Column(nullable = false)
	private String adl;
	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeVersionMaster versionMaster;
	@Column(nullable = false)
	private String versionMasterVersion;

	public String getAdl() {
		return adl;
	}

	public void setAdl(String adl) {
		this.adl = adl;
	}

	public ArchetypeVersionMaster getVersionMaster() {
		return versionMaster;
	}

	public void setVersionMaster(ArchetypeVersionMaster versionMaster) {
		this.versionMaster = versionMaster;
	}

	public String getVersionMasterVersion() {
		return versionMasterVersion;
	}

	public void setVersionMasterVersion(String versionMasterVersion) {
		this.versionMasterVersion = versionMasterVersion;
	}

}