package edu.zju.bme.clever.management.service;

import java.io.InputStream;

import openEHR.v1.template.TemplateDocument;
import edu.zju.bme.clever.management.service.entity.TemplateMaster;
import edu.zju.bme.clever.management.service.entity.TemplateRevisionFile;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.exception.VersionControlException;
import edu.zju.bme.clever.schemas.ArchetypeRelationshipMappingDocument;

public interface StorageTemplateVersionControlService {

	public void acceptNewTemplate(InputStream oet, InputStream arm, User user)
			throws VersionControlException;

	public void acceptNewTemplate(TemplateDocument oet,
			ArchetypeRelationshipMappingDocument arm, User user)
			throws VersionControlException;

	public TemplateMaster newMaster(String name, TemplateDocument oet,
			ArchetypeRelationshipMappingDocument arm)
			throws VersionControlException;

	public TemplateRevisionFile newRevisionFile(TemplateMaster master,
			TemplateDocument oet, ArchetypeRelationshipMappingDocument arm,
			User user) throws VersionControlException;

	public void editTemplate(Integer templateId, String oet, String arm,
			User user) throws VersionControlException;

	public void editTemplate(Integer templateId, InputStream oet,
			InputStream arm, User user) throws VersionControlException;

	public void editTemplate(String templateName, String oet, String arm,
			User user) throws VersionControlException;

	public void editTemplate(String templateName, InputStream oet,
			InputStream arm, User user) throws VersionControlException;

	public void editTemplate(TemplateRevisionFile templateFile,
			InputStream oet, InputStream arm, User user)
			throws VersionControlException;

	public void editTemplate(TemplateRevisionFile templateFile,
			TemplateDocument oet, ArchetypeRelationshipMappingDocument arm,
			User user) throws VersionControlException;

	public void submitTemplate(Integer templateId, User user)
			throws VersionControlException;

	public void submitTemplate(String templateName, User user)
			throws VersionControlException;

	public void submitTemplate(TemplateRevisionFile templateFile, User user)
			throws VersionControlException;

	public void approveTemplate(Integer templateId, User user)
			throws VersionControlException;

	public void approveTemplate(String templateName, User user)
			throws VersionControlException;

	public void approveTemplate(TemplateRevisionFile templateFile, User user)
			throws VersionControlException;

	public void rejectTemplate(Integer templateId, User user)
			throws VersionControlException;

	public void rejectTemplate(String templateName, User user)
			throws VersionControlException;

	public void rejectTemplate(TemplateRevisionFile templateFile, User user)
			throws VersionControlException;

	public void rejectAndRemoveTemplate(Integer templateId, User user)
			throws VersionControlException;

	public void rejectAndRemoveTemplate(String templateName, User user)
			throws VersionControlException;

	public void rejectAndRemoveTemplate(TemplateRevisionFile templateFile,
			User user) throws VersionControlException;

}