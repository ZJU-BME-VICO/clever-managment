package edu.zju.bme.clever.management.service;

import edu.zju.bme.clever.management.service.entity.ArchetypeInfo;

public interface ArchetypeEditService {
  public void saveArchetype(Integer id, ArchetypeInfo archetype);
  
  public void submitArchetype(Integer id, ArchetypeInfo archetype);
}
