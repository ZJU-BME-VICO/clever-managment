package edu.zju.bme.clever.management.service;

import java.util.List;
import java.util.Set;

import edu.zju.bme.clever.management.service.entity.Authority;
import edu.zju.bme.clever.management.service.entity.Role;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.exception.ResourceNotFoundException;

public interface AuthorityManagementService {
	public void deployAuthorities();

	public List<Authority> getAllAuthorities();

	public Set<Role> getAllRoles();

	public Set<User> getAllUsers();

	public void addRole(String roleName,
			List<Integer> authoritieIds, String description)
			throws ResourceNotFoundException;

	public void addUser(String userName, String passworld, Boolean isEnabled,
			Integer roleId) throws ResourceNotFoundException;



	public void editRole(Integer id, String roleName,
			List<Integer> authoritiesId, String description)
			throws ResourceNotFoundException;

	public void deleteRole(Integer id) throws Exception;

	public void editUser(Integer id, String userName, String passworld,
			Boolean isEnabled, Integer roleId) throws ResourceNotFoundException;
	public void deleteUser(Integer id);
}
