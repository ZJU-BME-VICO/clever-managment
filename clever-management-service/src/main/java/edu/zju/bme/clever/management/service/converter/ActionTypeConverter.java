package edu.zju.bme.clever.management.service.converter;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import edu.zju.bme.clever.management.service.entity.ActionType;

@Converter(autoApply = true)
public class ActionTypeConverter extends
		AbstractStringEnumConverter<ActionType> implements
		AttributeConverter<ActionType, String> {

}
