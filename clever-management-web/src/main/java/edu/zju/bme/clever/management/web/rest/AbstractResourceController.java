package edu.zju.bme.clever.management.web.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import edu.zju.bme.clever.management.web.exception.ResourceNotFoundException;

public class AbstractResourceController {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	protected void isResourcesNull(Object obj) throws ResourceNotFoundException {
		if (obj == null) {
			throw new ResourceNotFoundException();
		}
	}
}
