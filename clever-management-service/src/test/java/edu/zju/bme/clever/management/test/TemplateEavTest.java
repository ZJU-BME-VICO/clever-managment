package edu.zju.bme.clever.management.test;

import javax.transaction.Transactional;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;

import edu.zju.bme.clever.management.service.entity.TemplateFile;
import edu.zju.bme.clever.management.service.entity.TemplateMaster;
import edu.zju.bme.clever.management.service.repository.TemplateFileRepository;
import edu.zju.bme.clever.management.service.repository.TemplateMasterRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:service-context.xml")
@Transactional
@TransactionConfiguration(defaultRollback = false)
public class TemplateEavTest {

	@Autowired
	private TemplateFileRepository fileRepo;
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
		TemplateFile file = new TemplateFile();
		file.setMaster(master);
		file.getPropertyMap().put("abc", "ddd");
		this.fileRepo.save(file);
	}

	@Test
	public void updateTemplateFile() {
		TemplateFile file = this.fileRepo.findOne(4);
		System.out.println(file.getPropertyMap().get("abc"));
		file.getPropertyMap().remove("abc");
		this.fileRepo.save(file);
	}
}
