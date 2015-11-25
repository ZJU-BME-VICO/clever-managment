package clever.wadl_parser;

import java.io.InputStream;

import org.apache.xmlbeans.XmlOptions;

import net.java.dev.wadl.x2009.x02.ApplicationDocument;

/**
 * Hello world!
 *
 */
public class WadlParser 
{
   public ApplicationDocument parseWadl(InputStream input) throws Exception {
	   XmlOptions options = new XmlOptions();
	   options.setCharacterEncoding("UTF-8");
	   return ApplicationDocument.Factory.parse(input, options);
   }
}
