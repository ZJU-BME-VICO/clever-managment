package edu.zju.bme.clever.management.service.converter;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import edu.zju.bme.clever.management.service.entity.AuthorityType;

@Converter(autoApply = true)
public class AuthorityTypeConverter extends
		AbstractStringEnumConverter<AuthorityType> implements
		AttributeConverter<AuthorityType, String> {

}
