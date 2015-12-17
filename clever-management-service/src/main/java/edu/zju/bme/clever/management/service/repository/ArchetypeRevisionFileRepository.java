package edu.zju.bme.clever.management.service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.ArchetypeRevisionFile;
import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.User;

public interface ArchetypeRevisionFileRepository extends
		JpaRepository<ArchetypeRevisionFile, Integer> {
	public ArchetypeRevisionFile findByName(String name);
	
	public List<ArchetypeRevisionFile> findBySpecialiseArchetypeRevisionFileId(Integer id);
	
	public List<ArchetypeRevisionFile> findByLifecycleState(LifecycleState lifecycleState);
	
    //@Query("from ArchetypeRevisionFile file left join fetch file.specialiseArchetypeRevisionFile")
	
	public List<ArchetypeRevisionFile> findByEditorAndLifecycleState(User user, LifecycleState lifecycleState);
	
	@Query("select file from ArchetypeRevisionFile file left join fetch file.editor  left join fetch file.specialiseArchetypeRevisionFile  left join fetch file.versionMaster where file.editor = ?1 and file.lifecycleState= ?2")
	public List<ArchetypeRevisionFile> findByEditorAndLifecycleStateFetchAll(User user, LifecycleState lifecycleState);
}
