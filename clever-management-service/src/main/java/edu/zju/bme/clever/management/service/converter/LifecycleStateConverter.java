package edu.zju.bme.clever.management.service.converter;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import edu.zju.bme.clever.management.service.entity.LifecycleState;

@Converter(autoApply = true)
public class LifecycleStateConverter extends
		AbstractStringEnumConverter<LifecycleState> implements AttributeConverter<LifecycleState, String> {
	
}
