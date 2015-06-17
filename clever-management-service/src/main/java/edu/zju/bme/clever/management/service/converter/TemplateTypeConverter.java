package edu.zju.bme.clever.management.service.converter;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import edu.zju.bme.clever.management.service.entity.TemplateType;

@Converter(autoApply = true)
public class TemplateTypeConverter extends
		AbstractStringEnumConverter<TemplateType> implements
		AttributeConverter<TemplateType, String> {

}
