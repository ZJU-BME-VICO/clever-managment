package edu.zju.bme.clever.management.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.Application;

public interface ApplicationRepository extends JpaRepository<Application, Integer> {
	
	public Application findByName(String name);
	
	@Query("select count(app) from Application app")
	public long getApplicationCount();
	
}
