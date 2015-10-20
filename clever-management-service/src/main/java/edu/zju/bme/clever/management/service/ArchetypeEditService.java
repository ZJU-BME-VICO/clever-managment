package edu.zju.bme.clever.management.service;

import edu.zju.bme.clever.management.service.entity.AdlInfo;

public interface ArchetypeEditService {
  public void saveArchetype(Integer id, AdlInfo archetype);
  
  public void submitArchetype(Integer id, AdlInfo archetype);
}
