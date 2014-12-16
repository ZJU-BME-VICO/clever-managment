package edu.zju.bme.clever.management.web.util;

import java.io.File;
import java.io.IOException;
import java.util.Calendar;
import java.util.Optional;

import javax.annotation.Resource;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.stereotype.Component;

import edu.zju.bme.clever.management.service.UserService;
import edu.zju.bme.clever.management.service.exception.UserNotFoundException;

public class LogoutSuccessHandlerImpl extends SimpleUrlLogoutSuccessHandler {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Resource
	private ServletContext servletContext;
	@Autowired
	private UserService userService;

	// Just for setting the default target URL
	public LogoutSuccessHandlerImpl(String defaultTargetURL) {
		this.setDefaultTargetUrl(defaultTargetURL);
	}

	@Override
	public void onLogoutSuccess(HttpServletRequest request,
			HttpServletResponse response, Authentication authentication)
			throws IOException, ServletException {

		String httpSessionId = request.getSession().getId();
		String userName = Optional.ofNullable(authentication).map(auth -> {
			return (UserDetails) auth.getPrincipal();
		}).map(user -> user.getUsername()).orElse(null);
		if (userName != null) {
			this.logger.trace("User {} with session {} authenticates.",
					userName, httpSessionId);

			// clear user temp folder when log out
			File userFolder = new File(
					servletContext.getRealPath("/WEB-INF/upload/temp") + "/"
							+ userName);
			if (userFolder.exists() && userFolder.isDirectory()) {
				for (File file : userFolder.listFiles()) {
					file.delete();
				}
				userFolder.delete();
			}
			try {
				this.userService.updateUserLogoutTime(userName,
						Calendar.getInstance());
			} catch (UserNotFoundException ex) {
				this.logger.error("Update logout time failed.", ex);
			}
		}
		super.onLogoutSuccess(request, response, authentication);
	}
}
