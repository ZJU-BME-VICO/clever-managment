package edu.zju.bme.clever.management.web.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class PageController {

	@RequestMapping("/")
	public String getIndex() {
		return "index";
	}

	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public ModelAndView getLogInView(
			@RequestParam(value = "error", required = false) boolean error) {
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("error", error);
		return new ModelAndView("login", model);
	}
}
