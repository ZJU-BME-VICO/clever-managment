package edu.zju.bme.clever.management.service.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import edu.zju.bme.clever.management.service.exception.VersionControlException;

public class CleverUtils {

	private final static Pattern PATTERN = Pattern
			.compile("(.+\\.v\\d+)\\..+$");

	public static String extractVersionMasterName(String name) {
		Matcher matcher = PATTERN.matcher(name);
		String versionMasterName = null;
		if (matcher.find()) {
			versionMasterName = matcher.group(1);
		}
		return versionMasterName;
	}
}
