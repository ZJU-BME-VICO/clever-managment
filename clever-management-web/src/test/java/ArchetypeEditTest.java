import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.Test;

import static org.junit.Assert.*;
import se.acode.openehr.parser.*;

import org.openehr.am.archetype.Archetype;
import org.openehr.am.archetype.assertion.Assertion;
import org.openehr.am.archetype.constraintmodel.*;
import org.openehr.am.archetype.constraintmodel.CAttribute.Existence;
import org.openehr.am.archetype.constraintmodel.primitive.CBoolean;
import org.openehr.am.archetype.constraintmodel.primitive.CInteger;
import org.openehr.am.archetype.constraintmodel.primitive.CPrimitive;
import org.openehr.am.archetype.constraintmodel.primitive.CReal;
import org.openehr.am.archetype.ontology.*; 
import org.openehr.am.openehrprofile.datatypes.quantity.CDvOrdinal;
import org.openehr.am.openehrprofile.datatypes.quantity.CDvQuantity;
import org.openehr.am.openehrprofile.datatypes.quantity.CDvQuantityItem;
import org.openehr.am.openehrprofile.datatypes.text.CCodePhrase;
import 	org.openehr.am.serialize.*;
import org.openehr.rm.support.basic.Interval;
import org.openehr.rm.support.identification.TerminologyID;
import org.openehr.rm.datatypes.basic.*;
import org.openehr.rm.datatypes.text.CodePhrase;
import  org.openehr.am.archetype.ontology.*;

class OntologyCount
{
   

	
}

public class ArchetypeEditTest {
	
	//维护一个存储ontology部分记录条数的变量
	private int termDefinitionCount;
	private int constraintDefinitionCount;
	
	private Archetype arc;
	private CComplexObject definition;
	private ArchetypeOntology ontology;
	//String currentNodeId;
	
	//constructor,get the Archetype arc
	@Test
	public void  ArchetypeEditTest()
	{
		File test = new File("F:\\ArchetypeEditorProject\\openEHR-EHR-ACTION.health_education.v1.adl");//("E:\\Archetype\\test.adl");
		if(test.canRead())System.out.println("file can be readed");
		try
		{
		ADLParser a = new  ADLParser(test);
		arc = a.parse();
		
		definition = arc.getDefinition();
		ontology = arc.getOntology();
		String s = definition.getNodeId();
		
	    
	   
		
		
		
		
		
		//添加节点测试
		//CComplexObject cObject = (CComplexObject)(definition.getAttributes().get(1).getChildren().get(0));
		//addElement(cObject.getAttributes().get(0),ReferenceModelName.DV_COUNT);
		//addElement(cObject.getAttributes().get(0),ReferenceModelName.C_DV_QUANTITY);
		//addElement(cObject.getAttributes().get(0),ReferenceModelName.c);
		//addCluster(cObject.getAttributes().get(0));
		//CAttribute aimAttribute = cObject.getAttributes().get(0);
		//CComplexObject cObject1 =(CComplexObject)cObject.getAttributes().get(0).getChildren().get(26);
		
		//System.out.println(cObject1.getRmTypeName());
		
		
		/*Quantity test
		addQuantityElement(cObject.path(),AttributeName.ITEMTREE_ITEMS);
		String path = arc.getPathByNodeId("at0070")+"/value";
		quantityProperty(path,"openEHR","300");
		quantityList(path,"g/h");
		quantityList(path,"g/m");
		quantityListInterval(path,1,0.002,true,0.001,false,0.001,4);
		*/
		
		
		
		//addIntervalElement_Integer(cObject.path(),AttributeName.ITEMTREE_ITEMS);
		//addIntervalElement_Qauntity(cObject.path(),AttributeName.ITEMTREE_ITEMS);
		//addBooleanElement(cObject.path(),AttributeName.ITEMTREE_ITEMS);
		//addAnyElement(cObject.path(),AttributeName.ITEMTREE_ITEMS);
		//addChoiceElement(cObject.path(),AttributeName.ITEMTREE_ITEMS);
		//addMultimediaElement(cObject.path(),AttributeName.ITEMTREE_ITEMS);
		//addUILResourceIdentifierElement(cObject.path(),AttributeName.ITEMTREE_ITEMS);
		//addSlotElement(cObject.path(),AttributeName.ITEMTREE_ITEMS,ReferenceModelName.CLUSTER);
		//System.out.println( arc.getPathByNodeId("at0075"));
		//deleteElement(arc.getPathByNodeId("at0075"));
        //updateArchetypeTerm(arc.getPathByNodeId("at0075"),"description","sfdgsdfg");
		//CComplexObject obj = (CComplexObject)arc.getPathNodeMap().get(arc.getPathByNodeId("at0019"));
		
		
		//String path =arc.getPathByNodeId("at0019");
		//updateArchetypeTerm(path,"agsdfg","hfhfg",TermOrConstraint.TERMDEFINE);//ok
       //System.out.println(ontology.getConstraintBindingList().get(0).getTerminology());
       //System.out.println(ontology.getConstraintBindingList().get(0).getBindingList().get(0));
		
		CObject obj = arc.getPathNodeMap().get(arc.getPathByNodeId("at0072"));
		System.out.println(obj.getClass());
		CountElementOperate(arc.getPathByNodeId("at0072"),1.0,true,2.0,true,1.0);
		
		//System.out.println(obj);
		//System.out.println(ontology.getConstraintBindingList().get(0).getBindingList().get(0));
		
		//updateConstraintBinding(obj.path(),"sdafa", "fgad","");
		
		//serializer and output
		ADLSerializer Serializer = new ADLSerializer();
		//System.out.println(Serializer.outputDefinitionOnly(arc));
		System.out.println(Serializer.output(arc));
		assertEquals(5,5);
		}
		catch(IOException e){
			System.out.println("can not open the file ");
		}
		catch(ParseException p){
			System.out.println("Parse Fault ");
			System.out.println(p.getMessage());
		}
		catch(Exception e){
			System.out.println(e.getMessage());
		}
		
	}

	
//----------------------辅助方法------------------------------------
//获得path路径下的AttributeName为 rmAttributeName的CAttribute节点      
CAttribute getAttribute(String path,AttributeName rmAttributeName)
 {
     CComplexObject obj =  (CComplexObject)( arc.getPathNodeMap().get(path));
	 return obj.getAttribute(rmAttributeName.toString());
		  
 }

//为Attribute节点添加CObject类型子节点--主要功能：添加子节点，更新MAP
void  addChildToAttribute(CAttribute attribute,CObject obj)
{
    attribute.addChild(obj);
    arc.updatePathNodeMapRecursively(obj);
	arc.updateNodeIdPahtMap(obj);
	
    
}
 
//为一个CComplexObject添加Attribute，名称为rmAttributeName
CAttribute addAttribute(CComplexObject obj,AttributeName rmAttributeName)
   {
	  /*
	   * CAttribute(String path, 
	   *                   String rmAttributeName,
       *                   Existence existence, 
       *                   List<CObject> children )
	   */
	  
	   CAttribute attr = new CSingleAttribute(obj.path()+"/"+rmAttributeName.toString(),
			                                  rmAttributeName.toString(),
			                                  Existence.REQUIRED, 
			                                  null);
	   obj.addAttribute(attr);
	  
	   return attr;
	   
	
	  
   }
  
 //添加一个具有NodeId的，且referenceModelName为**的CComplexObject到Attribute节点上
CComplexObject  addNodeWithNodeId(CAttribute attribute,ReferenceModelName referModelName)
  {
	  /*
	   * CComplexObject(String path, 
	   *                              String rmTypeName,
       *                              Interval<Integer> occurrences, 
       *                              String nodeID, 
       *                              List<CAttribute> attributes,
       *                              CAttribute parent ) 
       */
	   //get the code being to used
      String nextCode = ontology.getNextCode(Language.LANGUAGE_EN,TermOrConstraint.TERMDEFINE);
     
	  CComplexObject object =  new CComplexObject(attribute.path()+"["+nextCode+"]",
			                                        referModelName.toString(),
                                                    new Interval(0,1),
                                                    nextCode,
                                                    null,
                                                    null);
	  addChildToAttribute(attribute,object);
	  arc.getOntology().upDateDefinitionList(Language.LANGUAGE_EN,
                       new ArchetypeTerm(object.getNodeId(),"New "+ referModelName.toString().toLowerCase(),"*"),
                       TermOrConstraint.TERMDEFINE);
	  return object;
  }

//添加一个不具有NodeId的，且referenceModelName为**的CComplexObject到Attribute节点上
CComplexObject  addNodeWithoutNodeId(CAttribute attribute,ReferenceModelName referModelName)
{
	/*
	 * CComplexObject(String path, 
	 *                String rmTypeName,
     *                Interval<Integer> occurrences, 
     *                String nodeID, 
     *                List<CAttribute> attributes,
     *                CAttribute parent ) 
     */
	

	   CComplexObject object =  new CComplexObject(attribute.path(),
                                                   referModelName.getName(),
                                                   new Interval(1,1),
                                                   null, 
                                                   null,
                                                   null);
	  addChildToAttribute(attribute,object);
	  return object;
}
 
//上层添加referenceModelName类型节点快速通道，调用多个函数实现节点默认初始化
CComplexObject addElement(CAttribute attribute,ReferenceModelName rferenceModelName)//default
  {   
	  return addNodeWithoutNodeId(addAttribute(addNodeWithNodeId(attribute,ReferenceModelName.ELEMENT),AttributeName.ELEMENT_VALUE),rferenceModelName); 
  }

//仅有字符串参数的添加子类型到Attribute的方法，----备用
void addBadeDataTypeToAttribute(String path,AttributeName attrName, CObject obj)
{
	 CAttribute aimAttr = getAttribute(path,attrName);
	 addChildToAttribute(aimAttr,obj);
}
//------------------------------辅助方法end--------------------------------------------------
  
  



//--------------------------------默认添加操作-----------------------------------------------------
  //添加一个Cluster类型节点，默认底部为空
  void addCluster(CAttribute attribute)//default
   {   
     addNodeWithNodeId(attribute,ReferenceModelName.CLUSTER); 
   }
   
  //添加默认状态的Boolean类型主节点-------待删除，，看还有没有用
  void addBoolean(String path,AttributeName rmAttributeName)
   {
	  /*CBoolean(boolean trueValid, boolean falseValid, 
		        boolean assumedValue, boolean hasAssumedValue,
		        boolean defaultValue, boolean hasDefaultValue)
       */
	 /* CPrimitiveObject(String path, Interval<Integer> occurrences,
				String nodeId, CAttribute parent, CPrimitive item)
	  */
	 
	  CAttribute aimAttr = getAttribute(path,rmAttributeName);
	  
	  
	  CPrimitiveObject  bool =new CPrimitiveObject(aimAttr.path(),
			                                       new Interval<Integer>(1,1),
			                                       null,
			                                       aimAttr,
			                                       new CBoolean(true,true)
	                                               );
	  addChildToAttribute(aimAttr, bool);
   }

  //默认的添加CBoolean类型主节点---------需要创建类型对象CPrimitiveObject(...CBoolean)
  void addBooleanElement(String path,AttributeName rmAttributeName)
   {
	CAttribute attr= getAttribute(path,rmAttributeName);
    CAttribute aimAttr = addAttribute(addElement(attr,ReferenceModelName.DV_BOOLEAN),AttributeName.ELEMENT_VALUE);
    
    CPrimitiveObject obj = new CPrimitiveObject(aimAttr.path(),
                                                new Interval<Integer>(1,1),
                                                null,
                                                aimAttr,
                                                new CBoolean(true,true));  
    addChildToAttribute(aimAttr, obj);
		                     
   }
 
  //默认添加C_DV_QUANTITY类型主节点-----需要创建类型对象CDvQuantity
  void addQuantityElement(String path,AttributeName rmAttributeName)
  {
	  /*CDvQuantity(path, occurrences,List<CDvQuantityItem> list);*/
	  CAttribute attr= getAttribute(path,rmAttributeName);
	  CAttribute aimAttr = addAttribute(addNodeWithNodeId(attr,ReferenceModelName.ELEMENT),AttributeName.ELEMENT_VALUE);
	  
	  CDvQuantity obj =  new CDvQuantity(aimAttr.path(),new Interval<Integer>(1,1),null);
	  addChildToAttribute(aimAttr, obj); 
  }
  
  //默认添加C_DV_ORDINARY类型主节点-----需要创建类型对象 CDvOrdinal
  void addOrdinayElement(String path,AttributeName rmAttributeName)
  {
	  CAttribute attr= getAttribute(path,rmAttributeName);
	  CAttribute aimAttr = addAttribute(addNodeWithNodeId(attr,ReferenceModelName.ELEMENT),AttributeName.ELEMENT_VALUE);
	  CDvOrdinal obj = new CDvOrdinal(aimAttr.path(),new Interval<Integer>(1,1), null);
	  addChildToAttribute(aimAttr, obj); 
  }

  //默认添加MultiMedia类型主节点-------需要创建类型对象CCodePhrase
  void addMultimediaElement(String path,AttributeName rmAttributeName)
  {
	  CAttribute attr = getAttribute(path,rmAttributeName);
	  CAttribute mediaTypeAttr =  addAttribute(addElement(attr,ReferenceModelName.DV_MULTIMEDIA),AttributeName.MULTIMEDIA_MEDIA_TYPE);
	  CCodePhrase obj =  new CCodePhrase(mediaTypeAttr.path(),"openEHR",null);
	  addChildToAttribute(attr, obj); 
  }
 
  //默认添加Slot类型主节点，其子类型又分为element，cluster，Iterm三种类型--需要创建类型对象ArchetypeSlot
  ArchetypeSlot addSlotElement(String path,AttributeName rmAttributeName,ReferenceModelName rmName)
  {
	 /* public ArchetypeSlot(String path, String rmTypeName,
              Interval<Integer> occurrences,
              String nodeID, CAttribute parent,
              Set<Assertion> includes, Set<Assertion> excludes) 
              */
	  CAttribute aimAttr =  getAttribute(path,rmAttributeName);
	  String nextCode = ontology.getNextCode(Language.LANGUAGE_EN,TermOrConstraint.TERMDEFINE);
      ArchetypeSlot slot = new ArchetypeSlot(aimAttr.path()+"["+nextCode+"]",
                                             rmName.toString(),
                                             new Interval<Integer>(0,1),
                                             nextCode,
                                             aimAttr,
                                             null,null
                                              );
      addChildToAttribute(aimAttr,slot);
      
	  arc.getOntology().upDateDefinitionList(Language.LANGUAGE_EN,
			                    new ArchetypeTerm(slot.getNodeId(),"New "+ rmName.toString().toLowerCase(),"*"),
			                    TermOrConstraint.TERMDEFINE);
	  return slot;
  }
 
  //默认添加Any类型主节点 ----不需要创建类型对象
  void addAnyElement(String path,AttributeName rmAttributeName)
  {
	  CAttribute attr = getAttribute(path,rmAttributeName);
	  addNodeWithNodeId(attr,ReferenceModelName.ELEMENT);
  }
 
  //默认添加Choice类型主节点---不需要创建类型对象
  void addChoiceElement(String path,AttributeName rmAttributeName)
  {
	  CAttribute attr = getAttribute(path,rmAttributeName);
	  addAttribute(addNodeWithNodeId(attr,ReferenceModelName.ELEMENT),AttributeName.ELEMENT_VALUE);
  }
 
  //默认添加UILResourceIdentifier类型对象--不需要创建类型对象
  void addUILResourceIdentifierElement(String path,AttributeName rmAttributeName)
  {
	 CAttribute aimAttr =  getAttribute(path,rmAttributeName);
	 addElement(aimAttr,ReferenceModelName.DV_URI); 
  }
 
  //默认添加Proportion类型主节点------不需要创建类型对象
  void addProportionElement(String path,AttributeName rmAttributeName)
  {
	  CAttribute aimAttr =  getAttribute(path,rmAttributeName);
	  addElement(aimAttr,ReferenceModelName.DV_PROPORTION); 
  }
  
  //默认添加Identifier类型主节点 -----不需要创建类型对象
  void addIdentifierElement(String path,AttributeName rmAttributeName)
  {
	  CAttribute aimAttr =  getAttribute(path,rmAttributeName);
	  addElement(aimAttr,ReferenceModelName.DV_IDENTIFIER); 
  }
  //默认添加Parseable类型主节点 -----不需要创建类型对象
  void addParseableElement(String path, AttributeName rmAttributeName)
  {
	  CAttribute aimAttr =  getAttribute(path,rmAttributeName);
	  addElement(aimAttr,ReferenceModelName.DV_PARSEABLE); 
  }
  
  //默认添加INTERVAL类型主节点----------分为三种子类型
  void addIntervalElement_Integer(String path,AttributeName rmAttributeName)
  {
    CAttribute attr= getAttribute(path,rmAttributeName);
	CComplexObject obj = addElement(attr, ReferenceModelName.DV_INTERVAL_DV_COUNT);
	addNodeWithoutNodeId(addAttribute(obj,AttributeName.INTERVAL_UPPER),ReferenceModelName.DV_COUNT);
	addNodeWithoutNodeId(addAttribute(obj,AttributeName.INTERVAL_LOWER),ReferenceModelName.DV_COUNT);  	  
  }
  void addIntervalElement_Qauntity(String path,AttributeName rmAttributeName)
  {
	  CAttribute attr= getAttribute(path,rmAttributeName);
	  CComplexObject obj = addElement(attr, ReferenceModelName.DV_INTERVAL_DV_QUANTITY);
	  CAttribute attr1 = addAttribute(obj,AttributeName.INTERVAL_UPPER);
	  attr1.addChild(new CDvQuantity(attr1.path(),new Interval<Integer>(1,1),null));  
	  CAttribute attr2 = addAttribute(obj,AttributeName.INTERVAL_LOWER);
	  attr2.addChild(new CDvQuantity(attr2.path(),new Interval<Integer>(1,1),null)); 
  }
  void addIntervalElement_DateOrTime(String path,AttributeName rmAttributeName)
  {
	  CAttribute attr= getAttribute(path,rmAttributeName);
	  CComplexObject obj = addElement(attr, ReferenceModelName.DV_INTERVAL_DV_DATE_TIME);
	  addNodeWithoutNodeId(addAttribute(obj,AttributeName.INTERVAL_UPPER),ReferenceModelName.DV_DATE_TIME);
	  addNodeWithoutNodeId(addAttribute(obj,AttributeName.INTERVAL_LOWER),ReferenceModelName.DV_DATE_TIME);  
  }
//-------------------------------默认添加操作end----------------------------------------------- 
  
  
  
  
  
  
  //---------------------------删除操作--------------------------------------------------
 //删除节点
  void deleteElement(String path)
  {
     CObject obj = arc.getPathNodeMap().get(path);
	 obj.getParent().removeChild(obj);
	 //原型中的map是否需要同步？？，如果不同步，再次添加此路径的节点会更新旧映射对，只有在没有新添加节点情况下访问
	 //旧路径会造成无用操作，或返回错误结果
  }
  //--------------------------删除操作end------------------------------------------------
  
  
  
  
  
  
 //----------------------------------------修改操作-------------------------------------
 
  //*************对TEXT节点的操作****************

  
  //在对一些节点的属性进行修改的时候会涉及到添加一些引用Term的修改，添加与删除
  /*修改上部通用部分的description以及添加新的Annotation以及添加Terminology
   * */
  void updateArchetypeTerm(String path,String key,String value,TermOrConstraint t)
  {
	String nodeId = arc.getPathNodeMap().get(path).getNodeId();
	if(nodeId == null )throw new IllegalArgumentException("there is not a nodeId in the node with the path:"+path);
	arc.getOntology().updateArchetypeTerm(nodeId, key,value,Language.LANGUAGE_EN,t);  
  }
  
  /* Text节点操作辅助方法
   * path:DV_TEXT node path
   * 功能描述：在Text默认添加后子节点的类型为DV_TEXT，而在修改到internalCodes或terminology选项后
   * 子节点的类型将变成DV_CODE_TEXT，此方法实现这一功能
   */
  CAttribute forTextModify(String path)
  {
	  CComplexObject obj = (CComplexObject)arc.getPathNodeMap().get(path);
	  CAttribute attr = obj.getParent();
      attr.removeChild(obj);
	  return addAttribute( addNodeWithoutNodeId(attr,ReferenceModelName.DV_CODED_TEXT),AttributeName.DEFINING_CODE);
  }
  //InternalCodes选项选中（默认情况下） 处理函数
  void textElementToInternalCode(String path)
  {
	
	 CAttribute attr1 =  forTextModify(path);
	/* CCodePhrase(String path, Interval<Integer> occurrences,
				String nodeID, CAttribute parent, TerminologyID terminologyId, 
				List<String> codeList, CodePhrase defaultValue, 
				CodePhrase assumedValue)*/
	addChildToAttribute(attr1,new CCodePhrase(attr1.path(),
                                              new Interval<Integer>(1,1),
                                              null,
                                              attr1,
                                              new TerminologyID("local"),
                                              null,
                                              null,
                                              null));	 
  }
 //Terminology选项选中（默认情况下）处理函数
  void textElmentToTerminology(String path)
  {
	  CAttribute attr1 =  forTextModify(path);
	/*  ConstraintRef(String path, String rmTypeName,
	            Interval<Integer> occurrences, String nodeId, CAttribute parent, 
	            String reference)*/
	  String nextReference = ontology.getNextCode(Language.LANGUAGE_EN,TermOrConstraint.CONSTRAINTDEFINE);
	  ConstraintRef constraintRef = new ConstraintRef(attr1.path(),
                                                     "CODE_PHRASE",
                                                      new Interval<Integer>(1,1),
                                                      null,
                                                      attr1,
                                                      nextReference);
	  addChildToAttribute(attr1,constraintRef);
	  arc.getOntology().upDateDefinitionList(Language.LANGUAGE_EN,
                               new ArchetypeTerm(constraintRef.getReference(),"",""),
                               TermOrConstraint.CONSTRAINTDEFINE);
  }
  
  void updateConstraintBinding(String path,String terminology, String query, String release)
  {
	  ConstraintRef  obj = (ConstraintRef)arc.getPathNodeMap().get(path);
	  String reference = obj.getReference();
	  arc.getOntology().updateBinding(reference, terminology, query, release, TermOrConstraint.CONSTRAINTBIND);
  }
  
  void updateTermBinding(String path,String terminology, String query, String release)
  {
	  CObject obj = arc.getPathNodeMap().get(path);
	  String code = obj.getNodeId();
	  arc.getOntology().updateBinding(code, terminology, query, release, TermOrConstraint.TERMBIND);
  }
  //**************对TEXT节点操作end*********************

  
//**********************对Quantity节点进行操作*******************************
  void quantityProperty(String path,String terminologyId,String codeString)
  {
     CDvQuantity  cDvQuantity = (CDvQuantity) arc.getPathNodeMap().get(path);
     cDvQuantity.setProperty(new CodePhrase(terminologyId,codeString));        	 
  }
  void quantityList(String path,String unit)
  {
	  CDvQuantity  cDvQuantity = (CDvQuantity) arc.getPathNodeMap().get(path);
	  cDvQuantity.addItem(new CDvQuantityItem(null,unit));
  }
  
  void quantityListInterval(String path,Integer number,Double lower,Boolean lowerInclusive,
		                    Double upper,Boolean upperInclusive,Double assumeValue,Integer precision)
  {    
	  CDvQuantity  cDvQuantity = (CDvQuantity) arc.getPathNodeMap().get(path);
	  CDvQuantityItem item  =  cDvQuantity.getList().get(number);
	  item.setMagnitude(new Interval<Double>(lower,upper,lowerInclusive,upperInclusive));
	  item.setPrecision(new Interval<Integer>(precision,precision));
  }
//********************************对Quantity操作end*******************************************************

  
  
//*********************************对Count类型操作**************************************************
  //由于默认状态下并没用创建DV_COUNT对象，所以这里的path为上层的DV_COUNTY节点的路径
  //为了保持统一性，在多次调用情况下（即已经存在对象节点）我们仍传递一个DV_COUNT的路径
  //这也是基于Count类型只是单一个类型这一事实  
  //这里添加的类型为CprimitiveObject类型
 void CountElementOperate(String path,Double lower,Boolean lowerInclusive,
		                  Double upper,Boolean upperInclusive,Double assumedValue)
 {
	// Interval<Integer> count = (Interval<Integer>)arc.getPathNodeMap().get(path+"/"+AttributeName.INTERVAL_MAGNITUDE);
	/* CPrimitiveObject(String path, Interval<Integer> occurrences,
				String nodeId, CAttribute parent, CPrimitive item)*/
	 CPrimitiveObject obj =  (CPrimitiveObject) arc.getPathNodeMap().get(path+"/value/"+AttributeName.INTERVAL_MAGNITUDE);
	 if(obj == null)//首次修改，先创建一个名为magnitude的属性节点，再在其下添加一个基于CReal的CPrimitiveObject
	 {  
		 CAttribute attr = addAttribute((CComplexObject)arc.getPathNodeMap().get(path),AttributeName.INTERVAL_MAGNITUDE);
		 CPrimitiveObject aimObj = new  CPrimitiveObject(path, new Interval<Integer>(1,1),null, attr,
				                      new CReal(new Interval<Double>(lower,upper,true,true),null,assumedValue,null));
		 addChildToAttribute(attr,aimObj); 
	 }
	 else//非首次添加，只需修改CPrimitiveObject下面的Creal或者移除已经存在的CPrimitiveObject，在新建一个并添加
	 {
		 obj.setItem(new CReal(new Interval<Double>(lower,upper,true,true),null,assumedValue));
	 }
	 
 }
  




















}



