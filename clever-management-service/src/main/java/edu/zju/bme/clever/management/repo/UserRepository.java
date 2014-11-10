package edu.zju.bme.clever.management.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.zju.bme.clever.management.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

	public User findByUserName(String userName);
}
