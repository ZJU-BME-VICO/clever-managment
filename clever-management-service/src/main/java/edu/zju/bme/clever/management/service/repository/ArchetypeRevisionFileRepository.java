package edu.zju.bme.clever.management.service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.zju.bme.clever.management.service.entity.ArchetypeRevisionFile;
import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.User;

public interface ArchetypeRevisionFileRepository extends
		JpaRepository<ArchetypeRevisionFile, Integer> {
	public ArchetypeRevisionFile findByName(String name);
	
	public List<ArchetypeRevisionFile> findByLifecycleState(LifecycleState lifecycleState);
	
	public List<ArchetypeRevisionFile> findByEditorAndLifecycleState(User user, LifecycleState lifecycleState);
}
