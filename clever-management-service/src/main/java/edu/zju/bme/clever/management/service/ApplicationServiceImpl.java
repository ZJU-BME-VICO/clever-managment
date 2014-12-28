package edu.zju.bme.clever.management.service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;
import javax.servlet.ServletContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import edu.zju.bme.clever.management.service.entity.Application;
import edu.zju.bme.clever.management.service.exception.ApplicationPersistException;
import edu.zju.bme.clever.management.service.repository.ApplicationRepository;

@Service
@Transactional
public class ApplicationServiceImpl implements ApplicationService {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ApplicationRepository applicationRepo;
	
	@Resource
	private ServletContext servletContext;

	private static final String APP_FOLDER_PATH = "/upload/app/";

	@Override
	public List<Application> getAllApplications() {
		return this.applicationRepo.findAll();
	}

	@Override
	public void saveApplication(String name, String description, String url,
			MultipartFile img) throws ApplicationPersistException {
		if (this.applicationRepo.findByName(name) != null) {
			throw new ApplicationPersistException("Application " + name
					+ " already exists.");
		}
		String appFolderUrl = servletContext.getRealPath("/WEB-INF"
				+ APP_FOLDER_PATH);
		File appFolder = new File(appFolderUrl);
		if (!appFolder.exists()) {
			appFolder.mkdir();
		}
		File imgFile = new File(appFolderUrl + "/" + name);
		try {
			img.transferTo(imgFile);
		} catch (IllegalStateException | IOException ex) {
			this.logger.info("Save application {} img failed.", name, ex);
			throw new ApplicationPersistException("Save application " + name
					+ " img failed, error: " + ex.getMessage());
		}
		Application application = new Application();
		application.setName(name);
		application.setDescription(description);
		application.setUrl(url);
		application.setImgPath(APP_FOLDER_PATH + name);
		application
				.setDisplayOrder(this.applicationRepo.getApplicationCount() + 1);
		this.applicationRepo.save(application);
	}

	@Override
	public void updateApplication(Integer id, String name, String description,
			String url, MultipartFile img) throws ApplicationPersistException {
		Application application = this.applicationRepo.findOne(id);
		application.setDescription(description);
		application.setName(name);
		application.setUrl(url);
		if (img != null) {
			File oldImgFile = new File(
					servletContext.getRealPath("/WEB-INF"
							+ application.getImgPath()));
			oldImgFile.delete();
			File newImgFile = new File(
					servletContext.getRealPath("/WEB-INF" + APP_FOLDER_PATH
							+ name));
			try {
				img.transferTo(newImgFile);
			} catch (IllegalStateException | IOException ex) {
				this.logger.info("Update application {} img failed.", name, ex);
				throw new ApplicationPersistException("Update application " + name
						+ " img failed, error: " + ex.getMessage());
			}
			application.setImgPath(APP_FOLDER_PATH + name);
		}	
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
	public void deleteApplicationById(Integer id) {
		Application application = this.applicationRepo.findOne(id);
		File imgFile = new File(servletContext.getRealPath("/WEB-INF"
				+ APP_FOLDER_PATH + application.getName()));
		imgFile.delete();
		this.applicationRepo.delete(application);
	}
}
