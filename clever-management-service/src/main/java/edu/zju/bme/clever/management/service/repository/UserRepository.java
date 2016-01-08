package edu.zju.bme.clever.management.service.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {
 
	public List<User> findByRoleId(Integer id);
	
	public User findByName(String name);

	public List<User> findByIsEnabledTrue();

	@Query("select user from User user left join fetch user.role role left join fetch role.authorities")
	public Set<User> findAllFetchAll();

}
