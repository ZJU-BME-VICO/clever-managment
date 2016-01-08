package edu.zju.bme.clever.management.service.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {
	@Query("select role from Role role left join fetch role.authorities")
	public Set<Role> findAllFetchAll();
}
