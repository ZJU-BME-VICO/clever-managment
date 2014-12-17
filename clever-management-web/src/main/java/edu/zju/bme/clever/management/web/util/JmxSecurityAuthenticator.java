package edu.zju.bme.clever.management.web.util;

import javax.annotation.Resource;
import javax.management.remote.JMXAuthenticator;
import javax.management.remote.JMXPrincipal;
import javax.security.auth.Subject;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import edu.zju.bme.clever.management.service.entity.AuthorityType;

@Component("jmxSecurityAuthenticator")
public class JmxSecurityAuthenticator implements JMXAuthenticator {

	@Resource(name = "authenticationManager")
	private AuthenticationManager authMgr;

	public Subject authenticate(Object credentials) {
		try {
			String[] info = (String[]) credentials;

			Authentication auth = authMgr
					.authenticate(new UsernamePasswordAuthenticationToken(
							info[0], info[1]));
			SimpleGrantedAuthority granted = new SimpleGrantedAuthority(
					AuthorityType.JmxManage.getValue());
			UserDetails user = (UserDetails) auth.getPrincipal();
			if (!user.getAuthorities().contains(granted)) {
				throw new SecurityException("User " + user.getUsername()
						+ " has no authority to connect JMX server.");
			}

			Subject subject = new Subject();
			subject.getPrincipals().add(new JMXPrincipal(auth.getName()));
			return subject;
			
		} catch (Exception ex) {
			throw new SecurityException(ex);
		}
	}
}
