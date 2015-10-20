package edu.zju.bme.clever.management.service;

import org.openehr.am.archetype.Archetype;
import org.openehr.am.serialize.ADLSerializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import se.acode.openehr.parser.ADLParser;
import edu.zju.bme.clever.management.service.entity.AdlInfo;

@Service
public class ArchetypeEditServiceImpl implements ArchetypeEditService{
	
	
    
	@Override
	public void saveArchetype(Integer id, AdlInfo info){
		System.out.println("come to service successfully");
		ADLParser parser = new ADLParser(info.getAdl());
		try {
			Archetype archetype = parser.parse();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		ADLSerializer serializer = new ADLSerializer();
		
	    //System.out.println(serializer.output())
		
	}
    @Override
	public void submitArchetype(Integer id, AdlInfo archetype){
		System.out.println("submit Archetype sucessfully");
		
	}
    
    ///private void
     
}
