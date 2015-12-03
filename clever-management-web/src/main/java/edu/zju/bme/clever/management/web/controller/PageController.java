package edu.zju.bme.clever.management.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class PageController {
	@RequestMapping("/")
	public String getIndex() {
		return "index";	
	}
}
