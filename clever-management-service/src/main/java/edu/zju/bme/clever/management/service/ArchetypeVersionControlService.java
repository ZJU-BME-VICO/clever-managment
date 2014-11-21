package edu.zju.bme.clever.management.service;

import org.openehr.am.archetype.Archetype;

import edu.zju.bme.clever.management.service.entity.ArchetypeFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.entity.AbstractFile.SourceType;
import edu.zju.bme.clever.management.service.entity.ArchetypeActionLog.ActionType;
import edu.zju.bme.clever.management.service.exception.VersionControlException;

public interface ArchetypeVersionControlService {
	
	public void createOrUpgradeArchetype(Archetype archetype,
			SourceType source, User user) throws VersionControlException;

	public void editArchetype(Archetype archetype, SourceType source, User user)
			throws VersionControlException;

	public void submitArchetype(Archetype archetype, User user)
			throws VersionControlException;

	public void submitArchetype(ArchetypeFile archetypeFile, User user)
			throws VersionControlException;

	public void approveArchetype(Archetype archetype, User user)
			throws VersionControlException;

	public void approveArchetype(ArchetypeFile archetypeFile, User user)
			throws VersionControlException;

	public void rejectArchetype(Archetype archetype, User user)
			throws VersionControlException;

	public void rejectArchetype(ArchetypeFile archetypeFile, User user)
			throws VersionControlException;

	public void rejectAndRemoveArchetype(Archetype archetype, User user)
			throws VersionControlException;
	
	public void rejectAndRemoveArchetype(ArchetypeFile archetypeFile, User user)
			throws VersionControlException;
}