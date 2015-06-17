package edu.zju.bme.clever.management.test;

import javax.transaction.Transactional;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;

import edu.zju.bme.clever.management.service.entity.TemplateMaster;
import edu.zju.bme.clever.management.service.entity.TemplatePropertyType;
import edu.zju.bme.clever.management.service.entity.TemplateRevisionFile;
import edu.zju.bme.clever.management.service.repository.TemplateMasterRepository;
import edu.zju.bme.clever.management.service.repository.TemplateRevisionFileRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:service-context.xml")
@Transactional
@TransactionConfiguration(defaultRollback = false)
public class TemplateEavTest {

	@Autowired
	private TemplateRevisionFileRepository fileRepo;
	@Autowired
	private TemplateMasterRepository masterRepo;

	@Test
	public void addTemplateMaster() {
		TemplateMaster master = new TemplateMaster();
		this.masterRepo.save(master);
	}

	@Test
	public void addTemplateFile() {
		TemplateMaster master = this.masterRepo.findOne(2);
		TemplateRevisionFile file = new TemplateRevisionFile();
		file.setTemplateMaster(master);
		file.getPropertyMap().put(TemplatePropertyType.ARM, "ddd");
		this.fileRepo.save(file);
	}

	@Test
	public void updateTemplateFile() {
		TemplateRevisionFile file = this.fileRepo.findOne(4);
		System.out.println(file.getPropertyMap().get("abc"));
		file.getPropertyMap().remove("abc");
		this.fileRepo.save(file);
	}
}
