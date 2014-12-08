package edu.zju.bme.clever.management.web.rest;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/authentication")
public class AuthenticationController {

	@RequestMapping(method = RequestMethod.GET)
	public Map<String, String> getAuthentication(Authentication authentication) {
		Map<String, String> model = new HashMap<String, String>();
		model.put("isAuthenticated", "true");
		model.put("userName",
				((UserDetails) authentication.getPrincipal()).getUsername());
		return model;
	}
}
