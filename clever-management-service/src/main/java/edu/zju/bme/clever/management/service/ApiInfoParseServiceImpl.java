package edu.zju.bme.clever.management.service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

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

import clever.wadl_parser.WadlParser;
import edu.zju.bme.clever.management.service.entity.ApiInformation;
import edu.zju.bme.clever.management.service.entity.ApiMaster;
import edu.zju.bme.clever.management.service.entity.ApiMediaType;
import edu.zju.bme.clever.management.service.entity.ApiRootUrlMaster;
import edu.zju.bme.clever.management.service.entity.ApiVersionMaster;
import edu.zju.bme.clever.management.service.entity.ClassAttribute;
import edu.zju.bme.clever.management.service.entity.ClassMaster;
import edu.zju.bme.clever.management.service.entity.RequestParam;
import edu.zju.bme.clever.management.service.entity.ReturnParam;
import edu.zju.bme.clever.management.service.exception.ApiParseException;
import edu.zju.bme.clever.management.service.repository.ApiMasterRepository;
import edu.zju.bme.clever.management.service.repository.ApiVersionMasterRepository;
import edu.zju.bme.clever.management.service.repository.ClassAttributeRepository;
import edu.zju.bme.clever.management.service.repository.ClassMasterRepository;
import net.java.dev.wadl.x2009.x02.ApplicationDocument;
import net.java.dev.wadl.x2009.x02.ApplicationDocument.Application;
import net.java.dev.wadl.x2009.x02.MethodDocument.Method;
import net.java.dev.wadl.x2009.x02.ParamDocument.Param;
import net.java.dev.wadl.x2009.x02.RepresentationDocument.Representation;
import net.java.dev.wadl.x2009.x02.RequestDocument.Request;
import net.java.dev.wadl.x2009.x02.ResourceDocument.Resource;
import net.java.dev.wadl.x2009.x02.ResourcesDocument.Resources;
import net.java.dev.wadl.x2009.x02.ResponseDocument.Response;

@Service
@Transactional
public class ApiInfoParseServiceImpl implements ApiInfoParseService {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	@Autowired
	private ApiMasterRepository apiMasterRepo;

	@Autowired
	private ApiVersionMasterRepository apiVersionMasterRepo;

	@Autowired
	private ClassMasterRepository classMasterRepo;

	@Autowired
	private ClassAttributeRepository classAttributeRepo;

	private WadlParser wadlParser = new WadlParser();

	private Map<String, List<InnerParam>> typeParamsMap = new HashMap<String, List<InnerParam>>();
	private Map<String, String> entityTypeMap = new HashMap<String, String>();

	@Override
	public void parseWadl(String url, String apiMasterName, Integer version) throws Exception {
		InputStream in = getUrlContent(url);
		ApplicationDocument applicationDoc = null;
		applicationDoc = wadlParser.parseWadl(in);

		ApiMaster apiMaster = this.apiMasterRepo.findByNameFetchAll(apiMasterName);
		// ApiMaster apiMaster = new ApiMaster();
		ApiVersionMaster oldVersionMaster = null;
		if (apiMaster == null) {// there is no a apimaster in repository
			System.out.println("api master is null");
			apiMaster = createApiMaster(apiMasterName);
		} else {
			System.out.println("api master is exist");
			oldVersionMaster = this.apiVersionMasterRepo.findByVersionAndApiMasterIdFetchAll(version,
					apiMaster.getId());
		}
		ApiVersionMaster versionMaster = new ApiVersionMaster();
		versionMaster.setVersion(version);
		if (oldVersionMaster != null) {
			System.out.println("oldVersionMaster  is exist");
			versionMaster.setLastVersionMaster(oldVersionMaster.getLastVersionMaster());
			versionMaster.setNextVersionMaster(oldVersionMaster.getNextVersionMaster());
			this.apiVersionMasterRepo.delete(oldVersionMaster);
		} else {
			try {

				System.out.println("oldVersionMaster is null");
				Set<ApiVersionMaster> versionMasterSet = apiMaster.getVersionMasters();
				if (versionMasterSet != null && !versionMasterSet.isEmpty()) {
					List<ApiVersionMaster> largerList = new ArrayList<ApiVersionMaster>();
					List<ApiVersionMaster> smallerList = new ArrayList<ApiVersionMaster>();
					versionMasterSet.forEach(master -> {
						if (versionMaster.getVersion() > master.getVersion()) {
							smallerList.add(master);
						} else {
							largerList.add(master);
						}
					});
					Collections.sort(largerList);
					Collections.sort(smallerList);
					if (!smallerList.isEmpty()) {
						ApiVersionMaster last = smallerList.get(0);
						versionMaster.setLastVersionMaster(last);
						last.setNextVersionMaster(versionMaster);
					}
					if (!largerList.isEmpty()) {
						ApiVersionMaster next = largerList.get(largerList.size() - 1);
						versionMaster.setNextVersionMaster(next);
						next.setLastVersionMaster(versionMaster);
					}
					versionMasterSet.add(versionMaster);
				} else {
					versionMasterSet = new HashSet<ApiVersionMaster>();
					versionMasterSet.add(versionMaster);
					apiMaster.setVersionMasters(versionMasterSet);
				}
			} catch (Exception e) {
				System.out.println("error :" + e.getMessage());
			}
		}

		ApiVersionMaster latestVersionMaster = apiMaster.getLatestVersionMaster();
		if (latestVersionMaster != null) {
			System.out.println("latestVersionMaster is Exist");
			if (latestVersionMaster.getVersion() < versionMaster.getVersion()) {
				System.out.println("set version master as latest ");
				apiMaster.setLatestVersionMaster(versionMaster);
			}
		} else {
			System.out.println("latestVersionMaster is null");
			apiMaster.setLatestVersionMaster(versionMaster);
		}

		versionMaster.setApiMaster(apiMaster);
		this.apiVersionMasterRepo.save(versionMaster);
		this.apiMasterRepo.save(apiMaster);

		ApiVersionMaster resultMaster = this.apiVersionMasterRepo.findByVersionAndApiMasterIdFetchAll(version,
				this.apiMasterRepo.findByName(apiMasterName).getId());

		if (applicationDoc != null) {
			Set<ClassMaster> classMasterList = parseParam(new URL(getParamUrl(applicationDoc, url)), resultMaster);
			resultMaster.setClassMasters(classMasterList);
			persistWadlModel(applicationDoc, resultMaster);
		}
		this.apiVersionMasterRepo.save(resultMaster);

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

	private ApiVersionMaster createApiVersionMaster(Integer version) {
		ApiVersionMaster apiVersionMaster = new ApiVersionMaster();
		apiVersionMaster.setVersion(version);
		return apiVersionMaster;

	}

	// private Integer versionControl(Integer oldVersion) {
	// return oldVersion + 1;
	// }

	private void persistWadlModel(ApplicationDocument doc, ApiVersionMaster versionMaster) throws ApiParseException {

		Set<ApiRootUrlMaster> urlMasterSet = new HashSet<ApiRootUrlMaster>();
		try {

			Application app = doc.getApplication();

			List<Resources> resourcesList = Arrays.asList(app.getResourcesArray());
			urlMasterSet = new HashSet<ApiRootUrlMaster>();

			if (resourcesList != null) {
				for (Resources resources : resourcesList) {
					urlMasterSet.addAll(processResources(resources, versionMaster));
				}
				;
			}

		} catch (Exception e) {
			System.out.println("error :" + e.getMessage());
		}

		if (!urlMasterSet.isEmpty()) {
			versionMaster.setApiRootUrlMasters(urlMasterSet);
		} else {
			throw new ApiParseException("can not get api information from this wadl file");
		}
	}

	private List<ApiRootUrlMaster> processResources(Resources resources, ApiVersionMaster versionMaster) {

		String baseUrl = resources.getBase();
		List<Resource> resourceList = Arrays.asList(resources.getResourceArray());
		List<ApiRootUrlMaster> urlMasterList = new ArrayList<ApiRootUrlMaster>();
		if (resourceList != null) {
			urlMasterList = resourceList.stream().map(resource -> {
				ApiRootUrlMaster urlMaster = null;
				try {
					urlMaster = processRootResource(resource, baseUrl, versionMaster.getId());
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

	private ApiRootUrlMaster processRootResource(Resource resource, String parentUrl, Integer versionMasterId)
			throws ApiParseException {
		ApiRootUrlMaster master = new ApiRootUrlMaster();
		String name = resource.getPath();
		master.setName(name);
		List<Method> methodList = Arrays.asList(resource.getMethodArray());
		Set<ApiInformation> apiInfoSet = processMethodList(methodList, parentUrl + resource.getPath(), master,
				versionMasterId);

		List<Resource> resourceList = Arrays.asList(resource.getResourceArray());
		if (resourceList != null && !resourceList.isEmpty()) {
			resourceList.forEach(aresource -> {
				try {
					apiInfoSet.addAll(
							processResource(aresource, parentUrl + resource.getPath(), master, versionMasterId));
				} catch (Exception e) {
					// TODO Auto-generated catch block
					this.logger.info("provess resource failed :" + e.getMessage());
					e.printStackTrace();
				}
			});
		}
		master.setApiInformations(apiInfoSet);
		return master;
	}

	private Set<ApiInformation> processResource(Resource resource, String parentUrl, ApiRootUrlMaster apiRootUrlMaster,
			Integer versionMasterId) throws ApiParseException {
		List<Method> methodList = Arrays.asList(resource.getMethodArray());
		Set<ApiInformation> apiInfoSet = processMethodList(methodList, parentUrl + resource.getPath(), apiRootUrlMaster,
				versionMasterId);
		List<Resource> resourceList = Arrays.asList(resource.getResourceArray());
		if (resourceList != null && !resourceList.isEmpty()) {
			resourceList.forEach(aresource -> {
				try {
					apiInfoSet.addAll(processResource(aresource, parentUrl + resource.getPath(), apiRootUrlMaster,
							versionMasterId));
				} catch (Exception e) {
					this.logger.info("provess resource failed :" + e.getMessage());
					e.printStackTrace();
				}
			});
		}
		return apiInfoSet;
	}

	private Set<ApiInformation> processMethodList(List<Method> methodList, String parentUrl,
			ApiRootUrlMaster apiRootUrlMaster, Integer versionMasterId) throws ApiParseException {
		Set<ApiInformation> apiInfoSet = new HashSet<ApiInformation>();
		if (methodList != null && !methodList.isEmpty()) {
			for (Method method : methodList) {
				apiInfoSet.add(processMethod(method, parentUrl, apiRootUrlMaster, versionMasterId));
			}

		}
		return apiInfoSet;
	}

	private ApiInformation processMethod(Method method, String url, ApiRootUrlMaster apiRootUrlMaster,
			Integer versionMasterId) throws ApiParseException {
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
			representations.addAll(Arrays.asList(request.getRepresentationArray()));

			requestParams = processRequest(request, info, versionMasterId);

		}
		Set<ReturnParam> returnParams = null;
		if (response != null) {
			representations.addAll(Arrays.asList(response.getRepresentationArray()));
			try {
				returnParams = processResponse(response, info, versionMasterId);
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

	private Set<ApiMediaType> processMediaType(List<Representation> representations, ApiInformation info) {
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

	private Set<RequestParam> processRequest(Request request, ApiInformation info, Integer versionMasterId)
			throws ApiParseException {
		Set<RequestParam> params = new HashSet<RequestParam>();
		params.addAll(processParam(request, info, versionMasterId));

		List<Representation> representationList = Arrays.asList(request.getRepresentationArray());
		if (representationList != null && !representationList.isEmpty()) {
			varifyRepresentationList(representationList);
			Set<RequestParam> tempSet;
			try {
				tempSet = processRequestRepresentation(representationList.get(0), info, versionMasterId);
				params.addAll(tempSet);
			} catch (ApiParseException e) {
				e.printStackTrace();
			}
		}
		return params;
	}

	private Set<ReturnParam> processResponse(Response response, ApiInformation info, Integer versionMasterId)
			throws ApiParseException {
		Set<ReturnParam> params = new HashSet<ReturnParam>();
		params.addAll(processParam(response, info, versionMasterId));
		List<Representation> representationList = Arrays.asList(response.getRepresentationArray());
		if (representationList != null && !representationList.isEmpty()) {
			varifyRepresentationList(representationList);

			Set<ReturnParam> templist;
			try {
				templist = processResponseRepresentation(representationList.get(0), info, versionMasterId);
				params.addAll(templist);
			} catch (ApiParseException e) {
				e.printStackTrace();
			}
		}
		return params;
	}

	private void varifyRepresentationList(List<Representation> representationList) throws ApiParseException {
		if (representationList != null && !representationList.isEmpty()) {
			QName element = representationList.get(0).getElement();
			if (element != null) {
				String localElement = element.getLocalPart();
				for (Representation representation : representationList) {
					String temp = representation.getElement().getLocalPart();
					if (!representation.getElement().getLocalPart().equals(localElement)) {
						throw new ApiParseException(
								"the element value in representation in same request should be same");
					}
				}
			}
		}
	}

	private Set<ReturnParam> processResponseRepresentation(Representation representation, ApiInformation info,
			Integer versionMasterId) throws ApiParseException {
		Set<ReturnParam> params = new HashSet<ReturnParam>();
		// get the entity name
		QName qName = representation.getElement();
		if (qName != null) {
			String element = qName.getLocalPart();
			// String typeName = this.entityTypeMap.get(element);
			// if(typeName == null){
			// throw new ApiParseException("can not get type of entity :"
			// + element);
			// }
			ClassMaster classMaster = this.classMasterRepo.findByNameAndVersionMasterId(element, versionMasterId);
			if (classMaster == null) {
				throw new ApiParseException("can not find class master, type name :" + element);
			} else {
				ReturnParam param = new ReturnParam();
				param.setApiInformation(info);
				param.setClassMaster(classMaster);
				param.setIsBaseType(false);
				params.add(param);
			}
		}
		// this solution is deprecated
		// if (qName != null) {
		// String element = qName.getLocalPart();
		//
		// String typeName = this.entityTypeMap.get(element);
		// if (typeName == null) {
		// throw new ApiParseException("can not get type of entity :"
		// + element);
		// } else {
		// List<InnerParam> innerParams = this.typeParamsMap.get(typeName);
		// if (innerParams == null) {
		// throw new ApiParseException("can not get params of type :"
		// + typeName);
		// } else {
		// List<ReturnParam> tempList = innerParams
		// .stream()
		// .map(param -> {
		// ReturnParam temp = new ReturnParam();
		// temp.setApiInformation(info);
		// temp.setName(param.name);
		// temp.setType(param.type);
		// temp.setIsList(param.isList);
		// if (this.typeParamsMap.get(param.type) != null) {
		// temp.setIsBaseType(false);
		// }
		// return temp;
		// }).collect(Collectors.toList());
		// params.addAll(tempList);
		// }
		// }
		// }
		return params;
	}

	private List<ReturnParam> processParam(Response response, ApiInformation info, Integer versionMasterId) {
		List<ReturnParam> params = new ArrayList<ReturnParam>();
		List<Param> paramList = Arrays.asList(response.getParamArray());
		if (paramList != null && !paramList.isEmpty())
			paramList.forEach(param -> {
				ReturnParam temp = new ReturnParam();
				temp.setApiInformation(info);
				temp.setName(param.getName());
				String type = param.getType().getLocalPart();
				temp.setType(type);
				if (this.typeParamsMap.get(type) != null) {
					temp.setIsBaseType(false);
					ClassMaster master = this.classMasterRepo.findByTypeAndVersionMasterId(type, versionMasterId);
					if (master == null) {
						try {
							throw new ApiParseException("can not find class master, type name :" + type);
						} catch (Exception e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					} else {
						temp.setClassMaster(master);
					}
				} else {
					temp.setIsBaseType(true);
				}
				temp.setIsList(false);
				params.add(temp);
			});

		return params;
	}

	private List<RequestParam> processParam(Request request, ApiInformation info, Integer versionMasterId) {
		List<RequestParam> params = new ArrayList<RequestParam>();
		List<Param> paramList = Arrays.asList(request.getParamArray());
		if (paramList != null && !paramList.isEmpty())
			paramList.forEach(param -> {
				RequestParam temp = new RequestParam();
				temp.setApiInformation(info);
				temp.setName(param.getName());
				String type = param.getType().getLocalPart();
				temp.setType(type);
				if (this.typeParamsMap.get(type) != null) {
					temp.setIsBaseType(false);
					ClassMaster master = this.classMasterRepo.findByTypeAndVersionMasterId(type, versionMasterId);
					if (master == null) {
						try {
							throw new ApiParseException("can not find class master, type name :" + type);
						} catch (Exception e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					} else {
						temp.setClassMaster(master);
					}
				} else {
					temp.setIsBaseType(true);
				}
				temp.setRequired(param.getRequired());
				temp.setIsList(false);
				params.add(temp);
			});

		return params;
	}

	private Set<RequestParam> processRequestRepresentation(Representation representation, ApiInformation info,
			Integer versionMasterId) throws ApiParseException {
		Set<RequestParam> params = new HashSet<RequestParam>();
		// get the entity name
		QName qName = representation.getElement();
		if (qName != null) {
			String element = qName.getLocalPart();
			// String typeName = this.entityTypeMap.get(element);
			// if(typeName == null){
			// throw new ApiParseException("can not get type of entity :"
			// + element);
			// }
			ClassMaster classMaster = this.classMasterRepo.findByNameAndVersionMasterId(element, versionMasterId);
			if (classMaster == null) {
				throw new ApiParseException("can not find class master, type name :" + element);
			} else {
				RequestParam param = new RequestParam();
				param.setApiInformation(info);
				param.setClassMaster(classMaster);
				param.setIsBaseType(false);
				params.add(param);
			}
		}
		// this solution is deprecated
		// if (qName != null) {
		// String element = qName.getLocalPart();
		// String typeName = this.entityTypeMap.get(element);
		// if (typeName == null) {
		// throw new ApiParseException("can not get type of entity :"
		// + element);
		// } else {
		// List<InnerParam> innerParams = this.typeParamsMap.get(typeName);
		// if (innerParams == null) {
		// throw new ApiParseException("can not get params of type :"
		// + typeName);
		// } else {
		// Set<RequestParam> tempList = innerParams
		// .stream()
		// .map(param -> {
		// RequestParam temp = new RequestParam();
		// temp.setApiInformation(info);
		// temp.setName(param.name);
		// temp.setType(param.type);
		// temp.setRequired(param.required);
		// temp.setIsList(param.isList);
		// if (this.typeParamsMap.get(param.type) != null) {
		// temp.setIsBaseType(false);
		// } else {
		// temp.setIsBaseType(true);
		// }
		// return temp;
		// }).collect(Collectors.toSet());
		// params.addAll(tempList);
		// }
		// }
		// }

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

	private Set<ClassMaster> parseParam(URL url, ApiVersionMaster versionMaster) throws DocumentException {
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
			for (Iterator it = complexType.elementIterator("sequence"); it.hasNext();) {
				Element sequence = (Element) it.next();

				for (Iterator ite = sequence.elementIterator("element"); ite.hasNext();) {
					Element element = (Element) ite.next();
					InnerParam param = new InnerParam();
					param.required = true;
					param.isList = false;
					for (Iterator iter = element.attributeIterator(); iter.hasNext();) {
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
		return persistAttribute(entityTypeMap, typeParamsMap, versionMaster);

	}

	private Set<ClassMaster> persistAttribute(Map<String, String> entityTypeMap,
			Map<String, List<InnerParam>> typeParamsMap, ApiVersionMaster versionMaster) {

		Set<ClassMaster> classMasterList = new HashSet<>();
		if (entityTypeMap != null && !entityTypeMap.isEmpty()) {
			entityTypeMap.forEach((key, value) -> {
				System.out.println(key + ": " + value);
				ClassMaster master = new ClassMaster();
				master.setName(key);
				master.setType(value);
				// this.classMasterRepo.save(master);
				List<InnerParam> params = typeParamsMap.get(value);
				System.out.println(value + " size: " + params.size());
				Set<ClassAttribute> attributes = params.stream().map(param -> {
					ClassAttribute attribute = new ClassAttribute();
					attribute.setClassMaster(master);
					attribute.setName(param.name);
					attribute.setType(param.type);
					if (typeParamsMap.get(param.type) != null) {
						attribute.setIsBaseType(false);
					} else {
						attribute.setIsBaseType(true);
					}
					attribute.setIsRequired(param.required);
					attribute.setIsList(param.isList);
					// this.classAttributeRepo.save(attribute);
					return attribute;
				}).collect(Collectors.toSet());
				master.setAttributes(attributes);
				master.setVersionMaster(versionMaster);
				classMasterList.add(master);
				this.classMasterRepo.save(master);
			});
		}
		return classMasterList;
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
