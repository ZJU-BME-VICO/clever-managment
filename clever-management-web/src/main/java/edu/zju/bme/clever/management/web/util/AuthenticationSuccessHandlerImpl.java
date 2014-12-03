package edu.zju.bme.clever.management.web.util;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component("authenticationSuccessHandler")
public class AuthenticationSuccessHandlerImpl implements
		AuthenticationSuccessHandler {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request,
			HttpServletResponse response, Authentication authentication)
			throws IOException, ServletException {
		String httpSessionId = request.getSession().getId();
		String userName = ((UserDetails) authentication.getPrincipal())
				.getUsername();
		this.logger.trace("User {} with session {} authenticates.", userName,
				httpSessionId);
		response.sendRedirect("/clever-management-web/");
		// response.getWriter().print("{\"succeeded\":\"true\"}");
	}

}
