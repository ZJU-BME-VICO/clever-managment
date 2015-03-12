package edu.zju.bme.clever.management.test;

import java.io.File;
import java.net.URL;

import javax.transaction.Transactional;

import openEHR.v1.template.TemplateDocument;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.openehr.am.template.OETParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;

import edu.zju.bme.clever.cdr.arm.parser.ArmParser;
import edu.zju.bme.clever.commons.archetype.ArchetypeLoader;
import edu.zju.bme.clever.management.service.StorageTemplateVersionControlService;
import edu.zju.bme.clever.management.service.entity.SourceType;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.exception.VersionControlException;
import edu.zju.bme.clever.management.service.repository.UserRepository;
import edu.zju.bme.clever.schemas.ArchetypeRelationshipMappingDocument;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:service-context.xml")
@Transactional
@TransactionConfiguration(defaultRollback = false)
public class StorageTemplateVersionControlServiceTest {
	@Autowired
	private StorageTemplateVersionControlService service;
	@Autowired
	private UserRepository uesrRepo;

	private TemplateDocument obsrvOet;
	private TemplateDocument requestOet;
	private ArchetypeRelationshipMappingDocument obsrvArm;
	private ArchetypeRelationshipMappingDocument requestArm;

	public StorageTemplateVersionControlServiceTest() throws Exception {
		URL url = this.getClass().getClassLoader()
				.getResource("edu/zju/bme/clever/cdr/adl");
		OETParser oetParser = new OETParser();
		ArmParser armParser = new ArmParser();

		obsrvOet = oetParser
				.parseTemplate(this
						.getClass()
						.getClassLoader()
						.getResourceAsStream(
								"edu/zju/bme/clever/cdr/oet/openEHR-EHR-OBSERVATION.imaging_exam-zju.v1.1.oet"));
		requestOet = oetParser
				.parseTemplate(this
						.getClass()
						.getClassLoader()
						.getResourceAsStream(
								"edu/zju/bme/clever/cdr/oet/openEHR-EHR-INSTRUCTION.request-imaging_exam.v1.1.oet"));
		obsrvArm = armParser
				.parseArm(this
						.getClass()
						.getClassLoader()
						.getResourceAsStream(
								"edu/zju/bme/clever/cdr/arm/openEHR-EHR-OBSERVATION.imaging_exam.v1.1.xml"));
		requestArm = armParser
				.parseArm(this
						.getClass()
						.getClassLoader()
						.getResourceAsStream(
								"edu/zju/bme/clever/cdr/arm/openEHR-EHR-INSTRUCTION.request-imaging_exam.v1.1.xml"));

	}

	// @Test
	public void create() throws VersionControlException {
		this.service.createOrUpgradeTemplate(obsrvOet, obsrvArm,
				SourceType.CLEVER, this.uesrRepo.findOne(1));
	}

	@Test
	public void submitAndApprove() throws VersionControlException {
		User user = this.uesrRepo.findOne(1);
		this.service.submitTemplate(
				"openEHR-EHR-OBSERVATION.imaging_exam-zju.v1.1", user);
		this.service.approveTemplate(
				"openEHR-EHR-OBSERVATION.imaging_exam-zju.v1.1", user);
	}
}
