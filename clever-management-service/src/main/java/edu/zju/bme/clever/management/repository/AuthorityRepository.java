package edu.zju.bme.clever.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.zju.bme.clever.management.entity.Authority;

public interface AuthorityRepository extends JpaRepository<Authority, Integer> {

}
