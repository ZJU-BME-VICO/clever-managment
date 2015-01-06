package edu.zju.bme.clever.management.service;

import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;

import org.hibernate.loader.custom.Return;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.zju.bme.clever.management.service.entity.Application;
import edu.zju.bme.clever.management.service.exception.ApplicationPersistException;
import edu.zju.bme.clever.management.service.repository.ApplicationRepository;

@Service
@Transactional
public class ApplicationServiceImpl implements ApplicationService {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ApplicationRepository applicationRepo;

	@Override
	public List<Application> getAllApplications() {
		return this.applicationRepo.findAll();
	}

	@Override
	public void saveApplication(String name, String description, String url,
			String imgPath) throws ApplicationPersistException {
		
		Application application = new Application();
		application.setName(name);
		application.setDescription(description);
		application.setUrl(url);
		application.setImgPath(imgPath);
		application
				.setDisplayOrder(this.applicationRepo.getApplicationCount() + 1);
		this.applicationRepo.save(application);
	}

	@Override
	public void updateApplication(Integer id, String name, String description,
			String url, String imgPath) throws ApplicationPersistException {
		Application application = this.applicationRepo.findOne(id);
		application.setName(name);
		application.setDescription(description);
		application.setUrl(url);
		application.setImgPath(imgPath);
		this.applicationRepo.save(application);
	}

	@Override
	public void updateApplication(Application application)
			throws ApplicationPersistException {
		this.applicationRepo.save(application);
	}

	@Override
	public Application getApplicationById(Integer id) {
		return this.applicationRepo.findOne(id);
	}
	
	@Override
	public Application getApplicationByName(String name) {
		return this.applicationRepo.findByName(name);
	}

	@Override
	public void deleteApplicationById(Integer id) {
		Application application = this.applicationRepo.findOne(id);
		this.applicationRepo.delete(application);
	}

	@Override
	public void deleteApplication(Application application) {
		this.applicationRepo.delete(application);
	}
}
