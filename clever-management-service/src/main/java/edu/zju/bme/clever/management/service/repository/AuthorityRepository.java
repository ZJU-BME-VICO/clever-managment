package edu.zju.bme.clever.management.service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.zju.bme.clever.management.service.entity.Authority;

public interface AuthorityRepository extends JpaRepository<Authority, Integer> {
  
}
