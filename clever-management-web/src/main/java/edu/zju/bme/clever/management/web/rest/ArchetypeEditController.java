package edu.zju.bme.clever.management.web.rest;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import edu.zju.bme.clever.management.service.ArchetypeEditService;
import edu.zju.bme.clever.management.service.entity.ArchetypeInfo;

@RestController
@RequestMapping("/archetypes/edit")
public class ArchetypeEditController {
	@Autowired
	private ArchetypeEditService editService;

	@RequestMapping(value = "/save/id/{id}", method = RequestMethod.POST)
	public void saveArchetype(@PathVariable Integer id, @RequestBody ArchetypeInfo archetype) {
		System.out.println(id.toString());
		System.out.println(archetype.toString());
		editService.saveArchetype(id, archetype);

	}
	
	@RequestMapping(value = "submit/id/{id}", method = RequestMethod.POST)
	public void submitArchetype(@PathVariable Integer id, @RequestBody ArchetypeInfo archetype ){
		System.out.println(id.toString());
		System.out.println(archetype.toString());
		editService.submitArchetype(id ,archetype);
	}
}