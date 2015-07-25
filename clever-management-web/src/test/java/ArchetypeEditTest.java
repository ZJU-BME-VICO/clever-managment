
//import Language;

//import Language;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedList;
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
//import org.openehr.am.archetype.ontology.TermCode; 
import org.openehr.am.openehrprofile.datatypes.quantity.CDvOrdinal;
import org.openehr.am.openehrprofile.datatypes.quantity.CDvQuantity;
import org.openehr.am.openehrprofile.datatypes.quantity.CDvQuantityItem;
import org.openehr.am.openehrprofile.datatypes.text.CCodePhrase;
import 	org.openehr.am.serialize.*;
import org.openehr.rm.support.basic.Interval;
import org.openehr.rm.support.identification.TerminologyID;
//import org.openehr.rm.datatypes.basic.ReferenceModelName;
import org.openehr.rm.datatypes.quantity.DvQuantity;
import org.openehr.rm.datatypes.text.CodePhrase;
import  org.openehr.am.archetype.ontology.*;
public class ArchetypeEditTest {

		
		private Archetype arc;
		
		
		public ArchetypeEditTest(Archetype arc)
		{
			this.arc = arc;
		}
		
		//+++++++++++++++++++复  制  区+++++++++++++++++++++++++++++++++++++++++++++++
		//----------------------辅助方法------------------------------------
		//获得path路径下的AttributeName为 rmAttributeName的CAttribute节点      
		 private CAttribute getAttribute(String path,String rmAttributeName)
		 {
		     CComplexObject obj =  (CComplexObject)( arc.getPathNodeMap().get(path));
			 return obj.getAttribute(rmAttributeName.toString());
				  
		 }

		//为Attribute节点添加CObject类型子节点--主要功能：添加子节点，更新MAP
	  private void  addChildToAttribute(CAttribute attribute,CObject obj)
		{
		    attribute.addChild(obj);
		    arc.updatePathNodeMapRecursively(obj);
			arc.updateNodeIdPathMap(obj);
			
		    
		}
		 
		//为一个CComplexObject添加Attribute，名称为rmAttributeName
	  private CAttribute addAttribute(CComplexObject obj,String rmAttributeName)
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
	  private CComplexObject  addNodeWithNodeId(CAttribute attribute,ReferenceModelName referModelName)
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
			 //  TermCode(List<OntologyDefinitions> definitonList,String language,OntologySubtype ontologySubType,String baseCode)
			 TermCode termCode = new TermCode(arc.getOntology().getTermDefinitionsList(),Language.LANGUAGE_EN,OntologySubtype.TERMDEFINE,null);
			 String nextCode  = termCode.getNextCode();
		     // String nextCode = ontology.getNextCode(Language.LANGUAGE_EN,OntologySubtype.TERMDEFINE,"at0005.7");
		     
			  CComplexObject object =  new CComplexObject(attribute.path()+"["+nextCode+"]",
					                                        referModelName.toString(),//getname
		                                                    new Interval(0,1),
		                                                    nextCode,
		                                                    null,
		                                                    null);
			  addChildToAttribute(attribute,object);
			  arc.getOntology().updateDefinitionList(Language.LANGUAGE_EN,object.getNodeId(),
					                                "New "+ referModelName.toString().toLowerCase(),
					                                "*", OntologySubtype.TERMDEFINE);
			  return object;
		  }

		//添加一个不具有NodeId的，且referenceModelName为**的CComplexObject到Attribute节点上
	  private CComplexObject  addNodeWithoutNodeId(CAttribute attribute,ReferenceModelName referModelName)
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
	  private CComplexObject inclassAddElement(CAttribute attribute,ReferenceModelName rferenceModelName)//default
		  {   
			  return addNodeWithoutNodeId(addAttribute(addNodeWithNodeId(attribute,ReferenceModelName.ELEMENT),AttributeName.ELEMENT_VALUE.toString()),rferenceModelName); 
		  }

		//仅有字符串参数的添加子类型到Attribute的方法，----备用
	  private void addBadeDataTypeToAttribute(String path,String attrName, CObject obj)
		{
			 CAttribute aimAttr = getAttribute(path,attrName);
			 addChildToAttribute(aimAttr,obj);
		}
		//------------------------------辅助方法end--------------------------------------------------
		  
		  



		//--------------------------------默认添加操作-----------------------------------------------------
		  //添加一个Cluster类型节点，默认底部为空
		public void addCluster(String path,String rmAttributeName)//default
		   {   
			   CAttribute attribute = getAttribute(path,rmAttributeName);
		       addNodeWithNodeId(attribute,ReferenceModelName.CLUSTER); 
		   }
		   
		  //添加默认状态的Boolean类型主节点-------待删除，，看还有没有用
		 public void addBoolean(String path,String rmAttributeName)
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
		  public void addBooleanElement(String path,String rmAttributeName)
		   {
			CAttribute attr= getAttribute(path,rmAttributeName);
		    CAttribute aimAttr = addAttribute(inclassAddElement(attr,ReferenceModelName.DV_BOOLEAN),AttributeName.ELEMENT_VALUE.toString());
		    
		    CPrimitiveObject obj = new CPrimitiveObject(aimAttr.path(),
		                                                new Interval<Integer>(1,1),
		                                                null,
		                                                aimAttr,
		                                                new CBoolean(true,true));  
		    addChildToAttribute(aimAttr, obj);
				                     
		   }
		 
		  //默认添加C_DV_QUANTITY类型主节点-----需要创建类型对象CDvQuantity
		  public void addQuantityElement(String path,String rmAttributeName)
		  {
			  /*CDvQuantity(path, occurrences,List<CDvQuantityItem> list);*/
			  CAttribute attr= getAttribute(path,rmAttributeName);
			  CAttribute aimAttr = addAttribute(addNodeWithNodeId(attr,ReferenceModelName.ELEMENT),AttributeName.ELEMENT_VALUE.toString());
			  
			  CDvQuantity obj =  new CDvQuantity(aimAttr.path(),new Interval<Integer>(1,1),null);
			  addChildToAttribute(aimAttr, obj); 
		  }
		  
		  //默认添加C_DV_ORDINARY类型主节点-----需要创建类型对象 CDvOrdinal
		  public void addOrdinayElement(String path,String rmAttributeName)
		  {
			  CAttribute attr= getAttribute(path,rmAttributeName);
			  CAttribute aimAttr = addAttribute(addNodeWithNodeId(attr,ReferenceModelName.ELEMENT),AttributeName.ELEMENT_VALUE.toString());
			  CDvOrdinal obj = new CDvOrdinal(aimAttr.path(),new Interval<Integer>(1,1), null);
			  addChildToAttribute(aimAttr, obj); 
		  }

		  //默认添加MultiMedia类型主节点-------需要创建类型对象CCodePhrase
		  public void addMultimediaElement(String path,String rmAttributeName)
		  {
			  CAttribute attr = getAttribute(path,rmAttributeName);
			  CAttribute mediaTypeAttr =  addAttribute(inclassAddElement(attr,ReferenceModelName.DV_MULTIMEDIA),AttributeName.MULTIMEDIA_MEDIA_TYPE.toString());
			  CCodePhrase obj =  new CCodePhrase(mediaTypeAttr.path(),"openEHR",null);
			  addChildToAttribute(attr, obj); 
		  }
		 
		  //默认添加Slot类型主节点，其子类型又分为element，cluster，Iterm三种类型--需要创建类型对象ArchetypeSlot
		  public ArchetypeSlot addSlotElement(String path,String rmAttributeName,ReferenceModelName rmName)
		  {
			 /* public ArchetypeSlot(String path, String rmTypeName,
		              Interval<Integer> occurrences,
		              String nodeID, CAttribute parent,
		              Set<Assertion> includes, Set<Assertion> excludes) 
		              */
			  CAttribute aimAttr =  getAttribute(path,rmAttributeName);
			//  String nextCode ="dfsg";// ontology.getNextCode(Language.LANGUAGE_EN,OntologySubtype.TERMDEFINE,null);
			  String nextCode = new TermCode(arc.getOntology().getTermDefinitionsList(),Language.LANGUAGE_EN,OntologySubtype.TERMDEFINE,null).getNextCode();
		      ArchetypeSlot slot = new ArchetypeSlot(aimAttr.path()+"["+nextCode+"]",
		                                             rmName.toString(),
		                                             new Interval<Integer>(0,1),
		                                             nextCode,
		                                             aimAttr,
		                                             null,null
		                                              );
		      addChildToAttribute(aimAttr,slot);
		      
			  arc.getOntology().updateDefinitionList(Language.LANGUAGE_EN,
					                    slot.getNodeId(),"New "+ rmName.toString().toLowerCase(),"*",
					                    OntologySubtype.TERMDEFINE);
			  return slot;
		  }
		 
		  //默认添加Any类型主节点 ----不需要创建类型对象
		  public void addAnyElement(String path,String rmAttributeName)
		  {
			  CAttribute attr = getAttribute(path,rmAttributeName);
			  addNodeWithNodeId(attr,ReferenceModelName.ELEMENT);
		  }
		 
		  //默认添加Choice类型主节点---不需要创建类型对象
		  public void addChoiceElement(String path,String rmAttributeName)
		  {
			  CAttribute attr = getAttribute(path,rmAttributeName);
			  addAttribute(addNodeWithNodeId(attr,ReferenceModelName.ELEMENT),AttributeName.ELEMENT_VALUE.toString());
		  }
		  
		  
		  
		  public  void addDateTime(String path, String rmAttributeName) {
				// TODO Auto-generated method stub
			  CAttribute aimAttr =  getAttribute(path,rmAttributeName);
			  inclassAddElement(aimAttr,ReferenceModelName.DV_DATE_TIME);
			}


		  public void addTextElement(String path ,String rmAttributeName)
		  {
			  System.out.println(path);
			  System.out.println(rmAttributeName);
			  CAttribute aimAttr =  getAttribute(path,rmAttributeName);
			  inclassAddElement(aimAttr,ReferenceModelName.DV_TEXT); 
		  }
		  //默认添加UILResourceIdentifier类型对象--不需要创建类型对象
		  public void addUILResourceIdentifierElement(String path,String rmAttributeName)
		  {
			 CAttribute aimAttr =  getAttribute(path,rmAttributeName);
			 inclassAddElement(aimAttr,ReferenceModelName.DV_URI); 
		  }
		 
		  //默认添加Proportion类型主节点------不需要创建类型对象
		  public void addProportionElement(String path,String rmAttributeName)
		  {
			  CAttribute aimAttr =  getAttribute(path,rmAttributeName);
			  inclassAddElement(aimAttr,ReferenceModelName.DV_PROPORTION); 
		  }
		  
		  //默认添加Identifier类型主节点 -----不需要创建类型对象
		  public void addIdentifierElement(String path,String rmAttributeName)
		  {
			  CAttribute aimAttr =  getAttribute(path,rmAttributeName);
			  inclassAddElement(aimAttr,ReferenceModelName.DV_IDENTIFIER); 
		  }
		  //默认添加Parseable类型主节点 -----不需要创建类型对象
		  public  void addParseableElement(String path, String rmAttributeName)
		  {
			  CAttribute aimAttr =  getAttribute(path,rmAttributeName);
			  inclassAddElement(aimAttr,ReferenceModelName.DV_PARSEABLE); 
		  }
		  
		  public void addCountElement(String path,String rmAttributeName)
		  {
			  CAttribute aimAttr =  getAttribute(path,rmAttributeName);
			  inclassAddElement(aimAttr,ReferenceModelName.DV_COUNT); 
		  }
		  
		  

		 public  void addDurationElement(String path, String rmAttributeName) {
				// TODO Auto-generated method stub
			   CAttribute aimAttr =  getAttribute(path,rmAttributeName);
			  inclassAddElement(aimAttr,ReferenceModelName.DV_DURATION); 
			}
		  //默认添加INTERVAL类型主节点----------分为三种子类型
		 public void addIntervalElement_Integer(String path,String rmAttributeName)
		  {
		    CAttribute attr= getAttribute(path,rmAttributeName);
			CComplexObject obj = inclassAddElement(attr, ReferenceModelName.DV_INTERVAL_DV_COUNT);
			addNodeWithoutNodeId(addAttribute(obj,AttributeName.INTERVAL_UPPER.toString()),ReferenceModelName.DV_COUNT);
			addNodeWithoutNodeId(addAttribute(obj,AttributeName.INTERVAL_LOWER.toString()),ReferenceModelName.DV_COUNT);  	  
		  }
		  public void addIntervalElement_Qauntity(String path,String rmAttributeName)
		  {
			  CAttribute attr= getAttribute(path,rmAttributeName);
			  CComplexObject obj = inclassAddElement(attr, ReferenceModelName.DV_INTERVAL_DV_QUANTITY);
			  CAttribute attr1 = addAttribute(obj,AttributeName.INTERVAL_UPPER.toString());
			  attr1.addChild(new CDvQuantity(attr1.path(),new Interval<Integer>(1,1),null));  
			  CAttribute attr2 = addAttribute(obj,AttributeName.INTERVAL_LOWER.toString());
			  attr2.addChild(new CDvQuantity(attr2.path(),new Interval<Integer>(1,1),null)); 
		  }
		  public void addIntervalElement_DateOrTime(String path,String rmAttributeName)
		  {
			  CAttribute attr= getAttribute(path,rmAttributeName);
			  CComplexObject obj = inclassAddElement(attr, ReferenceModelName.DV_INTERVAL_DV_DATE_TIME);
			  addNodeWithoutNodeId(addAttribute(obj,AttributeName.INTERVAL_UPPER.toString()),ReferenceModelName.DV_DATE_TIME);
			  addNodeWithoutNodeId(addAttribute(obj,AttributeName.INTERVAL_LOWER.toString()),ReferenceModelName.DV_DATE_TIME);  
		  }
		//-------------------------------默认添加操作end----------------------------------------------- 
		  
		  
		  
		  
		  
		  
		  //---------------------------删除操作--------------------------------------------------
		 //删除节点
		 public void deleteElement(String path)//delete all
		  {
			 System.out.println(path);
			 CObject obj = arc.getPathNodeMap().get(path);
			 System.out.println(obj);
			 
		   //  CObject obj = arc.getPathNodeMap().get(path);
		    // System.out.println(obj);
			 arc.removeChildRecursively(obj);
			 if(!(obj.getNodeId()==null))
			 arc.getOntology().removeFormList(obj.getNodeId(),OntologySubtype.TERMDEFINE);
		  }
		  
		 private void deleteElement(CComplexObject ccobj)//不删除节点的子节点，
		  {
			  ccobj.getParent().removeChild(ccobj);
			  if(!(ccobj.getNodeId()==null))
					 arc.getOntology().removeFormList(ccobj.getNodeId(),OntologySubtype.TERMDEFINE);
		  }
		  //--------------------------删除操作end------------------------------------------------
		  
		  
		  
		  
		  //上层的element的属性的修改
		  public void elementConstraintModify(String path,Interval<Integer> occurrence,String textName,String description)
		  {
			  CComplexObject cobj = (CComplexObject)arc.getPathNodeMap().get(path);
			  cobj.setOccurrences(occurrence);
			  String nodeId = cobj.getNodeId();
			  arc.getOntology().updateArchetypeTerm(nodeId, ArchetypeTerm.DESCRIPTION, description, Language.LANGUAGE_EN, OntologySubtype.TERMDEFINE);
			  arc.getOntology().updateArchetypeTerm(nodeId, ArchetypeTerm.TEXT, textName, Language.LANGUAGE_EN, OntologySubtype.TERMDEFINE);
		  }
		  
		 //----------------------------------------修改操作-------------------------------------
		 
		  //*************对TEXT节点的操作****************

		  
		  //在对一些节点的属性进行修改的时候会涉及到添加一些引用Term的修改，添加与删除
		  /*修改上部通用部分的description以及添加新的Annotation以及添加Terminology
		   * */
		  public void clearArchetypeTerm(String path)
		  {
			    String nodeId = arc.getPathNodeMap().get(path).getNodeId();
				if(nodeId == null )throw new IllegalArgumentException("there is not a nodeId in the node with the path:"+path);
				arc.getOntology().clearArchetypeTerm(nodeId, Language.LANGUAGE_EN, OntologySubtype.TERMDEFINE);
		  }
		  public void updateArchetypeTerm(String path,String key,String value,OntologySubtype t)
		  {
			String nodeId = arc.getPathNodeMap().get(path).getNodeId();
			if(nodeId == null )throw new IllegalArgumentException("there is not a nodeId in the node with the path:"+path);
			arc.getOntology().updateArchetypeTerm(nodeId, key,value,Language.LANGUAGE_EN,t);  
		  }
		  
		  //此函数通过nodeid来修改nodeid的ontology部分的内容，其中key为term中的名称如text，value为其值
		  public void updateArchetypeTermByNodeId(String nodeId,String key,String value,OntologySubtype subtype)
		  {
			  arc.getOntology().updateArchetypeTerm(nodeId, key, value, Language.LANGUAGE_EN, subtype);
		  }
		  
		 //为internalCode形式的text节点添加termDefinition。
		  //这里的path为底层的/element/value/defining_code/
		  public void addTermForText(String path,String text,String description,OntologySubtype t)
		  {   
			  CObject cobj = arc.getPathNodeMap().get(path);
			  CCodePhrase cpObj = (CCodePhrase)(cobj);
			 
			  String nextCode = new TermCode(arc.getOntology().getTermDefinitionsList(),Language.LANGUAGE_EN,OntologySubtype.TERMDEFINE,null).getNextCode();
			  arc.getOntology().updateDefinitionList(Language.LANGUAGE_EN,nextCode,text, description, t);
			  cpObj.addToCodeList(nextCode);	  
		  }
		  /* Text节点操作辅助方法
		   * path:DV_TEXT node path
		   * 功能描述：在Text默认添加后子节点的类型为DV_TEXT，而在修改到internalCodes或terminology选项后
		   * 子节点的类型将变成DV_CODE_TEXT，此方法实现这一功能
		   */
		  public CAttribute forTextModify(String path)
		  {
			  CComplexObject obj = (CComplexObject)arc.getPathNodeMap().get(path);
			  CAttribute attr = obj.getParent();
		      deleteElement(path);
			  return addAttribute( addNodeWithoutNodeId(attr,ReferenceModelName.DV_CODED_TEXT),AttributeName.DEFINING_CODE.toString());
		  }
		  //InternalCodes选项选中（默认情况下） 处理函数
		  public void textElementToInternalCode(String path)
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
		  public void textElementToTerminology(String path)
		  {
			  CAttribute attr1 =  forTextModify(path);
			/*  ConstraintRef(String path, String rmTypeName,
			            Interval<Integer> occurrences, String nodeId, CAttribute parent, 
			            String reference)*/
			 // String nextReference ="dsfg";// ontology.getNextCode(Language.LANGUAGE_EN,OntologySubtype.CONSTRAINTDEFINE,null);
			  String nextReference = new TermCode(arc.getOntology().getConstraintDefinitionsList(),Language.LANGUAGE_EN,OntologySubtype.CONSTRAINTDEFINE,null).getNextCode();
			  ConstraintRef constraintRef = new ConstraintRef(attr1.path(),
		                                                     "CODE_PHRASE",
		                                                      new Interval<Integer>(1,1),
		                                                      null,
		                                                      attr1,
		                                                      nextReference);
			  addChildToAttribute(attr1,constraintRef);
			  arc.getOntology().updateDefinitionList(Language.LANGUAGE_EN,
		                               constraintRef.getReference(),"","",
		                               OntologySubtype.CONSTRAINTDEFINE);
		  }
		
		  
		  
		  public void updateConstraintDefinitionForText(String path, String key, String value)
		  {
			

			  ConstraintRef constraintRef = (ConstraintRef)arc.getPathNodeMap().get(path);
			  arc.getOntology().updateArchetypeTerm(constraintRef.getReference(),key,value,Language.LANGUAGE_EN,OntologySubtype.CONSTRAINTDEFINE); 
			  
		  }
		  public void updateConstraintBinding(String path,String terminology, String query, String release)
		  {
			  ConstraintRef  obj = (ConstraintRef)arc.getPathNodeMap().get(path);
			  String reference = obj.getReference();
			  arc.getOntology().updateBinding(reference, terminology, query, release, OntologySubtype.CONSTRAINTBIND);
		  }
		  
		  public void updateTermBinding(String path,String terminology, String query, String release)
		  {
			  CObject obj = arc.getPathNodeMap().get(path);
			  String code = obj.getNodeId();
			  arc.getOntology().updateBinding(code, terminology, query, release, OntologySubtype.TERMBIND);
		  }
		  
		  public void clearConstraintBinding(String path)
		  {
			  ConstraintRef  obj = (ConstraintRef)arc.getPathNodeMap().get(path);
			  String reference = obj.getReference();
			  arc.getOntology().clearBinding(reference,OntologySubtype.CONSTRAINTBIND);
		  }
		  

		  //**************对TEXT节点操作end*********************

		  
		//**********************对Quantity节点进行操作*******************************
		  public void quantityProperty(String path,String terminologyId,String codeString)
		  {
		     CDvQuantity  cDvQuantity = (CDvQuantity) arc.getPathNodeMap().get(path);
		     cDvQuantity.setProperty(new CodePhrase(terminologyId,codeString));        	 
		  }
		  public void quantityList(String path,String unit)
		  {
			  CDvQuantity  cDvQuantity = (CDvQuantity) arc.getPathNodeMap().get(path);
			  cDvQuantity.addItem(new CDvQuantityItem(null,unit));
		  }
		  
		  public void quantityListInterval(String path,Integer number,Double lower,Boolean lowerInclusive,
				                    Double upper,Boolean upperInclusive,Double assumedValue,Integer precision)
		  {    
			  CDvQuantity  cDvQuantity = (CDvQuantity) arc.getPathNodeMap().get(path);
			  CDvQuantityItem item  =  cDvQuantity.getList().get(number);
			  
			  

			  item.setMagnitude(new Interval<Double>(lower,upper,lowerInclusive,upperInclusive));
			  item.setPrecision(new Interval<Integer>(precision,precision));
			  //assumedValue的输出需要创建新的一个 DvQuantity
			  //如果前台选中assumedvalue选项，说明这里的unit也是默认的assumedValue，这个unit由number来指定
			 /* this.magnitude = magnitude;
		      this.precision = precision;
		      this.measurementService = measurementService;
		      this.units = units;*/
			  /*CDvQuantity(path(), getOccurrences(), getNodeId(), 
						getParent(), list,	property, getDefaultValue(), 
						getAssumedValue());*/
			  if(assumedValue!=null){
			    DvQuantity assumed = new DvQuantity(item.getUnits(),assumedValue,precision,null);
			    CDvQuantity newCDvQuantity = cDvQuantity.copyWithoutAssumedValue(assumed);
			  
			    addChildToAttribute(cDvQuantity.getParent(),newCDvQuantity);
			    cDvQuantity.getParent().removeChild(cDvQuantity);
			  }
			  
			  
			  
		  }
		//********************************对Quantity操作end*******************************************************

		  
		  
		//*********************************对Count类型操作**************************************************
		  //由于默认状态下并没用创建DV_COUNT对象，所以这里的path为上层的DV_COUNTY节点的路径
		  //为了保持统一性，在多次调用情况下（即已经存在对象节点）我们仍传递一个DV_COUNT的路径
		  //这也是基于Count类型只是单一个类型这一事实  
		  //这里添加的类型为CprimitiveObject类型
		 public void CountElementOperate(String path,Double lower,Boolean lowerInclusive,
				                  Double upper,Boolean upperInclusive,Double assumedValue)
		 {
			// Interval<Integer> count = (Interval<Integer>)arc.getPathNodeMap().get(path+"/"+AttributeName.INTERVAL_MAGNITUDE);
			/* CPrimitiveObject(String path, Interval<Integer> occurrences,
						String nodeId, CAttribute parent, CPrimitive item)*/
			 CPrimitiveObject obj =  (CPrimitiveObject) arc.getPathNodeMap().get(path+"/value/"+AttributeName.INTERVAL_MAGNITUDE);
			 if(obj == null)//首次修改，先创建一个名为magnitude的属性节点，再在其下添加一个基于CReal的CPrimitiveObject
			 {  
				 CAttribute attr = addAttribute((CComplexObject)arc.getPathNodeMap().get(path),AttributeName.INTERVAL_MAGNITUDE.toString());
				 CPrimitiveObject aimObj = new  CPrimitiveObject(path, new Interval<Integer>(1,1),null, attr,
						                      new CReal(new Interval<Double>(lower,upper,true,true),null,assumedValue,null));
				 addChildToAttribute(attr,aimObj); 
			 }
			 else//非首次添加，只需修改CPrimitiveObject下面的Creal或者移除已经存在的CPrimitiveObject，在新建一个并添加
			 {
				 obj.setItem(new CReal(new Interval<Double>(lower,upper,true,true),null,assumedValue));
			 }
			
		 }
		 //********************************count操作结束**********************************
	 
	 
		 
		 
		 
		 
		 
		 
		 
		 
		 
		 //最顶层的操作
		public void toList(String path)
		 {
			
			
			/*CComplexObject(String path, String rmTypeName,
	                Interval<Integer> occurrences, String nodeID, 
	                List<CAttribute> attributes, CAttribute parent) {*/
			
			CObject cobj = arc.getPathNodeMap().get(path);
			
			CComplexObject ccobj ;
			if(cobj instanceof CComplexObject)
			{
			  ccobj = (CComplexObject)cobj;
			}
			else throw new IllegalArgumentException("can not find a CComplexObject in this path,please check your path is a top path");
			
			
			CComplexObject itemList;
			if(ccobj.getRmTypeName().equals(ReferenceModelName.ITEM_LIST.toString()))return;
			else{
				//删除原来的item顶层节点
				 deleteElement(ccobj);
				 
				//创建一个新的item顶层节点 
				 itemList = new CComplexObject(path,ReferenceModelName.ITEM_LIST.toString(),ccobj.getOccurrences(),ccobj.getNodeId(),new LinkedList<CAttribute>(),ccobj.getParent());
				 ccobj.getParent().addChild(itemList);
				 arc.getOntology().updateDefinitionList(Language.LANGUAGE_EN,itemList.getNodeId(),
						                               "List",
						                                "@internal@", OntologySubtype.TERMDEFINE);
			}
			
			//List<CAttribute> tempAttributes = new LinkedList<CAttribute>();
			for(CAttribute attr : ccobj.getAttributes())
			{
			    for(CObject tempCobj : attr.getChildren())
			    {
			    	if(tempCobj.getRmTypeName().equals(ReferenceModelName.CLUSTER))
			    		attr.removeChild(tempCobj);
			    }   
			    itemList.addAttribute(attr);
			}
			
			arc.updatePathRecursively(itemList,ccobj.getRmTypeName(),ReferenceModelName.ITEM_LIST.toString());
		 }
	 
		
		public void toTree(String path)
		{
		   CObject cobj = arc.getPathNodeMap().get(path);
			
			CComplexObject ccobj ;
			if(cobj instanceof CComplexObject)
			{
			  ccobj = (CComplexObject)cobj;
			}
			else throw new IllegalArgumentException("can not find a CComplexObject in this path,please check your path is a top path");
			
			
			CComplexObject itemTree;
			if(ccobj.getRmTypeName().equals(ReferenceModelName.ITEM_LIST.toString()))return;
			else{
				//删除原来的item顶层节点
				 deleteElement(ccobj);
				 
				//创建一个新的item顶层节点 
				 itemTree = new CComplexObject(path,ReferenceModelName.ITEM_LIST.toString(),ccobj.getOccurrences(),ccobj.getNodeId(),new LinkedList<CAttribute>(),ccobj.getParent());
				 ccobj.getParent().addChild(itemTree);
				 arc.getOntology().updateDefinitionList(Language.LANGUAGE_EN,itemTree.getNodeId(),
						                               "Tree",
						                                "@internal@", OntologySubtype.TERMDEFINE);
			}
			
			//List<CAttribute> tempAttributes = new LinkedList<CAttribute>();
			for(CAttribute attr : ccobj.getAttributes())
			{
			    itemTree.addAttribute(attr);
			}
			
			arc.updatePathRecursively(itemTree,ccobj.getRmTypeName(),ReferenceModelName.ITEM_TREE.toString());
		}
	 
	    public void changeStructure(String path,String nowStructure)
	    {
	    	switch(nowStructure)
	    	{
	    	case "ITEM_TREE":
	    		toTree(path);
	    		break;
	    	case "ITEM_LIST":
	    		toList(path);
	    		break;
	    	default:
	    		break;	
	    	}
	    }
		
		
	//Header 部分的concept和description的修改
		/*public void HeaderEdit(String concept,String description)
		{
			//Archetype 内部的变量设置为final不能进行修改
		}*/

		//顶层节点Attribute的属性的修改：ordered， Cardinality
		//只有MultiAttribute才存在Cardinality
	
	    
	    public void setCardinality(String path,String attributeName,Boolean ordered,Boolean unique,Interval<Integer> interval)
		{
			Cardinality cardinality = new Cardinality(ordered,unique,interval);		
			//CAttribute attr = arc.getPathNodeMap().get(path).getParent();
			CAttribute attr = getAttribute(path,attributeName);
			
			if(attr instanceof CMultipleAttribute)
			{
				CMultipleAttribute mulAttribute = (CMultipleAttribute)attr;
				mulAttribute.setCardinality(cardinality);
			}
			
			else{
				throw new IllegalArgumentException("the attibute identified by the path is not a CMultipleAttribute,the path must be wrong");
			}
			
			
		}

	  
		//CObject属性的修改Occurrence
		public void setOccurrence(String path,Interval<Integer> occurrences)
		{
			System.out.println("eidt occurrence start");
			CObject obj = arc.getPathNodeMap().get(path);
			System.out.println(obj.getRmTypeName());
			System.out.println(obj.getOccurrences());
			obj.setOccurrences(occurrences);
			System.out.println( arc.getPathNodeMap().get(path).getOccurrences());
		}
		
		//
	//+++++++++++++++++++++++++++++++++复  制  区++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	 
	 
	 

	 
	 
	 
	 
	 
	 
	 
	 //---------------------------------------方法封装------------------------------------------

     public void addElement(String path,String attributeName,String elementType)
     {
    	 
    	 switch(elementType)
    	 {
    	 case "DV_TEXT"://DV_TEXT
    		 addTextElement(path,attributeName);
    	     break;
    	 
    	 case "DV_BOOLEAN"://DV_BOOLEAN
    		 addBooleanElement(path,attributeName);
    		 
    	     break;
    	 case "DV_COUNT"://DV_COUNT
    		 addCountElement(path,attributeName);
    		 
    	     break;
    	 case "DV_QUANTITY"://DV_QUANTITY
    		 addQuantityElement(path,attributeName);
    	     break;
    	 
    	 case "DV_PROPORTION"://DV_PROPORTION
    		 addProportionElement(path,attributeName);
    	     break;
    	     
    	 case "DV_ORDINAL":
    		 addOrdinayElement(path,attributeName);
    		 break;
    		 
    	 case "DV_DATE_TIME":
    		 addDateTime(path,attributeName);
    		 break;
    		 
    	 case "DV_DURATION":
    		addDurationElement(path,attributeName);
    		break;
    		
    	 case "CLUSTER":
            addCluster(path,attributeName);    
            break;
            
    	 case "DV_INTERVAL_DV_COUNT":
    		 addIntervalElement_Integer(path,attributeName);
    		 break;
    	 case "DV_INTERVAL_DV_QUANTITY":
    		 addIntervalElement_Qauntity(path,attributeName);
    		 break;
    	 case "DV_INTERVAL_DV_DATE_TIME":
    		 addIntervalElement_DateOrTime(path,attributeName);
    		 break;
    	 case "DV_MULTIMEDIA":
    		 addMultimediaElement(path,attributeName);
    		 break;
    	 case "DV_URI":
    		 addUILResourceIdentifierElement(path,attributeName);
    		 break;
    	 case "DV_IDENTIFIER":
    		 addIdentifierElement(path,attributeName);
    		 break;
    	 case "DV_PARSEABLE":
    		 addParseableElement(path,attributeName);
    		 break;
    		
    		default:
    			break;
    			//throw new IllegalArgumentException("wrong ElementType");
    	 }
     }


	
















	}




