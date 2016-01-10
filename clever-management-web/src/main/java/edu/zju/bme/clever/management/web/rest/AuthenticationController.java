package edu.zju.bme.clever.management.web.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import edu.zju.bme.clever.management.web.entity.UserInfo;

@RestController
@RequestMapping("/authentication")
public class AuthenticationController extends AbstractResourceController {

	@RequestMapping(method = RequestMethod.GET)
	public UserInfo getAuthentication(Authentication authentication) {
		UserInfo info = new UserInfo();
		info.setIsAuthenticated(true);
		info.setUserName(((UserDetails) authentication.getPrincipal())
				.getUsername());
		List<String> authorities = authentication.getAuthorities().stream()
				.map(authority -> {
					return authority.getAuthority().toString();
				}).collect(Collectors.toList());
		info.setAuthorities(authorities);
		return info;
		// Map<String, String> model = new HashMap<String, String>();
		// model.put("isAuthenticated", "true");
		// model.put("userName",
		// ((UserDetails) authentication.getPrincipal()).getUsername());
		// return model;
	}
}
