package edu.zju.bme.clever.management.service.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.zju.bme.clever.management.service.entity.ClassAttribute;

public interface ClassAttributeRepository extends
		JpaRepository<ClassAttribute, Integer> {
	public ClassAttribute findById(Integer id);
}
