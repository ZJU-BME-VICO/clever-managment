package edu.zju.bme.clever.management.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.zju.bme.clever.management.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {

}
