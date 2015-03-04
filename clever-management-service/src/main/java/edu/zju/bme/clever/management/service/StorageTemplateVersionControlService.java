package edu.zju.bme.clever.management.service;

import java.io.InputStream;

import openEHR.v1.template.TemplateDocument;
import edu.zju.bme.clever.management.service.entity.TemplateFile;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.entity.AbstractFile.SourceType;
import edu.zju.bme.clever.management.service.exception.VersionControlException;
import edu.zju.bme.clever.schemas.ArchetypeRelationshipMappingDocument;

public interface StorageTemplateVersionControlService {

	public void createOrUpgradeTemplate(String oet, String arm,
			SourceType source, User user) throws VersionControlException;

	public void createOrUpgradeTemplate(InputStream oet, InputStream arm,
			SourceType source, User user) throws VersionControlException;

	public void createOrUpgradeTemplate(TemplateDocument oet,
			ArchetypeRelationshipMappingDocument arm, SourceType source,
			User user) throws VersionControlException;

	public void editTemplate(Integer templateId, String oet, String arm,
			User user) throws VersionControlException;

	public void editTemplate(String templateName, String oet, String arm,
			User user) throws VersionControlException;

	public void editTemplate(String templateName, InputStream oet,
			InputStream arm, User user) throws VersionControlException;

	public void editTemplate(Integer templateId, InputStream oet,
			InputStream arm, User user) throws VersionControlException;

	public void editTemplate(TemplateFile templateFile, InputStream oet,
			InputStream arm, User user) throws VersionControlException;

	public void editTemplate(TemplateFile templateFile, TemplateDocument oet,
			ArchetypeRelationshipMappingDocument arm, User user)
			throws VersionControlException;

	public void submitTemplate(Integer templateId, User user)
			throws VersionControlException;

	public void submitTemplate(String templateName, User user)
			throws VersionControlException;

	public void submitTemplate(TemplateFile templateFile, User user)
			throws VersionControlException;

	public void approveTemplate(Integer templateId, User user)
			throws VersionControlException;

	public void approveTemplate(String templateName, User user)
			throws VersionControlException;

	public void approveTemplate(TemplateFile templateFile, User user)
			throws VersionControlException;

	public void rejectTemplate(Integer templateId, User user)
			throws VersionControlException;

	public void rejectTemplate(String templateName, User user)
			throws VersionControlException;

	public void rejectTemplate(TemplateFile templateFile, User user)
			throws VersionControlException;

	public void rejectAndRemoveTemplate(Integer templateId, User user)
			throws VersionControlException;

	public void rejectAndRemoveTemplate(String templateName, User user)
			throws VersionControlException;

	public void rejectAndRemoveTemplate(TemplateFile templateFile, User user)
			throws VersionControlException;

}