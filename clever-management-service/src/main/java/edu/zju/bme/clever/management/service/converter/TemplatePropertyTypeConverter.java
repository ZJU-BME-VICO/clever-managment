package edu.zju.bme.clever.management.service.converter;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import edu.zju.bme.clever.management.service.entity.TemplatePropertyType;

@Converter(autoApply = true)
public class TemplatePropertyTypeConverter extends
		AbstractStringEnumConverter<TemplatePropertyType> implements
		AttributeConverter<TemplatePropertyType, String> {

}
