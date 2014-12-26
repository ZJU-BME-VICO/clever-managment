package edu.zju.bme.clever.management.service.util;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.cfg.ImprovedNamingStrategy;
import org.hibernate.internal.util.StringHelper;

public class CleverDatabaseNamingStrategy extends ImprovedNamingStrategy {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3028838018019433303L;

	private final static String TABLE_PREFIX = "t_";

	private final static Set<String> RESERVE_KEYWORDS = new HashSet<String>(
			Arrays.asList("use", "select", "where", "content"));

	@Override
	public String classToTableName(String className) {
		return tableName(super.classToTableName(className));
	}

	@Override
	public String propertyToColumnName(String propertyName) {
		String columnName = addUnderscores(StringHelper.unqualify(propertyName));
		if (RESERVE_KEYWORDS.contains(columnName)) {
			columnName = "[" + columnName + "]";
		}
		return columnName;
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
		return columnName.endsWith("_id") ? columnName : columnName + "_id";
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
