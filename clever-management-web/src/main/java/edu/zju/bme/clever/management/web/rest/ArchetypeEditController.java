package edu.zju.bme.clever.management.web.rest;

import java.util.Map;

import org.openehr.am.archetype.Archetype;
import org.openehr.am.serialize.XMLSerializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import se.acode.openehr.parser.ADLParser;
import se.acode.openehr.parser.ParseException;
import edu.zju.bme.clever.management.service.ArchetypeEditService;
import edu.zju.bme.clever.management.service.entity.AdlInfo;
import edu.zju.bme.clever.management.web.entity.ArchetypeInfo;

@RestController
@RequestMapping("/archetypes/edit")
public class ArchetypeEditController {
//	@Autowired
//	private ArchetypeEditService editService;
//	private XMLSerializer xmlSerializer = new XMLSerializer();
//
//	@RequestMapping(value = "/save/id/{id}", method = RequestMethod.POST)
//	public ArchetypeInfo saveArchetype(@PathVariable Integer id, @RequestBody AdlInfo info) {
//		//System.out.println(id.toString());
//		//System.out.println(archetype.getArchetype());
//		String adl = info.getAdl();
//       
//		ArchetypeInfo archetypeInfo = new ArchetypeInfo();
//		ADLParser parser = new ADLParser(adl);
//		try {
//			Archetype arc = parser.parse();
//		
//		archetypeInfo.setAdl(adl);
//		//info.setXml(this.xmlSerializer.output(arc));
//		String xml = this.xmlSerializer.output(arc);
//		System.out.println(xml);
//	    archetypeInfo.setXml(xml);
//	  //  archetypeInfo.setConceptName(info.getConceptName());
//		
//		//editService.saveArchetype(id, archetype);
//		} catch (ParseException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} catch (Exception e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//        return archetypeInfo;
//	}
//	
//	@RequestMapping(value = "submit/id/{id}", method = RequestMethod.POST)
//	public void submitArchetype(@PathVariable Integer id, @RequestBody AdlInfo archetype ){
//		System.out.println(id.toString());
//		System.out.println(archetype.toString());
//		editService.submitArchetype(id ,archetype);
//	}
}