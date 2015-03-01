package edu.zju.bme.clever.management.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import edu.zju.bme.clever.management.service.TemplateProviderService;

@RestController
@RequestMapping("/templates")
public class TemplateResourceController {
	@Autowired
	private TemplateProviderService templateProviderService;

	@RequestMapping(value = "/id/{id}/oet", method = RequestMethod.GET)
	public String getTemplateOetById(@PathVariable int id) {
		return this.templateProviderService.getTemplateOetById(id);
	}

	@RequestMapping(value = "/id/{id}/arm", method = RequestMethod.GET)
	public String getTemplateArmById(@PathVariable int id) {
		return this.templateProviderService.getTemplateArmById(id);
	}

	@RequestMapping(value = "/name/{name}/oet", method = RequestMethod.GET)
	public String getTemplateOetByName(@PathVariable String name) {
		return this.templateProviderService.getTemplateOetByName(name);
	}

	@RequestMapping(value = "/name/{name}/arm", method = RequestMethod.GET)
	public String getTemplateArmByName(@PathVariable String name) {
		return this.templateProviderService.getTemplateArmByName(name);
	}

}
