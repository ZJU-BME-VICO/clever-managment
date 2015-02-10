package edu.zju.bme.clever.management.test;

import java.util.HashMap;
import java.util.Map;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.openehr.am.archetype.Archetype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import edu.zju.bme.clever.commons.archetype.ArchetypeLoader;
import edu.zju.bme.clever.management.service.ArchetypeValidateService;
import edu.zju.bme.clever.management.service.entity.FileProcessResult;
import edu.zju.bme.clever.management.service.entity.FileProcessResult.FileStatus;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:service-context.xml")
public class ArchetypeValidateServiceTest {

	@Autowired
	private ArchetypeValidateService archetypeValidateService;

	@Test
	public void test() {
		Map<String, FileProcessResult> results = new HashMap<String, FileProcessResult>();
		Map<String, Archetype> archetypes = ArchetypeLoader
				.loadArchetypesFromDirectory("C:\\Projects\\archetype\\archetype");
		archetypes.forEach((id, archetype) -> {
			FileProcessResult result = new FileProcessResult();
			result.setStatus(FileProcessResult.FileStatus.VALID);
			result.setName(id);
			results.put(id, result);
		});
		archetypeValidateService.validateConsistency(archetypes, results);
		results.forEach((name, result) -> {
			if (result.getStatus().equals(FileStatus.VALID)) {
				System.out.println(name + ": " + result.getMessage());
			}
		});
	}

}
