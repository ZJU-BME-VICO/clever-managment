package edu.zju.bme.clever.management.service.converter;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import edu.zju.bme.clever.management.service.entity.EntityRelationshipType;
import edu.zju.bme.clever.management.service.entity.TemplateType;

@Converter(autoApply = true)
public class EntityRelationshipTypeConverter extends
		AbstractStringEnumConverter<EntityRelationshipType> implements
		AttributeConverter<EntityRelationshipType, String> {

}
