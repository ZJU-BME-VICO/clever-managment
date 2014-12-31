package edu.zju.bme.clever.management.web.rest;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.ServletContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.zju.bme.clever.management.service.ApplicationService;
import edu.zju.bme.clever.management.service.entity.Application;
import edu.zju.bme.clever.management.service.exception.ApplicationPersistException;
import edu.zju.bme.clever.management.web.entity.FileUploadResult;

@RestController
@RequestMapping("/applications")
public class ApplicationResourceController {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ApplicationService applicationService;
	
	@Resource
	private ServletContext servletContext;

	private static final String APP_FOLDER_PATH = "/upload/app/";

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public List<Application> getAllApps() {
		return this.applicationService
				.getAllApplications()
				.stream()
				.sorted((app1, app2) -> Long.compare(app1.getDisplayOrder(),
						app2.getDisplayOrder())).collect(Collectors.toList());
	}

	@RequestMapping(value = "application/id/{id}", method = RequestMethod.GET)
	public Application getApplicationById(@PathVariable Integer id) {
		return this.applicationService.getApplicationById(id);
	}
	
	@RequestMapping(value = "application/id/{id}", method = RequestMethod.POST)
	@ResponseBody
	public FileUploadResult updateApplicationById(
			@PathVariable Integer id,
			@RequestParam(value = "img", required = false) MultipartFile img,
			@RequestParam(value = "name", required = true) String name,
			@RequestParam(value = "description", required = true) String description,
			@RequestParam(value = "url", required = true) String url) {
		FileUploadResult result = new FileUploadResult();
		result.setSucceeded(true);
		
		try {
			Application application = this.applicationService.getApplicationById(id);	
			if(application.getName().equals(name) == false){
				if(this.applicationService.getApplicationByName(name) != null){
					throw new Exception("Application " + name + " already exists.");
				}	
				File imgFile = new File(servletContext.getRealPath("/WEB-INF" + application.getImgPath()));
				imgFile.renameTo(new File(servletContext.getRealPath("/WEB-INF" + APP_FOLDER_PATH + name)));
				application.setName(name);
				application.setImgPath(APP_FOLDER_PATH + name); 
			}
			if (img != null) {
				img.transferTo(new File(servletContext.getRealPath("/WEB-INF" + application.getImgPath())));
			}
			application.setDescription(description);
			application.setUrl(url);
			this.applicationService.updateApplication(application);
		} catch (Exception ex) {
			result.setSucceeded(false);
			result.setMessage(ex.getMessage());
		}
		return result;
	}

	@RequestMapping(value = "/application/id/{id}", method = RequestMethod.DELETE)
	public void deleteApplicationById(@PathVariable Integer id) {
		Application application = applicationService.getApplicationById(id);
		File imgFile = new File(servletContext.getRealPath("/WEB-INF" + APP_FOLDER_PATH + application.getName()));
		imgFile.delete();
		this.applicationService.deleteApplication(application);
	}

	@RequestMapping(value = "/application", method = RequestMethod.POST)
	public FileUploadResult uploadNewApplication(
			@RequestParam(value = "img", required = true) MultipartFile img,
			@RequestParam(value = "name", required = true) String name,
			@RequestParam(value = "description", required = true) String description,
			@RequestParam(value = "url", required = true) String url) {
		FileUploadResult result = new FileUploadResult();
		result.setSucceeded(true);
		
		try {
			if (this.applicationService.getApplicationByName(name) != null) {
				throw new Exception("Application " + name + " already exists.");
			}
			String appFolderUrl = servletContext.getRealPath("/WEB-INF" + APP_FOLDER_PATH);
			File appFolder = new File(appFolderUrl);
			if (!appFolder.exists()) {
				appFolder.mkdir();
			}
			File imgFile = new File(appFolderUrl + "/" + name);
			img.transferTo(imgFile);
			this.applicationService
					.saveApplication(name, description, url, APP_FOLDER_PATH + name);
		} catch (Exception ex) {
			result.setSucceeded(false);
			result.setMessage(ex.getMessage());
		}
		return result;
	}

}
