package edu.zju.bme.clever.management.web.rest;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import edu.zju.bme.clever.management.web.entity.ArchetypeCreateInfo;

@RestController
@ManagedResource
@RequestMapping("/archetypes/edit")
public class ArchetypeEditController{
	//@Autowired
	//private ArchetypeEditService editService;
	
	
	@RequestMapping(value="/create",method = RequestMethod.POST)
	public Integer createArchetype(@RequestBody ArchetypeCreateInfo creatInfo){
		System.out.println("create a new archetype here");
		System.out.println(creatInfo);
		Integer i =12;
		return i;
	}
}