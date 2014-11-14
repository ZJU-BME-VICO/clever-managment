package edu.zju.bme.clever.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.zju.bme.clever.management.entity.ArchetypeFile;

public interface ArchetypeFileRepository extends
		JpaRepository<ArchetypeFile, Integer> {

}
