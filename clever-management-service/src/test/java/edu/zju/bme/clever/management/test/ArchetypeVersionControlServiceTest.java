package edu.zju.bme.clever.management.test;

import java.io.InputStream;

import javax.annotation.Resource;
import javax.transaction.Transactional;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.openehr.am.archetype.Archetype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;

import edu.zju.bme.clever.management.service.ArchetypeVersionControlService;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.repository.ArchetypeRevisionFileRepository;
import edu.zju.bme.clever.management.service.repository.UserRepository;
import se.acode.openehr.parser.ADLParser;
import se.acode.openehr.parser.ParseException;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:service-context.xml")
@Transactional
@TransactionConfiguration(defaultRollback = false)
public class ArchetypeVersionControlServiceTest {

	@Autowired
	private ArchetypeVersionControlService versionControlService;
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private ArchetypeRevisionFileRepository archetypeFileRepo;

	@Test
	public void test() throws ParseException, Exception {
		InputStream is = this
				.getClass()
				.getClassLoader()
				.getResourceAsStream(
						"edu/zju/bme/clever/cdr/adl/openEHR-EHR-INSTRUCTION.request-imaging_exam.v1.1.adl");
		ADLParser parser = new ADLParser(is, "UTF-8");
		Archetype archetype = parser.parse();

		User user = this.userRepo.findOne(1);

//		this.versionControlService.acceptArchetype(archetype, user);
		// this.versionControlService.editArchetype(archetype
		// user);
		// this.versionControlService.submitArchetype(archetype, user);
		// this.versionControlService.rejectAndRemoveArchetype(archetype, user);
	}
}
