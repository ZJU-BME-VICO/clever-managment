package edu.zju.bme.clever.management.web.entity;

public class ArchetypeInfo {
	private int id;
	private String name;
	private String rmOriginator;
	private String rmName;
	private String rmEntity;
	private String conceptName;
	private String adl;
	private String xml;
	private String version;
	private int masterId;
	private String masterName;
	private String lifecycleState;
	private ArchetypeInfo specialiseArchetype;
	private int internalVersion;

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

	public void setRmOriginator(String rmOrginator) {
		this.rmOriginator = rmOrginator;
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

	public String getAdl() {
		return adl;
	}

	public void setAdl(String adl) {
		this.adl = adl;
	}

	public String getXml() {
		return xml;
	}

	public void setXml(String xml) {
		this.xml = xml;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public int getMasterId() {
		return masterId;
	}

	public void setMasterId(int masterId) {
		this.masterId = masterId;
	}

	public String getMasterName() {
		return masterName;
	}

	public void setMasterName(String masterName) {
		this.masterName = masterName;
	}

	public String getLifecycleState() {
		return lifecycleState;
	}

	public void setLifecycleState(String lifecycleState) {
		this.lifecycleState = lifecycleState;
	}

	public ArchetypeInfo getSpecialiseArchetype() {
		return specialiseArchetype;
	}

	public void setSpecialiseArchetype(ArchetypeInfo specialiseArchetype) {
		this.specialiseArchetype = specialiseArchetype;
	}

	public int getInternalVersion() {
		return internalVersion;
	}

	public void setInternalVersion(int internalVersion) {
		this.internalVersion = internalVersion;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof ArchetypeInfo) {
			return ((ArchetypeInfo) obj).getId() == id;
		}
		return false;
	}

}
