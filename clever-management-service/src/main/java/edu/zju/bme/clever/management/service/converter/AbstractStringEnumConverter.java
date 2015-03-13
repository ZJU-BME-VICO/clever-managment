package edu.zju.bme.clever.management.service.converter;

import java.lang.reflect.ParameterizedType;
import java.util.EnumSet;

import javax.persistence.AttributeConverter;

import edu.zju.bme.clever.management.service.entity.StringValueEnum;

public class AbstractStringEnumConverter<E extends Enum<E> & StringValueEnum>
		implements AttributeConverter<E, String> {

	private Class<E> clazz;

	public AbstractStringEnumConverter() {
		ParameterizedType type = (ParameterizedType) this.getClass()
				.getGenericSuperclass();
		clazz = (Class<E>) type.getActualTypeArguments()[0];
	}

	@Override
	public String convertToDatabaseColumn(E attribute) {
		return attribute.getValue();
	}

	@Override
	public E convertToEntityAttribute(String dbData) {
		for (Enum en : EnumSet.allOf(clazz)) {
			if (((StringValueEnum) en).getValue().equals(dbData)) {
				return (E) en;
			}
		}
		return null;
	}
}
