package edu.zju.bme.clever.management.service;

import java.net.MalformedURLException;

import org.dom4j.DocumentException;

import edu.zju.bme.clever.management.service.exception.ApiParseException;

public interface ApiInfoParseService  {
	public void parseWadl(String url, String apiMasterName)
			throws ApiParseException, MalformedURLException, DocumentException,  Exception ; 
   public void parseWsdl(String url);
}
