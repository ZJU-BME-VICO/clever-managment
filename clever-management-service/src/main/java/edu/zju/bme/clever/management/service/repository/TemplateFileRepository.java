package edu.zju.bme.clever.management.service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.TemplateFile;
import edu.zju.bme.clever.management.service.entity.User;

public interface TemplateFileRepository extends
		JpaRepository<TemplateFile, Integer> {

	public TemplateFile findByName(String name);

	public List<TemplateFile> findByLifecycleState(LifecycleState lifecycleState);

	@Query("from TemplateFile f "
			+ "where (f.lifecycleState = 'Draft' and f.editor = :user) "
			+ "or (f.lifecycleState = 'Published' and f.master.latestFile = f)")
	public List<TemplateFile> findToEdit(@Param("user") User user);
	
}
