package edu.zju.bme.clever.management.service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.Application;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.TemplateRevisionFile;
import edu.zju.bme.clever.management.service.entity.TemplateType;
import edu.zju.bme.clever.management.service.entity.User;

public interface TemplateRevisionFileRepository extends
		JpaRepository<TemplateRevisionFile, Integer> {

	public TemplateRevisionFile findByName(String name);

	public List<TemplateRevisionFile> findByLifecycleState(LifecycleState state);

	public List<TemplateRevisionFile> findByTemplateTypeAndLifecycleState(
			TemplateType type, LifecycleState state);

	public List<TemplateRevisionFile> findByTemplateTypeAndEditor(
			TemplateType type, User editor);
	
	public List<TemplateRevisionFile> findByTemplateTypeAndEditorAndLifecycleState(
			TemplateType templateType, User user, LifecycleState lifecycleState);

}
