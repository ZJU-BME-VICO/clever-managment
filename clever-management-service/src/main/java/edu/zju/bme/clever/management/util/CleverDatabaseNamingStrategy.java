package edu.zju.bme.clever.management.util;

import org.hibernate.cfg.ImprovedNamingStrategy;
import org.hibernate.internal.util.StringHelper;

public class CleverDatabaseNamingStrategy extends ImprovedNamingStrategy {

	private final static String TABLE_PREFIX = "t_";

	@Override
	public String classToTableName(String className) {
		return tableName(super.classToTableName(className));
	}

	@Override
	public String tableName(String tableName) {
		return tableName.toLowerCase().startsWith("t_") ? tableName
				.toLowerCase() : TABLE_PREFIX.concat(tableName.toLowerCase());
	}

	@Override
	public String foreignKeyColumnName(String propertyName,
			String propertyEntityName, String propertyTableName,
			String referencedColumnName) {
		String columnName = super.foreignKeyColumnName(propertyName,
				propertyEntityName, propertyTableName, referencedColumnName);
		return columnName.endsWith("_id") ? columnName
				: columnName + "_id";
	}

	@Override
	public String collectionTableName(String ownerEntity,
			String ownerEntityTable, String associatedEntity,
			String associatedEntityTable, String propertyName) {
		return tableName(new StringBuffer(ownerEntityTable)
				.append("_")
				.append(associatedEntityTable != null ? associatedEntityTable
						: StringHelper.unqualify(propertyName))
				.append("_mapping").toString());
	}
}
