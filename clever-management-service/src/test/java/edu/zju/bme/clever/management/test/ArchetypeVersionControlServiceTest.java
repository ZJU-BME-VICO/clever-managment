package edu.zju.bme.clever.management.test;

import static org.junit.Assert.fail;

import java.io.InputStream;

import javax.transaction.Transactional;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.openehr.am.archetype.Archetype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;

import se.acode.openehr.parser.ADLParser;
import se.acode.openehr.parser.ParseException;
import edu.zju.bme.clever.commons.util.WordUtils;
import edu.zju.bme.clever.management.service.ArchetypeVersionControlService;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.entity.ArchetypeRevisionFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeVersionMaster;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.repository.ArchetypeMasterRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeRevisionFileRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeVersionMasterRepository;
import edu.zju.bme.clever.management.service.repository.UserRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:service-context.xml")
@Transactional
@TransactionConfiguration(defaultRollback = true)
public class ArchetypeVersionControlServiceTest {

	@Autowired
	private ArchetypeVersionControlService versionControlService;
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private ArchetypeRevisionFileRepository archetypeFileRepo;
	@Autowired
	private ArchetypeMasterRepository masterRepo;
	@Autowired
	private ArchetypeVersionMasterRepository archetypeVersionMasterRepo;

	@Test
	public void test() throws ParseException, Exception {
		InputStream is1 = this
				.getClass()
				.getClassLoader()
				.getResourceAsStream(
						"edu/zju/bme/clever/cdr/adl/openEHR-EHR-OBSERVATION.imaging_exam.v1.1.adl");
		ADLParser parser1 = new ADLParser(is1, "UTF-8");
		Archetype archetype1 = parser1.parse();
		
//		InputStream is2 = this
//				.getClass()
//				.getClassLoader()
//				.getResourceAsStream(
//						"edu/zju/bme/clever/cdr/adl/openEHR-EHR-INSTRUCTION.request-imaging_exam.v1.1.adl");
//		ADLParser parser2 = new ADLParser(is2, "UTF-8");
//		Archetype archetype2 = parser2.parse();

		User user = this.userRepo.findOne(1);

		try {
			this.versionControlService.acceptNewArchetype(archetype1, user);
		} catch (Exception ex) {
			System.out.println("Exception1------>>>>>>" + ex.toString());
		}
		try{
			ArchetypeRevisionFile file1 = archetypeFileRepo.findByName(archetype1.getArchetypeId().getValue());
			System.out.println("archetype1 name>>>>>>>>>>>>>>>>" + file1.getName());
			
			ArchetypeVersionMaster versionMaster1 = archetypeVersionMasterRepo.
					findByName(WordUtils.extractVersionMasterName(archetype1.getArchetypeId().getValue()));
			System.out.println("version master1 >>>>>>>> " + versionMaster1.getName());
			
			ArchetypeMaster master1 = masterRepo.findByName(archetype1.getArchetypeId().base());
			System.out.println("master1 name >>>>>>>>>>>" + master1.getName());
		}catch(Exception ex){
			System.out.println("archetype1 find exception>>>>>>>>>>" + ex.toString());
		}
		
//		try {
//			this.versionControlService.acceptNewArchetype(archetype2, user);
//		} catch (Exception ex) {
//			System.out.println("Exception2------>>>>>>" + ex.toString());
//		}
//		try{
//			ArchetypeRevisionFile file2 = archetypeFileRepo.findByName(archetype2.getArchetypeId().getValue());
//			System.out.println("archetype2 name>>>>>>>>>>>>>>>>" + file2.getName());
//			
//			ArchetypeVersionMaster versionMaster2 = archetypeVersionMasterRepo.
//					findByName(WordUtils.extractVersionMasterName(archetype2.getArchetypeId().getValue()));
//			System.out.println("version master2 >>>>>>>> " + versionMaster2.getName());
//			
//			ArchetypeMaster master2 = masterRepo.findByName(archetype2.getArchetypeId().base());
//			System.out.println("master2 name >>>>>>>>>>>" + master2.getName());
//		}catch(Exception ex){
//			System.out.println("archetype2 find exception>>>>>>>>>>" + ex.toString());
//		}
		
		// this.versionControlService.editArchetype(archetype
		// user);
		// this.versionControlService.submitArchetype(archetype, user);
		// this.versionControlService.rejectAndRemoveArchetype(archetype, user);
	}
}
