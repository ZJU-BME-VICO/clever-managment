package edu.zju.bme.clever.management.web.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ArchetypeResourceController {
	
	@RequestMapping("/test")
	public String getIndex() {
		return "index";
	}
}
