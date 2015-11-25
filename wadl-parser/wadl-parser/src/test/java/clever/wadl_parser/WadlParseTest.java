package clever.wadl_parser;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.java.dev.wadl.x2009.x02.ApplicationDocument;
import net.java.dev.wadl.x2009.x02.ApplicationDocument.Application;
import net.java.dev.wadl.x2009.x02.MethodDocument.Method;
import net.java.dev.wadl.x2009.x02.RepresentationDocument.Representation;
import net.java.dev.wadl.x2009.x02.ResourceDocument.Resource;
import net.java.dev.wadl.x2009.x02.ResourcesDocument;
import net.java.dev.wadl.x2009.x02.ResourcesDocument.Resources;

import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.junit.Test;

public class WadlParseTest {
	@Test
	public void test() throws Exception {
		URL url = new URL(
				"http://172.16.100.64:8080/clever-cdr/webapi/application.wadl");
		URLConnection uc = url.openConnection();
		InputStream in = uc.getInputStream();
		WadlParser parser = new WadlParser();
		ApplicationDocument result = parser.parseWadl(in);

		Application app = result.getApplication();
		System.out
				.println(getParamUrl(app,
						"http://172.16.100.64:8080/clever-cdr/webapi/application.wadl"));
		// get resources list
		List<Resources> resourcesList = Arrays.asList(app.getResourcesArray());
		if (resourcesList != null) {
			resourcesList.forEach(resources -> {
				processResources(resources);
			});
		}

	}

	private String getParamUrl(Application app, String parentUrl) {
		// there are just one include in our wadl file, i do not know if there
		// would be another one.
		String href = app.getGrammars().getIncludeArray(0).getHref();
		href = href.substring(href.lastIndexOf("/"), href.length());
		return parentUrl + href;
	}

	// @Test
	public void parseSchema() throws IOException, DocumentException {
		URL url = new URL(
				"http://172.16.100.64:8080/clever-cdr/webapi/application.wadl/xsd0.xsd");

		// URLConnection uc = url.openConnection();
		// InputStream in = uc.getInputStream();
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

				if (attribute.getName() == "name") {
					name = attribute.getValue();
				}
				;
				if (attribute.getName() == "type") {
					type = attribute.getValue();
				}

				if (name != null && type != null) {
					entityTypeMap.put(name, type);
				}
			}

		}

		Map<String, Map<String, String>> complexTypeDetailsMap = new HashMap<String, Map<String, String>>();
		for (Iterator i = root.elementIterator("complexType"); i.hasNext();) {
			Element complexType = (Element) i.next();
			String typeName = null;
			for (Iterator j = complexType.attributeIterator(); j.hasNext();) {
				Attribute attribute = (Attribute) j.next();
				if (attribute.getName() == "name") {
					typeName = attribute.getValue();
				}
			}
			Map<String, String> nameTypeMap = new HashMap<String, String>();
			for (Iterator it = complexType.elementIterator("sequence"); it
					.hasNext();) {
				Element sequence = (Element) it.next();
				for (Iterator ite = sequence.elementIterator("element"); ite
						.hasNext();) {
					Element element = (Element) ite.next();
					String name = null;
					String type = null;
					for (Iterator iter = element.attributeIterator(); iter
							.hasNext();) {
						Attribute attr = (Attribute) iter.next();
						if (attr.getName() == "name") {
							name = attr.getStringValue();
						}
						if (attr.getName() == "type") {
							type = attr.getStringValue();
						}
						if (name != null && type != null) {
							nameTypeMap.put(name, type);
						}
					}
				}
			}

			complexTypeDetailsMap.put(typeName, nameTypeMap);

		}
		System.out.println(entityTypeMap.size());

		System.out.println(complexTypeDetailsMap.get("examDataEntity").get(
				"examDataList"));
	}

	private void processResources(Resources resources) {
		String baseUrl = resources.getBase();
		List<Resource> resourceList = Arrays.asList(resources
				.getResourceArray());
		if (resourceList != null) {
			resourceList.forEach(resource -> {
				processResource(resource, baseUrl);
			});
		}
	}

	private void processResource(Resource resource, String parentUrl) {
		String path = resource.getPath();
		List<Method> methods = Arrays.asList(resource.getMethodArray());
		if (!methods.isEmpty()) {
			methods.forEach(method -> {
				processMethod(method);
			});

		}
	}

	private void processMethod(Method method) {

	}

}
