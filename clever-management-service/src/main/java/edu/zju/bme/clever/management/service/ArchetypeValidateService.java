package edu.zju.bme.clever.management.service;

import java.util.Map;

import org.openehr.am.archetype.Archetype;

import edu.zju.bme.clever.management.service.entity.FileProcessResult;

public interface ArchetypeValidateService {

	public FileProcessResult validateConsistency(Archetype archetype);

}