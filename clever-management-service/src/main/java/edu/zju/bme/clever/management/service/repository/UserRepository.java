package edu.zju.bme.clever.management.service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.zju.bme.clever.management.service.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

	public User findByName(String name);
	
	public List<User> findByIsEnabledTrue();
	
}
