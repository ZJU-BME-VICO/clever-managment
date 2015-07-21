package edu.zju.bme.clever.management.service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.Application;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.TemplateMaster;
import edu.zju.bme.clever.management.service.entity.TemplateType;

public interface TemplateMasterRepository extends
		JpaRepository<TemplateMaster, Integer> {
	
	public TemplateMaster findByName(String name);
	
	public List<TemplateMaster> findByTemplateType(TemplateType type);
	
	@Query("select master from TemplateMaster master left join fetch master.revisionFiles file left join fetch file.properties where master.templateType = ?1")
	public List<TemplateMaster> findByTemplateTypeFetchRevisionFiles(TemplateType type);
	
	public List<TemplateMaster> findByTemplateTypeAndLatestRevisionFileLifecycleState(
			TemplateType templateType, LifecycleState lifecycleState);
}
