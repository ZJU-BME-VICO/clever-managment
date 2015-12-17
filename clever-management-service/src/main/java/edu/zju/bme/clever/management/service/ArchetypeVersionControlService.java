package edu.zju.bme.clever.management.service;

import org.openehr.am.archetype.Archetype;

import edu.zju.bme.clever.management.service.entity.ArchetypeRevisionFile;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.exception.VersionControlException;

public interface ArchetypeVersionControlService {

	public void acceptNewArchetype(Archetype archetype, User user)
			throws VersionControlException;

	public void editArchetype(Integer archetypeId, String adl, User user)
			throws VersionControlException;

	public void editArchetype(String archetypeName, String adl, User user)
			throws VersionControlException;

	public void editArchetype(ArchetypeRevisionFile archetypeFile, String adl,
			User user) throws VersionControlException;

	public void editArchetype(ArchetypeRevisionFile archetypeFile,
			Archetype archetype, User user) throws VersionControlException;

	public void submitArchetype(Integer archetypeId, User user)
			throws VersionControlException;

	public void submitArchetype(String archetypeName, User user)
			throws VersionControlException;

	public void submitArchetype(ArchetypeRevisionFile archetypeFile, User user)
			throws VersionControlException;

	public void approveArchetype(Integer archetypeId, User user)
			throws VersionControlException;

	public void approveArchetype(String archetypeName, User user)
			throws VersionControlException;

	public void approveArchetype(ArchetypeRevisionFile archetypeFile, User user)
			throws VersionControlException;

	public void rejectArchetype(Integer archetypeId, User user)
			throws VersionControlException;

	public void rejectArchetype(String archetypeName, User user)
			throws VersionControlException;

	public void rejectArchetype(ArchetypeRevisionFile archetypeFile, User user)
			throws VersionControlException;

	public void rejectAndRemoveArchetype(Integer archetypeId, User user)
			throws VersionControlException;

	public void rejectAndRemoveArchetype(String archetypeName, User user)
			throws VersionControlException;

	public void rejectAndRemoveArchetype(ArchetypeRevisionFile archetypeFile,
			User user) throws VersionControlException;

	void acceptArchetype(String archetype, User user) throws VersionControlException;
	
	public void fallbackArchetype(Integer archetypeId, User user)
			throws VersionControlException;

	public void fallbackArchetype(String archetypeName, User user)
			throws VersionControlException;

	public void fallbackArchetype(ArchetypeRevisionFile archetypeFile, User user)
			throws VersionControlException;

}