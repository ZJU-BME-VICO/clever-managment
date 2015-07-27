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

	@Query("select file from TemplateRevisionFile file left join fetch file.editor left join fetch file.properties where file.templateType = ?1 and file.editor = ?2 and file.lifecycleState = ?3")
	public List<TemplateRevisionFile> findByTemplateTypeAndEditorAndLifecycleStateFetchAll(
			TemplateType templateType, User user, LifecycleState lifecycleState);

	@Query("select file from TemplateRevisionFile file left join fetch file.editor left join fetch file.properties where file.templateType = ?1 and file.lifecycleState = ?2")
	public List<TemplateRevisionFile> findByTemplateTypeAndLifecycleStateFetchAll(
			TemplateType templateType, LifecycleState lifecycleState);
}
