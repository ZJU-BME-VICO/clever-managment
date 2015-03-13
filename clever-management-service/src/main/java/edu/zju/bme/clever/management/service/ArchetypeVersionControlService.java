package edu.zju.bme.clever.management.service;

import org.openehr.am.archetype.Archetype;

import edu.zju.bme.clever.management.service.entity.ArchetypeFile;
import edu.zju.bme.clever.management.service.entity.SourceType;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.exception.VersionControlException;

public interface ArchetypeVersionControlService {

	public void createOrUpgradeArchetype(Archetype archetype,
			SourceType source, User user) throws VersionControlException;

	public void createOrUpgradeArchetype(String adl, SourceType source,
			User user) throws VersionControlException;

	public void editArchetype(Integer archetypeId, String adl, User user)
			throws VersionControlException;

	public void editArchetype(String archetypeName, String adl, User user)
			throws VersionControlException;

	public void editArchetype(ArchetypeFile archetypeFile, String adl, User user)
			throws VersionControlException;

	public void editArchetype(ArchetypeFile archetypeFile, Archetype archetype,
			User user) throws VersionControlException;

	public void submitArchetype(Integer archetypeId, User user)
			throws VersionControlException;

	public void submitArchetype(String archetypeName, User user)
			throws VersionControlException;

	public void submitArchetype(ArchetypeFile archetypeFile, User user)
			throws VersionControlException;

	public void approveArchetype(Integer archetypeId, User user)
			throws VersionControlException;

	public void approveArchetype(String archetypeName, User user)
			throws VersionControlException;

	public void approveArchetype(ArchetypeFile archetypeFile, User user)
			throws VersionControlException;

	public void rejectArchetype(Integer archetypeId, User user)
			throws VersionControlException;

	public void rejectArchetype(String archetypeName, User user)
			throws VersionControlException;

	public void rejectArchetype(ArchetypeFile archetypeFile, User user)
			throws VersionControlException;

	public void rejectAndRemoveArchetype(Integer archetypeId, User user)
			throws VersionControlException;

	public void rejectAndRemoveArchetype(String archetypeName, User user)
			throws VersionControlException;

	public void rejectAndRemoveArchetype(ArchetypeFile archetypeFile, User user)
			throws VersionControlException;

}
