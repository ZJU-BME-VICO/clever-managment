package edu.zju.bme.clever.management.web.rest;

import java.io.File;
import java.io.IOException;
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
import edu.zju.bme.clever.management.web.entity.FileUploadResult;

@RestController
@RequestMapping("/applications")
public class ApplicationResourceController {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ApplicationService applicationService;

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
			this.applicationService.updateApplication(id, name, description, url, img);
		} catch (Exception ex) {
			result.setSucceeded(false);
			result.setMessage(ex.getMessage());
		}
		return result;
	}

	@RequestMapping(value = "/application/id/{id}", method = RequestMethod.DELETE)
	public void deleteApplicationById(@PathVariable Integer id) {
		this.applicationService.deleteApplicationById(id);
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
			this.applicationService.saveApplication(name, description, url, img);
		} catch (Exception ex) {
			result.setSucceeded(false);
			result.setMessage(ex.getMessage());
		}
		return result;
	}

}
