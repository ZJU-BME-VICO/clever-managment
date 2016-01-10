package edu.zju.bme.clever.management.service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.zju.bme.clever.management.service.entity.Authority;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.repository.UserRepository;

@Service("userDetailsService")
@Transactional(rollbackFor = { Exception.class })
public class UserDetailsServiceImpl implements UserDetailsService {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private UserRepository userRepo;

	@Override
	public UserDetails loadUserByUsername(String userName)
			throws UsernameNotFoundException {

		User user = this.userRepo.findByName(userName);

		if (user == null) {
			throw new UsernameNotFoundException("User " + userName
					+ " does not exist.");
		}
		if (!user.isEnabled()) {
			throw new UsernameNotFoundException("User " + userName
					+ " is not enabled.");
		}

		Set<Authority> authorities = new HashSet<Authority>();

		// user.getRoles().forEach(role -> {
		// role.getAuthorities().forEach(authority -> {
		// authorities.add(authority);
		// });
		// });
		user.getRole().getAuthorities().forEach(authority -> {
			authorities.add(authority);
		});

		return new org.springframework.security.core.userdetails.User(
				user.getName(), user.getPassword(), user.isEnabled(), true,
				true, true, authorities
						.stream()
						.map(authority -> {
							return new SimpleGrantedAuthority(authority
									.getAuthorityName());
						}).collect(Collectors.toSet()));
	}
}
