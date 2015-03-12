package edu.zju.bme.clever.management.service.converter;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.SourceType;

@Converter(autoApply = true)
public class SourceTypeConverter extends
		AbstractStringEnumConverter<SourceType> implements
		AttributeConverter<SourceType, String> {

}
