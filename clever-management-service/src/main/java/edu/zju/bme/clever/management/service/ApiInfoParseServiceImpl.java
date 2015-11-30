package edu.zju.bme.clever.management.service;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.measure.quantity.Energy;
import javax.xml.namespace.QName;

import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.java.dev.wadl.x2009.x02.ApplicationDocument;
import net.java.dev.wadl.x2009.x02.ApplicationDocument.Application;
import net.java.dev.wadl.x2009.x02.GrammarsDocument.Grammars;
import net.java.dev.wadl.x2009.x02.IncludeDocument.Include;
import net.java.dev.wadl.x2009.x02.MethodDocument.Method;
import net.java.dev.wadl.x2009.x02.ParamDocument.Param;
import net.java.dev.wadl.x2009.x02.RepresentationDocument.Representation;
import net.java.dev.wadl.x2009.x02.RequestDocument.Request;
import net.java.dev.wadl.x2009.x02.ResourceDocument.Resource;
import net.java.dev.wadl.x2009.x02.ResourcesDocument.Resources;
import net.java.dev.wadl.x2009.x02.ResponseDocument.Response;
import clever.wadl_parser.WadlParser;
import edu.zju.bme.clever.management.service.entity.AbstractParam;
import edu.zju.bme.clever.management.service.entity.ApiInformation;
import edu.zju.bme.clever.management.service.entity.ApiMaster;
import edu.zju.bme.clever.management.service.entity.ApiMediaType;
import edu.zju.bme.clever.management.service.entity.ApiRootUrlMaster;
import edu.zju.bme.clever.management.service.entity.ApiVersionMaster;
import edu.zju.bme.clever.management.service.entity.RequestParam;
import edu.zju.bme.clever.management.service.entity.ReturnParam;
import edu.zju.bme.clever.management.service.exception.ApiParseException;
import edu.zju.bme.clever.management.service.repository.ApiMasterRepository;
import edu.zju.bme.clever.management.service.repository.ApiVersionMasterRepository;

@Service
@Transactional
public class ApiInfoParseServiceImpl implements ApiInfoParseService {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	@Autowired
	private ApiMasterRepository apiMasterRepo;

	@Autowired
	private ApiVersionMasterRepository apiVersionMasterRepo;

	private WadlParser wadlParser = new WadlParser();

	private Map<String, List<InnerParam>> typeParamsMap = new HashMap<String, List<InnerParam>>();
	private Map<String, String> entityTypeMap = new HashMap<String, String>();

	@Override
	public void parseWadl(String url, String apiMasterName) throws Exception {
		InputStream in = getUrlContent(url);
		ApplicationDocument applicationDoc = null;

		applicationDoc = wadlParser.parseWadl(in);

		if (applicationDoc != null) {
			parseParam(new URL(getParamUrl(applicationDoc, url)));
			persistWadlModel(applicationDoc, apiMasterName);
		}
	}

	@Override
	public void parseWsdl(String url) {

	}

	// entity create
	private ApiMaster createApiMaster(String name) {
		ApiMaster apiMaster = new ApiMaster();
		apiMaster.setName(name);
		return apiMaster;
	}

	private ApiVersionMaster createApiVersionMaster() {
		ApiVersionMaster apiVersionMaster = new ApiVersionMaster();
		apiVersionMaster.setVersion(1);
		return apiVersionMaster;

	}

	private Integer versionControl(Integer oldVersion) {
		return oldVersion + 1;
	}

	private void persistWadlModel(ApplicationDocument doc, String apiMasterName)
			throws ApiParseException {
		// ApiMasterRepository repo = this.apiMasterRepo;
		// if (repo == null) {
		// System.out.println("respo is a null pointer");
		// }
		ApiMaster apiMaster = this.apiMasterRepo.findByName(apiMasterName);
		// ApiMaster apiMaster = new ApiMaster();
		ApiVersionMaster versionMaster = new ApiVersionMaster();
		if (apiMaster == null) {// there is no a apimaster in repository
			apiMaster = createApiMaster(apiMasterName);
		}

		Set<ApiVersionMaster> versionMasterSet = apiMaster.getVersionMasters();
		if (versionMasterSet == null) {
			versionMasterSet = new HashSet<ApiVersionMaster>();
		}
		if (!versionMasterSet.isEmpty()) {
			versionMaster.setVersion(versionControl(apiMaster
					.getLatestVersionMaster().getVersion()));
		} else {
			versionMaster = createApiVersionMaster();
		}
		ApiVersionMaster latestVersionMaster = apiMaster.getLatestVersionMaster();
		if(latestVersionMaster!=null){
		   versionMaster.setLastVersionMaster(latestVersionMaster);
		   latestVersionMaster.setNextVersionMaster(versionMaster);
		}else{
			
			//latestVersionMaster = null;
		}

		Application app = doc.getApplication();

		List<Resources> resourcesList = Arrays.asList(app.getResourcesArray());
		Set<ApiRootUrlMaster> urlMasterSet = new HashSet<ApiRootUrlMaster>();

		if (resourcesList != null) {
			for (Resources resources : resourcesList) {
				urlMasterSet.addAll(processResources(resources, versionMaster));
			}
			;
		}
		if (!urlMasterSet.isEmpty()) {
			versionMaster.setApiMaster(apiMaster);
			versionMaster.setApiRootUrlMasters(urlMasterSet);
			apiVersionMasterRepo.save(versionMaster);
			apiMaster.setLatestVersionMaster(versionMaster);
			if (apiMaster.getVersionMasters() != null) {
				apiMaster.getVersionMasters().add(versionMaster);
			} else {
				Set<ApiVersionMaster> temp = new HashSet<ApiVersionMaster>();
				temp.add(versionMaster);
				apiMaster.setVersionMasters(temp);
			}
			this.apiMasterRepo.save(apiMaster);
		} else {
			throw new ApiParseException(
					"can not get api information from this wadl file");
		}
	}

	private List<ApiRootUrlMaster> processResources(Resources resources,
			ApiVersionMaster versionMaster) {

		String baseUrl = resources.getBase();
		List<Resource> resourceList = Arrays.asList(resources
				.getResourceArray());
		List<ApiRootUrlMaster> urlMasterList = new ArrayList<ApiRootUrlMaster>();
		if (resourceList != null) {
			urlMasterList = resourceList.stream().map(resource -> {
				ApiRootUrlMaster urlMaster = null;
				try {
					urlMaster = processRootResource(resource, baseUrl);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				urlMaster.setApiVersionMaster(versionMaster);
				return urlMaster;
			}).collect(Collectors.toList());
		}

		if (!urlMasterList.isEmpty()) {
			return urlMasterList;
		} else {
			return null;
		}
	}

	private ApiRootUrlMaster processRootResource(Resource resource,
			String parentUrl) throws ApiParseException {
		ApiRootUrlMaster master = new ApiRootUrlMaster();
		String name = resource.getPath();
		master.setName(name);
		List<Method> methodList = Arrays.asList(resource.getMethodArray());
		Set<ApiInformation> apiInfoSet = processMethodList(methodList,
				parentUrl + resource.getPath(), master);

		List<Resource> resourceList = Arrays
				.asList(resource.getResourceArray());
		if (resourceList != null && !resourceList.isEmpty()) {
			resourceList.forEach(aresource -> {
				try {
					apiInfoSet.addAll(processResource(aresource, parentUrl
							+ resource.getPath(), master));
				} catch (Exception e) {
					// TODO Auto-generated catch block
					this.logger.info("provess resource failed :"
							+ e.getMessage());
					e.printStackTrace();
				}
			});
		}
		master.setApiInformations(apiInfoSet);
		return master;
	}

	private Set<ApiInformation> processResource(Resource resource,
			String parentUrl, ApiRootUrlMaster apiRootUrlMaster)
			throws ApiParseException {
		List<Method> methodList = Arrays.asList(resource.getMethodArray());
		Set<ApiInformation> apiInfoSet = processMethodList(methodList,
				parentUrl + resource.getPath(), apiRootUrlMaster);
		List<Resource> resourceList = Arrays
				.asList(resource.getResourceArray());
		if (resourceList != null && !resourceList.isEmpty()) {
			resourceList.forEach(aresource -> {
				try {
					apiInfoSet.addAll(processResource(aresource, parentUrl
							+ resource.getPath(), apiRootUrlMaster));
				} catch (Exception e) {
					this.logger.info("provess resource failed :"
							+ e.getMessage());
					e.printStackTrace();
				}
			});
		}
		return apiInfoSet;
	}

	private Set<ApiInformation> processMethodList(List<Method> methodList,
			String parentUrl, ApiRootUrlMaster apiRootUrlMaster)
			throws ApiParseException {
		Set<ApiInformation> apiInfoSet = new HashSet<ApiInformation>();
		if (methodList != null && !methodList.isEmpty()) {
			for (Method method : methodList) {
				apiInfoSet.add(processMethod(method, parentUrl,
						apiRootUrlMaster));
			}

		}
		return apiInfoSet;
	}

	private ApiInformation processMethod(Method method, String url,
			ApiRootUrlMaster apiRootUrlMaster) throws ApiParseException {
		ApiInformation info = new ApiInformation();
		info.setName(method.getId());
		info.setRequestMethod(method.getName());
		info.setUrl(url);
		info.setApiRootUrlMaster(apiRootUrlMaster);
		/*
		 * the minOccur in schema is 0, maxOccur is undefined, assumed 1
		 */
		Request request = method.getRequest();
		/*
		 * the micOccur in schema is 0,maxOccur is unbounded, but here just use
		 * the first one
		 */
		Response response = method.getResponseArray(0);
		List<Representation> representations = new ArrayList<Representation>();
		Set<RequestParam> requestParams = null;
		if (request != null) {
			representations.addAll(Arrays.asList(request
					.getRepresentationArray()));

			requestParams = processRequest(request, info);

		}
		Set<ReturnParam> returnParams = null;
		if (response != null) {
			representations.addAll(Arrays.asList(response
					.getRepresentationArray()));
			try {
				returnParams = processResponse(response, info);
			} catch (ApiParseException e) {
				e.printStackTrace();
			}
		}

		Set<ApiMediaType> mediaTypes = processMediaType(representations, info);
		info.setApiMediaTypes(mediaTypes);
		info.setReturnParams(returnParams);
		info.setRequestParams(requestParams);
		return info;
	}

	private Set<ApiMediaType> processMediaType(
			List<Representation> representations, ApiInformation info) {
		Set<ApiMediaType> typeSet = new HashSet<ApiMediaType>();
		Set<String> mediaSet = new HashSet<String>();
		if (representations != null && !representations.isEmpty()) {
			for (Representation representation : representations) {
				mediaSet.add(representation.getMediaType());
			}
		}
		typeSet = mediaSet.stream().map(media -> {
			ApiMediaType mediaType = new ApiMediaType();
			mediaType.setMediaType(media);
			mediaType.setApiInformation(info);
			return mediaType;
		}).collect(Collectors.toSet());
		return typeSet;
	}

	private Set<RequestParam> processRequest(Request request,
			ApiInformation info) throws ApiParseException {
		Set<RequestParam> params = new HashSet<RequestParam>();
		params.addAll(processParam(request, info));

		List<Representation> representationList = Arrays.asList(request
				.getRepresentationArray());
		if (representationList != null && !representationList.isEmpty()) {
			varifyRepresentationList(representationList);
			Set<RequestParam> tempSet;
			try {
				tempSet = processRequestRepresentation(
						representationList.get(0), info);
				params.addAll(tempSet);
			} catch (ApiParseException e) {
				e.printStackTrace();
			}
		}
		return params;
	}

	private Set<ReturnParam> processResponse(Response response,
			ApiInformation info) throws ApiParseException {
		Set<ReturnParam> params = new HashSet<ReturnParam>();
		params.addAll(processParam(response, info));
		List<Representation> representationList = Arrays.asList(response
				.getRepresentationArray());
		if (representationList != null && !representationList.isEmpty()) {
			varifyRepresentationList(representationList);

			Set<ReturnParam> templist;
			try {
				templist = processResponseRepresentation(
						representationList.get(0), info);
				params.addAll(templist);
			} catch (ApiParseException e) {
				e.printStackTrace();
			}
		}
		return params;
	}

	private void varifyRepresentationList(
			List<Representation> representationList) throws ApiParseException {
		if (representationList != null && !representationList.isEmpty()) {
			QName element = representationList.get(0).getElement();
			if (element != null) {
				String localElement = element.getLocalPart();
				for (Representation representation : representationList) {
					String temp = representation.getElement().getLocalPart();
					if (!representation.getElement().getLocalPart()
							.equals(localElement)) {
						throw new ApiParseException(
								"the element value in representation in same request should be same");
					}
				}
			}
		}
	}

	private Set<ReturnParam> processResponseRepresentation(
			Representation representation, ApiInformation info)
			throws ApiParseException {
		Set<ReturnParam> params = new HashSet<ReturnParam>();
		// get the entity name
		QName qName = representation.getElement();
		if (qName != null) {
			String element = qName.getLocalPart();

			String typeName = this.entityTypeMap.get(element);
			if (typeName == null) {
				throw new ApiParseException("can not get type of entity :"
						+ element);
			} else {
				List<InnerParam> innerParams = this.typeParamsMap.get(typeName);
				if (innerParams == null) {
					throw new ApiParseException("can not get params of type :"
							+ typeName);
				} else {
					List<ReturnParam> tempList = innerParams
							.stream()
							.map(param -> {
								ReturnParam temp = new ReturnParam();
								temp.setApiInformation(info);
								temp.setName(param.name);
								temp.setType(param.type);
								temp.setIsList(param.isList);
								if (this.typeParamsMap.get(param.type) != null) {
									temp.setIsBaseType(false);
								}
								return temp;
							}).collect(Collectors.toList());
					params.addAll(tempList);
				}
			}
		}
		return params;
	}

	private List<ReturnParam> processParam(Response response,
			ApiInformation info) {
		List<ReturnParam> params = new ArrayList<ReturnParam>();
		List<Param> paramList = Arrays.asList(response.getParamArray());
		if (paramList != null && !paramList.isEmpty())
			paramList.forEach(param -> {
				ReturnParam temp = new ReturnParam();
				temp.setApiInformation(info);
				temp.setName(param.getName());
				temp.setType(param.getType().getLocalPart());
				temp.setIsList(false);
				temp.setIsBaseType(true);
				params.add(temp);
			});

		return params;

	}

	private List<RequestParam> processParam(Request request, ApiInformation info) {
		List<RequestParam> params = new ArrayList<RequestParam>();
		List<Param> paramList = Arrays.asList(request.getParamArray());
		if (paramList != null && !paramList.isEmpty())
			paramList.forEach(param -> {
				RequestParam temp = new RequestParam();
				temp.setApiInformation(info);
				temp.setName(param.getName());
				temp.setType(param.getType().toString());
				temp.setRequired(param.getRequired());
				temp.setIsBaseType(true);
				temp.setIsList(false);
				params.add(temp);
			});

		return params;

	}

	private Set<RequestParam> processRequestRepresentation(
			Representation representation, ApiInformation info)
			throws ApiParseException {
		Set<RequestParam> params = new HashSet<RequestParam>();
		// get the entity name
		QName qName = representation.getElement();
		if (qName != null) {
			String element = qName.getLocalPart();
			String typeName = this.entityTypeMap.get(element);
			if (typeName == null) {
				throw new ApiParseException("can not get type of entity :"
						+ element);
			} else {
				List<InnerParam> innerParams = this.typeParamsMap.get(typeName);
				if (innerParams == null) {
					throw new ApiParseException("can not get params of type :"
							+ typeName);
				} else {
					Set<RequestParam> tempList = innerParams
							.stream()
							.map(param -> {
								RequestParam temp = new RequestParam();
								temp.setApiInformation(info);
								temp.setName(param.name);
								temp.setType(param.type);
								temp.setRequired(param.required);
								temp.setIsList(param.isList);
								if (this.typeParamsMap.get(param.type) != null) {
									temp.setIsBaseType(false);
								} else {
									temp.setIsBaseType(true);
								}
								return temp;
							}).collect(Collectors.toSet());
					params.addAll(tempList);
				}
			}
		}
		return params;
	}

	private InputStream getUrlContent(String s) {
		try {
			URL url = new URL(s);
			URLConnection uc = url.openConnection();
			InputStream in = uc.getInputStream();
			return in;
		} catch (IOException e) {
			this.logger.info("get resource from url: " + s + " failed");
			e.printStackTrace();
		}
		return null;
	}

	private String getParamUrl(ApplicationDocument appDoc, String parentUrl) {
		// there are just one include in our wadl file, i do not know if there
		// would be another one.
		Application app = appDoc.getApplication();
		String href = app.getGrammars().getIncludeArray(0).getHref();
		href = href.substring(href.lastIndexOf("/"), href.length());
		return parentUrl + href;
	}

	private void parseParam(URL url) throws DocumentException {
		SAXReader reader = new SAXReader();
		Document document = reader.read(url);
		Element root = document.getRootElement();
		Map<String, String> entityTypeMap = new HashMap<String, String>();
		for (Iterator i = root.elementIterator("element"); i.hasNext();) {
			Element ele = (Element) i.next();
			String name = null;
			String type = null;
			for (Iterator j = ele.attributeIterator(); j.hasNext();) {
				Attribute attribute = (Attribute) j.next();

				if (attribute.getName().equals("name")) {
					name = attribute.getValue();
				}
				;
				if (attribute.getName().equals("type")) {
					type = attribute.getValue();
				}

				if (name != null && type != null) {
					entityTypeMap.put(name, type);
				}
			}

		}
		this.entityTypeMap = entityTypeMap;

		Map<String, List<InnerParam>> typeParamsMap = new HashMap<String, List<InnerParam>>();
		for (Iterator i = root.elementIterator("complexType"); i.hasNext();) {
			Element complexType = (Element) i.next();
			String typeName = null;
			for (Iterator j = complexType.attributeIterator(); j.hasNext();) {
				Attribute attribute = (Attribute) j.next();
				if (attribute.getName().equals("name")) {
					typeName = attribute.getValue();
				}
			}
			List<InnerParam> paramList = new ArrayList<InnerParam>();
			for (Iterator it = complexType.elementIterator("sequence"); it
					.hasNext();) {
				Element sequence = (Element) it.next();

				for (Iterator ite = sequence.elementIterator("element"); ite
						.hasNext();) {
					Element element = (Element) ite.next();
					InnerParam param = new InnerParam();
					param.required = true;
					param.isList = false;
					for (Iterator iter = element.attributeIterator(); iter
							.hasNext();) {
						Attribute attr = (Attribute) iter.next();
						if (attr.getName().equals("name")) {
							param.name = attr.getStringValue();
						}
						if (attr.getName().equals("type")) {
							param.type = attr.getStringValue();
						}
						if (attr.getName().equals("nillable")) {
							if (attr.getValue().equals("true")) {
								param.required = false;
							} else {
								param.required = true;
							}
						}
						if (attr.getName().equals("maxOccurs")) {
							if (attr.getValue().equals("unbounded")) {
								param.isList = true;
							} else {
								param.isList = false;
							}
						}
					}
					paramList.add(param);
				}

			}
			typeParamsMap.put(typeName, paramList);
		}
		this.typeParamsMap = typeParamsMap;

	}

	private class InnerParam {
		public String type;
		public String name;
		// public Boolean required;
		public Boolean required;
		public Boolean isList;

		public void InnerParam() {
		}
	}
}