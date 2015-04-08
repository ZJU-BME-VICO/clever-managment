package edu.zju.bme.clever.management.service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.zju.bme.clever.management.service.entity.ArchetypeFile;
import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.User;

public interface ArchetypeFileRepository extends
		JpaRepository<ArchetypeFile, Integer> {
	
	public ArchetypeFile findByName(String archetypeName);

	public List<ArchetypeFile> findByLifecycleState(LifecycleState lifecycleState); 
	
	public List<ArchetypeFile> findByLifecycleStateAndEditor(LifecycleState lifecycleState, User user);
}
