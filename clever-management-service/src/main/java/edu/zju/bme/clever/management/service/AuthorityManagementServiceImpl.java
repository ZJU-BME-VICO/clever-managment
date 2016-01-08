package edu.zju.bme.clever.management.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.zju.bme.clever.management.service.entity.Authority;
import edu.zju.bme.clever.management.service.entity.Role;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.exception.ResourceNotFoundException;
import edu.zju.bme.clever.management.service.repository.AuthorityRepository;
import edu.zju.bme.clever.management.service.repository.RoleRepository;
import edu.zju.bme.clever.management.service.repository.UserRepository;
import edu.zju.bme.clever.management.service.util.AuthorityEnum;

@Service
@Transactional
public class AuthorityManagementServiceImpl implements
		AuthorityManagementService {

	@Autowired
	private AuthorityRepository authorityRepo;
	@Autowired
	private RoleRepository roleRepo;

	@Autowired
	private UserRepository userRepo;

	@Override
	public void deployAuthorities() {
		List<Authority> existingAuths = authorityRepo.findAll();
		for (int i = 0; i < AuthorityEnum.values().length; i++) {
			String authorityName = AuthorityEnum.values()[i].toString();
			if (!alreadyExist(existingAuths, authorityName)) {
				Authority auth = new Authority();
				auth.setAuthorityName(authorityName);
				authorityRepo.save(auth);
			}
		}
	}

	private Boolean alreadyExist(List<Authority> authorities,
			String authorityName) {
		Boolean alreadyExist = false;
		for (int i = 0; i < authorities.size(); i++) {
			if (authorities.get(i).getAuthorityName().equals(authorityName)) {
				alreadyExist = true;
			}
		}
		return alreadyExist;
	}

	@Override
	public List<Authority> getAllAuthorities() {
		return this.authorityRepo.findAll();
	}

	@Override
	public Set<Role> getAllRoles() {
		return this.roleRepo.findAllFetchAll();
	}

	@Override
	public Set<User> getAllUsers() {
		return this.userRepo.findAllFetchAll();
	}

	@Override
	public void addRole(String roleName, List<Integer> authoritieIds,
			String description) throws ResourceNotFoundException {
		Role role = new Role();
		Set<Authority> authorities = new HashSet<Authority>();
		// authoritieIds.forEach(id -> {
		// authorities.add(this.authorityRepo.findOne(id));
		// });
		if (authoritieIds != null && !authoritieIds.isEmpty()) {
			for (int i = 0; i < authoritieIds.size(); i++) {
				Authority auth = this.authorityRepo.findOne(authoritieIds
						.get(i));
				if (auth == null) {
					throw new ResourceNotFoundException(
							"can not find authority with id "
									+ authoritieIds.get(i));
				} else {
					authorities.add(auth);
				}
			}
			role.setAuthorities(authorities);
		}

		role.setDescription(description);
		role.setRoleName(roleName);
		this.roleRepo.save(role);
	}

	@Override
	public void addUser(String userName, String password, Boolean isEnabled,
			Integer roleId) throws ResourceNotFoundException {
		Role role = this.roleRepo.findOne(roleId);
		User user = new User();
		if (role != null) {
			user.setRole(role);
		} else {
			throw new ResourceNotFoundException("can not find a role with id "
					+ roleId);
		}
		user.setEnabled(isEnabled);
		user.setName(userName);
		user.setPassword(password);
		this.userRepo.save(user);
	}

	@Override
	public void editRole(Integer id, String roleName,
			List<Integer> authoritiesId, String description)
			throws ResourceNotFoundException {
		Role role = this.roleRepo.findOne(id);
		nullCheck(role);
		role.setDescription(description);
		role.setRoleName(roleName);
		Set<Authority> authorities = new HashSet<Authority>();
		authoritiesId.forEach(authId -> {
			authorities.add(this.authorityRepo.findOne(authId));
		});
		role.setAuthorities(authorities);
		this.roleRepo.save(role);

	}

	@Override
	public void deleteRole(Integer id) throws Exception {
		List<User> users = this.userRepo.findByRoleId(id);
		if (users == null || users.isEmpty()) {
			this.roleRepo.delete(id);
		} else {
			throw new Exception(
					"you can not delete this role, because there are still "
							+ users.size()
							+ " users are mapping to this role. if you really want to delete this role, just delete the users or changer their role");
		}
	}

	@Override
	public void editUser(Integer id, String userName, String password,
			Boolean isEnabled, Integer roleId) throws ResourceNotFoundException {
		User user = this.userRepo.findOne(id);
		nullCheck(user);
		user.setEnabled(isEnabled);
		user.setName(userName);
		user.setPassword(password);
		Role role = this.roleRepo.findOne(roleId);
		nullCheck(role);
		user.setRole(role);
		this.userRepo.save(user);
	}

	@Override
	public void deleteUser(Integer id) {

		this.userRepo.delete(id);

	}

	private void nullCheck(Object obj) throws ResourceNotFoundException {
		if (obj == null) {
			throw new ResourceNotFoundException("can not find object"
					+ obj.toString());
		}
	}

}
