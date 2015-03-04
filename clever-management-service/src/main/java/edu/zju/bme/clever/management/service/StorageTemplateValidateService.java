package edu.zju.bme.clever.management.service;

import java.io.InputStream;

import openEHR.v1.template.TemplateDocument;
import edu.zju.bme.clever.management.service.entity.FileProcessResult;
import edu.zju.bme.clever.schemas.ArchetypeRelationshipMappingDocument;

public interface StorageTemplateValidateService {

	public FileProcessResult validateConsistency(InputStream oet,
			InputStream arm);

	public FileProcessResult validateConsistency(TemplateDocument oet,
			ArchetypeRelationshipMappingDocument arm);

}