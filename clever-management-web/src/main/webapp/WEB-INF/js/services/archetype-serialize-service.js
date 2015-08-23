angular.module('clever.management.service.archetypeSerialize', []).service('archetypeSerializeService', function() {
	this.lineSeparator = "\r\n";
	this.adlOutput = "";
	this.indent = "    ";
	//4 white space characters
	var x2js = new X2JS();
	this.serializeArchetypeToXml = function(archetype){
		return x2js.json2xml_str(archetype);
	};
	this.serializeArchetype = function(archetype) {
		this.adlOutput = "";
		this.printHeader(archetype);
		this.newLine();
		this.printLanguage(archetype);
		this.newLine();
		if (archetype.description) {
			this.printDescription(archetype.description);
			this.newLine();
		}
		this.printDefinition(archetype.definition, archetype.ontology);
		this.newLine();
		this.printOntology(archetype.ontology);

		return this.adlOutput;
	};
	this.printHeader = function(archetype) {
		//this.write("this is header");
		this.write("archetype");
		if (archetype.adl_version || (archetype.uid && archetype.uid.length != 0)) {
			this.write(" (");
		}
		if (archetype.adl_version) {
			this.write("adl_version=");
			this.write(archetype.adl_version);
		}
		if (archetype.uid && uid.length != 0) {
			this.write("uid=");
			this.write(archetype.uid);
		}
		if (archetype.adl_version || (archetype.uid && archetype.uid.length != 0)) {
			this.write(")");
		}
		this.newLine();
		this.writeIndent(1);
		if (archetype.archetype_id) {
			this.write(archetype.archetype_id.value);
		} else {
			this.write("Archetype_id is null!!!!!!");
		}
		this.newLine();

		if (archetype.parent_archetype_id) {
			this.write("specialize");
			this.newLine();
			this.writeIndent(1);
			this.write(archetype.parent_archetype_id.value);
			this.newLine();
		}
		this.newLine();
		this.write("concept");
		this.newLine();
		this.writeIndent(1);
		this.write("[" + archetype.concept + "]");
		this.newLine();
	};
	this.printLanguage = function(archetype) {
		//this.write("this is language");
		this.write("language");
		this.newLine();
		this.writeIndent(1);
		this.write("original_language = <");
		this.write("[");
		this.write(archetype.original_language.terminology_id.value);
		this.write("::");
		this.write(archetype.original_language.code_string);
		this.write("]");
		this.write(">");
		this.newLine();
		if (archetype.translations) {
			this.writeIndent(1);
			this.write("translation = <");
			this.newLine();
			for (var i = 0, len = archetype.translations.length; i < len; i++) {
				var tr = archetype.translations[i];
				this.writeIndent(2);
				this.write("[\"");
				this.write(tr.language.code_string);
				this.write("\"] = <");
				this.newLine();

				this.writeIndent(3);
				this.write("language = <");
				this.write(tr.language.terminology_id.value);
				this.write("::");
				this.write(tr.language.code_string);
				this.write("]");
				this.write(">");
				this.newLine();

				this.writeIndent(3);
				this.write("author = <");
				this.newLine();
				this.printMapArray(tr.author, 4);
				this.writeIndent(3);
				this.write(">");
				this.newLine();

				if (tr.accreditation) {
					this.writeIndent(3);
					this.write("accreditation = <\"");
					this.write(tr.accreditation);
					this.write("\">");
					this.newLine();
				}

				if (tr.other_details) {
					this.writeIndent(3);
					this.write("other_details = <");
					this.newLine();
					this.printMapArray(tr.other_details, 4);
					this.writeIndent(3);
					this.write(">");

				}
				this.writeIndent(2);
				this.write(">");
				this.newLine();
			}
			this.writeIndent(1);
			this.write(">");
			this.newLine();
		}

	};
	this.printDescription = function(description) {
		//this.write('this is description');
		if (description == null) {
			return;
		}

		this.write("description");
		this.newLine();

		this.writeIndent(1);
		this.write("original_author = <");
		this.newLine();
		this.printMapArray(description.original_author, 2);
		this.writeIndent(1);
		this.write(">");
		this.newLine();

		this.writeIndent(1);
		this.write("lifecycle_state = <\"");
		this.write(description.lifecycle_state);
		this.write("\">");
		this.newLine();

		this.printNonEmptyString("resource_package_uri", description.resource_package_uri, 1);

		this.writeIndent(1);
		this.write("details = <");
		this.newLine();
		var self = this;
		if (angular.isArray(description.details)) {
			for (item in description.details) {
				self.printDescriptionItem(description.details[item], 2);
			}
		} else {
			self.printDescriptionItem(description.details);
		}
		this.writeIndent(1);
		this.write(">");
		this.newLine();

		this.writeIndent(1);
		this.write("other_details = <");
		this.newLine();
		if (description.other_details) {
			this.printMapArray(description.other_details, 2);
		}
		this.writeIndent(1);
		this.write(">");
		this.newLine();

	};
	this.printDefinition = function(definition, ontology) {
		//this.write('this is definition');
		this.write("definition");
		this.newLine();
		this.printCComplexObject(definition, 1, ontology);
	};

	this.printOntology = function(ontology) {
		//this.write('this is ontology');
		this.write("ontology");
		this.newLine();
		var self = this;
		// term definition section
		if (ontology.term_definitions) {
			self.writeIndent(1);
			self.write("term_definition = <");
			this.newLine();

			self.printDefinitionList(ontology.term_definitions);
			self.writeIndent(1);
			self.write(">");
			self.newLine();
		}
		//**constraint defintion section
		if (ontology.constraint_definitions) {
			self.writeIndent(1);
			self.wriet("constraint_definitions = <");
			self.newLine();
			self.printDefinitionList(ontology.constraint_definitions);
			self.writeIndent(1);
			self.write(">");
			self.newLine();
		}

		//---term binding section
		var term_bindingList = ontology.term_bindings;
		if (term_bindingList) {
			self.writeIndent(1);
			self.write("term_binding = <");
			self.newLine();

			if (angular.isArray(term_bindingList)) {
				var i;
				for ( i = 0; i < term_bindingList.length; i++) {
					this.printTermBinding(termBindingList[i]);
				}
			} else {//term binding is not a array
				this.printTermBinding(termBindingList);
			}
			self.write(1);
			self.write(">");
			self.newLine();
		}

		//-------constraint binding section------------------
		var constraint_bindingList = ontology.constraint_bindings;
		if (constraint_bindingList) {
			self.writeIndent(1);
			self.write("constraint_binding = <");
			self.newLine();

			if (angular.isArray(constraint_bindingList)) {
				var i;
				for ( i = 0; i < constraint_bindingList.length; i++) {
					self.printConstraintBinding(constraint_bindingList[i]);
				}
			} else {//is not a array
				self.printConstraintBinding(constraint_bindingList);
			}
			self.writeIndent(1);
			self.write(">");
			self.newLine();
		}

	};
	this.printConstraintBindingItem = function(bindingItem) {
		var self = this;
		self.writeIndent(4);
		self.write("[\"");
		self.write(bindingItem.code);
		self.write("\"] = <");
		self.write(bindingItem.value);
		self.write(">");
		self.newLine();
	};
	this.printConstraintBinding = function(constraint_binding) {
		var self = this;
		self.writeIndent(2);
		self.write("[\"");
		self.write(constraint_binding.terminology);
		self.write("\"] = <");
		self.newLine();
		self.writeIndent(3);
		self.write("items = <");
		self.newLine();

		if (angular.isArray(constrain_binding.items)) {
			var j;
			for ( j = 0; j < constraint_binding.items; j++) {
				self.printConstraintBindingItem(constraint_binding.items[j]);
			}
		} else {// is not a array
			self.printConstraintBindingItem(constraint_binding.items);
		}
		var n;
		for ( n = 3; n > 1; n--) {
			self.writeIndent(n);
			self.write(">");
			self.newLine();
		}
	};
	this.printTermBinding = function(termBinding) {
		var self = this;
		self.writeIndent(2);
		self.write("[\"");
		self.write(termBinding.terminology);
		self.write("\"] = <");
		self.newLine();
		self.writeIndent(3);
		self.write("items = <");
		self.newLine();
		var j;
		if (angular.isArray(termBinding.items)) {
			for ( j = 0; j < termBinding.items.length; j++) {
				self.printTermBindingItem(termBinding.items[j]);
			}
		} else {
			self.printTermBindingItem(termBinding.items);
		}
		var n;
		for ( n = 3; n > 1; n--) {
			self.writeIndent(l);
			self.write(">");
			self.newLine();
		}
	};
	this.printTermBindingItem = function(item) {
		var self = this;
		self.writeIndent(4);
		self.write("[\"");
		self.write(item.code);
		self.write("\"] = <[");
		self.write(item.value.terminology_id.value);
		self.write("::");
		self.write(item.value.code_string);

		self.write("]>");
		self.newLine();
	};

	this.printArchetypeTerm = function(archetypeTerm) {
		var self = this;
		self.writeIndent(4);
		self.write("[\"");
		self.write(archetypeTerm._code);
		self.write("\"] = <");
		self.newLine();
		angular.forEach(archetypeTerm.items, function(item) {
			self.writeIndent(5);
			self.write(item._id);
			self.write(" = <\"");
			self.write(item.__text.replace("\"", "\\\""));
			self.write("\">");
			self.newLine();
		});
		self.newLine();
		self.writeIndent(4);
		self.write(">");
		self.newLine();
	};

	this.print_definitions = function(definition) {
		var self = this;
		self.writeIndent(2);
		self.write("[\"");
		self.write(definition._language);
		self.write("\"] = <");
		self.newLine();
		self.writeIndent(3);
		self.write("items = <");
		self.newLine();

		if (definition.items) {
			if (angular.isArray(definition.items)) {//items is an array
				angular.forEach(definition.items, function(archetypeTerm) {
					self.printArchetypeTerm(archetypeTerm);
				});
			} else {//items is not an array, but an object
				var archetypeTerm = definition.items;
				self.printArchetypeTerm(archetypeItem);
			}
		}
		var l;
		for ( l = 3; l > 1; l--) {
			self.writeIndent(l);
			self.write(">");
			self.newLine();
		}
	};

	this.printDefinitionList = function(definitions) {
		var self = this;
		if (definitions) {
			if (angular.isArray(definitions)) {//definitions is an array
				angular.forEach(definitions, function(definition) {
					self.print_definitions(definition);
				});
			} else {//definitions is not an array
				self.print_definitions(definitions);
			};
		};

	};

	//auxiliary function
	this.printCComplexObject = function(ccobj, number, ontology) {//pass test
		if (ccobj) {
			var occurrences = ccobj.occurrences;
			var attributes = ccobj.attributes;
			if (occurrences && angular.equals("0", occurrences.lower) && angular.equals("0", occurrences.upper)) {
				return;
			}
			//print rmTypeName and NodeId
			this.writeIndent(number);
			this.write(ccobj.rm_type_name);
			if (ccobj.node_id) {
				this.write("[" + ccobj.node_id + "]");
			}

			this.printOccurrences(occurrences);

			this.write(" matches {");
			var self = this;
			if (ccobj.attributes) {
				if (ccobj.node_id) {
					this.printComment(ccobj.node_id, ontology);
				}
				if (angular.isArray(ccobj.attributes)) {
					angular.forEach(ccobj.attributes, function(attribute) {
						self.printCAttribute(attribute, number + 1, ontology);
					});
				} else {
					self.printCAttribute(ccobj.attributes, number + 1, ontology);
				}

				self.newLine();
				self.writeIndent(number);
				self.write("}");

			} else {
				self.write("*");
				self.write("}");
				self.printComment(ccobj.node_id, ontology);
			}

			this.newLine();

		} else {
			return;
		}
	};
	this.printCAttribute = function(attribute, number, ontology) {
		var self = this;
		self.newLine();
		self.writeIndent(number);
		self.write(attribute.rm_attribute_name);
		if (attribute.existence.lower != "1") {//not required
			self.write(" ");
		}
		self.printExistence(attribute.existence);
		if (attribute.cardinality) {
			self.write(" ");
			self.printCardinality(attribute.cardinality);
		}

		self.write(" matches {");
		var children = attribute.children;
		if (children) {

			if (angular.isArray(children)) {
				self.newLine();
				angular.forEach(children, function(cobject) {
					self.printCObject(cobject, number + 1, ontology);
				});
				this.writeIndent(number);
			} else {
				//self.newLine();
				if (children['_xsi:type'] == "C_PRIMITIVE_OBJECT") {
					self.printCPrimitiveObject(children);
				} else {
					self.newLine();
					self.printCObject(children, number + 1, ontology);
					self.writeIndent(number);
				}
			}
		} else {
			self.write("*");
		}
		self.write("}");
	};

	this.printCObject = function(cobject, number, ontology) {
		//for c_dv_domain_type
		if (cobject['_xsi:type'] == "C_DV_ORDINAL") {
			this.printCDvOrdinal(cobject, number);
		} else if (cobject['_xsi:type'] == "C_DV_QUANTITY") {
			this.printCDvQuantity(cobject, number);
		} else if (cobject['_xsi:type'] == "C_CODE_PHRASE") {
			this.printCCodePhrase(cobject, number, ontology);
		} else if (cobject['_xsi:type'] == "C_COMPLEX_OBJECT") {
			this.printCComplexObject(cobject, number, ontology);
		} else if (cobject['_xsi:type'] == "C_PRIMITIVE_OBJECT") {
			this.printCPrimitiveObject(cobject, number);
		} else if (cobject['_xsi:type'] == "ARCHETYPE_INTERNAL_REF") {
			this.printArchetypeInternalRef(cobject, number);
		} else if (cobject['_xsi:type'] == "CONSTRAINT_REF") {
			this.printConstraintRef(cobject, number);
		} else if (cobject['_xsi:type'] == "ARCHETYPE_SLOT") {
			this.printArchetypeSlot(cobject, number, ontology);
		}

	};

	this.printArchetypeInternalRef = function(ref, number) {
		this.writeIndent(number);
		this.write("use_node ");
		this.write(ref.rm_type_name);
		this.printOccurrences(ref.occurrences);
		this.write(" ");
		this.write(ref.target_path);
		this.newLine();
	};

	this.printConstraintRef = function(ref, number) {
		this.writeIndent(number);
		this.write("[");
		this.write(ref.reference);
		this.write("]");
		this.newLine();
	};
	this.printArchetypeSlot = function(slot, number, ontology) {
		if (slot) {
			this.writeIndent(number);
			this.write("allow_archetype ");
			this.write(slot.rm_type_name);
			if (slot.node_id) {
				this.write("[" + slot.node_id + "]");
			}
			this.printOccurrences(slot.occurrences);
			this.write(" matches {");

			//if((slot.includes==null||slot.includes==undefined)&&(slot.exsludes==null||slot.excludes=undefined))
			if (!slot.includes && !slot.excludes) {
				this.write("*}");
				this.printComment(slot.node_id, ontology);
			} else {
				this.printComment(slot.node_id, ontology);
				if (slot.includes) {
					this.printAssertions(slot.includes, "include", number);
				}
				if (slot.excludes) {
					this.printAssertions(slot.exclude, "exclude", number);
				}
				this.newLine();
				this.writeIndent(number);
				this.write("}");
			}
			this.newLine();
		}
	};

	this.printAssertions = function(assertions, purpose, number) {
		if (assertions) {
			this.newLine();
			this.writeIndent(number + 1);
			this.write(purpose);
			var self = this;
			if (angular.isArray(assertions)) {
				angular.forEach(assertions, function(assertion) {
					if (assertion.string_expression) {
						self.newLine();
						self.writeIndent(number + 2);
						self.write(assertion.string_expression);
					}
				});
			} else {
				self.newLine();
				self.writeIndent(number + 2);
				self.write(assertions.string_expression);
			}
		}
	};
	//print cdomain type
	this.printCPrimitiveObject = function(cobject, number) {
		var item = cobject.item;
		if (item) {
			if (item['_xsi:type'] == "C_BOOLEAN") {
				this.printCBoolean(item);
			} else if (item['_xsi:type'] == "C_DATE") {
				this.printCDate(item);
			} else if (item['_xsi:type'] == "C_DATE_TIME") {
				this.printCDateTime(item);
			} else if (item['_xsi:type'] == "C_TIME") {
				this.printCTime(item);
			} else if (item['_xsi:type'] == "C_DURATION") {
				this.printCDuration(item);
			} else if (item['_xsi:type'] == "C_INTEGER") {
				this.printCInteger(item);
			} else if (item['_xsi:type'] == "C_REAL") {
				this.printCReal(item);
			} else if (item['_xsi:type'] == "C_STRING") {
				this.printCString(item);
			}
			//unknown Cprimitive object
		}
	};

	this.printCBoolean = function(cboolean) {
		if (cboolean.true_valid == "true") {
			this.write("true");
			if (cboolean.false_valid == "true") {
				this.write(", false");
			}
		} else {
			this.write("false");
		}

		if (cboolean.assumed_value) {
			this.write("; ");
			this.write(cboolean.assumed_value);
		}
	};

	this.printDate = function(cdate) {
		if (cdate.pattern) {
			this.write(cdate.pattern);
		} else if (cdate.list) {
			this.write(cdate.list[0]);
		} else if (cdate.range) {
			this.printInterval(cdate.range);
		}

		if (cdate.assumed_value) {
			this.write("; ");
			this.write(cdate.assumed_value);
		}
	};

	this.printCDateTime = function(cdatetime) {
		if (cdatetime.pattern) {
			this.write(cdatetime.pattern);
		} else if (cdatetime.list) {
			this.write(cdatetime.list[0]);
		} else if (cdatetime.range) {
			this.printInterval(cdatetime.range);
		}

		if (cdatetime.assumed_value) {
			this.write("; ");
			this.write(cdatetime.assumed_value);
		};
	};
	this.printCTime = function(ctime) {
		if (ctime.pattern) {
			this.write(ctime.pattern);
		} else if (ctime.list) {
			this.write(ctime.list[0]);
		} else if (ctime.range) {
			this.printInterval(ctime.range);
		}

		if (ctime.assumed_value) {
			this.write("; ");
			this.write(ctime.assumed_value);
		};
	};

	this.printCDuration = function(cduration) {
		if (cduration.value) {
			this.write(cduration.value);
		} else if (cduration.pattern) {
			this.write(cduration.pattern);
		} else if (cduration.range) {
			this.printInterval(cduration.range);
		}

		if (cduration.assumed_value) {
			this.write("; ");
			this.write(cduration.assumed_value);
		}
	};

	this.printCInteger = function(cinteger) {
		if (cinteger.list) {
			this.printList(cinteger.list, false);
		} else if (cinteger.range) {
			this.printInterval(cinteger.range);
		}
		if (cinteger.assumed_value) {
			this.write("; ");
			this.write(cinteger.assumed_value);
		}
	};

	this.printCReal = function(creal) {
		if (creal.list) {
			this.printList(creal.list);
		} else if (creal.range) {
			this.printInterval(creal.rang);
		}

		if (creal.assumed_value) {
			this.write("; ");
			this.write(creal.assumed_value);
		}
	};
	this.printCString = function(cstring) {
		if (cstring.pattern) {
			this.write("/" + cstring.pattern + "/");
		} else if (cstring.list) {
			this.printList(cstring.list, true);
		} else if (cstring.default_value) {
			this.wriet("\"");
			this.write(cstring.default_value);
			this.write("\"");

		}
		if (cstring.assumed_value) {
			this.write("; ");
			this.write("\"" + cstring.assumed_value + "\"");
		}
	};

	this.printList = function(list, booer) {
		if (angular.isArray(list)) {
			var i, j;
			for ( i = 0, j = list.length; i < j; i++) {
				if (i != 0) {
					this.write(",");
				}
				if (booer) {
					this.write("\"");
				}
				this.write(list[i]);
				if (booer) {
					this.write("\"");
				}
			}
		} else {
			if (booer) {
				this.write("\"");
			}
			this.write(list);
			if (booer) {
				this.write("\"");
			}

		}
	};

	this.printCCodePhrase = function(cobject, number, ontology) {
		var self = this;
		self.writeIndent(number);
		if (cobject.terminology_id || cobject.code_string) {
			if (cobject.terminology_id) {
				self.write("[" + cobject.terminology_id.value + "::");
			}

			if (cobject.code_list) {
				var list = cobject.code_list;
				if (angular.isArray(list)) {
					if (list.length > 1) {
						self.newLine();
						var i, j;
						for ( i = 0, j = list.length; i < j; i++) {
							if (j > 1) {
								self.writeIndent(number);

							}
							self.write(list[i]);
							if (i != j - 1) {
								self.write(",");
								self.printComment(list[i], ontology);
							} else {
								if (cobject.assumed_value) {
									self.write(";");
									self.printCommnet(list[i], ontology);
									self.newLine();
									self.write(cobject.assumed_value.code_string);
									self.write("]");
									self.write("\t--\t" + "assumed value");

								} else {
									self.write("]");
									self.printComment(list[i], ontology);

								}
							}
							self.newLine();
						}
					} else {
						self.write(list[0]);
						if (cobject.assumed_value) {
							self.write(";");
							self.printComment(list[0], ontology);
							self.newLine();
							self.write(cobject.assumed_value.code_string);
						}
						self.write("]");
						self.newLine();
					}
				} else {
					self.write(list);
					if (cobject.assumed_value) {
						self.write(";");
						self.printComment(list, ontology);
						self.newLine();
						self.write(cobject.assumed_value.code_string);
					}
					self.write("]");
					self.newLine();
				}
			}

		} else {
			self.write("C_CODE_PHRASE <");
			self.newLine();
			self.writeIndent(number);
			self.write(">");
			self.newLine();

		}
	};

	this.printCDvQuantity = function(cquantity, number) {
		this.writeIndent(number);
		this.write("C_DV_QUANTITY <");
		this.newLine();
		this.writeIndent(number + 1);
		var property = cquantity.property;
		if (property) {
			this.write("property = <[");
			this.write(property.terminology_id.value);
			this.write("::");
			this.write(property.code_string);
			this.write("]>");
		}
		var list = cquantity.list;
		if (list) {
			this.newLine();
			this.writeIndent(number + 1);
			this.newLine();
			this.write("list = <");
			this.newLine();
			var index = 1;
			for (var i = 0, index = 1; i < list.length; i++, index++) {
				this.writeIndent(number + 2);
				this.write("[\"");
				this.write(index.toString());
				this.write("\"] = <");
				this.newLine();
				this.writeIndent(number + 3);
				this.write("units = <\"");
				this.write(list[i].units);
				this.write("\">");
				this.newLine();
				if (list[i].magnitude) {
					this.writeIndent(number + 3);
					this.write("magnitude = <");
					this.printInterval(list[i].magnitude);
					this.write(">");
					this.newLine();
				}
				if (list[i].precision) {
					this.writeIndent(number + 3);
					this.write("precision = <");
					this.printInterval(list[i].precision);
					this.write(">");
					this.newLine();
				}
				this.writeIndent(number + 2);
				this.write(">");
				this.newLine();
			}
			this.writeIndent(number + 1);
			this.write(">");
			this.newLine();
		}

		if (cquantity.assumed_value) {
			this.newLine();
			this.writeIndent(number + 1);
			this.write("assumed_value = <");
			this.newLine();
			this.printDvQuantity(cquantity.assumed_value, number + 1);
			this.writeIndent(number + 1);
			this.write(">");
			this.newLine();
		}

		this.writeIndent(number);
		this.write(">");
		this.newLine();

	};
	this.printDvQuantity = function(quantity, number) {
		this.writeIndent(number + 1);
		this.printUnits(quantity.units);
		this.newLine();

		if (quantity.magnitude) {
			this.writeIndent(number + 1);
			this.write("magnitude = <");
			this.write(quantity.magnitude);
			this.write(">");
			this.newLine();
		}

		this.writeIndent(number + 1);
		this.write("precision = <");
		this.write(quantity.precision);
		this.write(">");
		this.newLine();
	};
	this.printUnits = function(units) {
		this.write("units = <\"");
		this.write(units);
		this.write("\>");
	};
	this.printInterval = function(interval) {
		var self = this;
		self.write("|");
		if (interval.lower && interval.upper) {
			if (angular.equals(interval.lower, interval.upper) && interval.lower_included && interval.upper_included) {
				self.write(interval.lower);
			} else {
				self.write(interval.lower);
				self.write("..");
				self.write(interval.upper);
			}
		} else if (interval.lower == null || interval.lower == undefined) {
			self.write("<");
			if (interval.upper_included) {
				self.write("=");
			}
			self.write(interval.upper);
		} else if (interval.upper == null || interval.upper == undefined) {
			self.write(">");
			if (interval.lower_included) {
				self.write("=");
			}
			self.write(interval.lower);
		}
		self.write("|");

	};
	this.printCDvOrdinal = function(cordinal, number) {
		if (cordinal.list) {
			var list = cordinal.list;
			for (var i = 0; i < list.length; i++) {
				this.writeIndent(number);
				this.printOrdinal(list[i]);
				if (i < list.length - 1) {
					this.write(",");
				} else {
					this.write(";");
				}
			}
			this.newLine();
		} else {
			this.writeIndent(number);
			this.write("C_DV_ORDINAL <");
			this.newLine();
			this.writeIndent(number);
			this.write(">");
			this.newLine();
		}

		if (cordinal.assumed_value) {
			this.printOrdinal(cordinal.assumed_value);
		}

	};

	this.printOrdinal = function(ordinal) {
		this.write(ordinal.value);
		this.write("|[");
		this.write(ordinal.symbol.defining_code.terminology_id.value);
		this.write("::");
		this.write(ordinal.symbol.defining_code.code_string);
		this.write("]");
	};
	this.printCardinality = function(cardinality) {
		if (cardinality) {
			this.write("cardinality matches {");
			var interval = cardinality.interval;
			if (interval) {
				if (interval.lower_unbounded == "true") {
					this.write("*");
				} else {
					this.write(interval.lower);
				}
				this.write("..");
				if (interval.upper_unbounded == "true") {
					this.write("*");
				} else {
					this.write(interval.upper);
				}
			} else {
				this.write("*");
			}
			this.write("; ");
			if (cardinality.is_ordered == "true") {
				this.write("ordered");
			} else {
				this.write("unordered");
			}
			if (cardinality.is_unique == "true") {
				this.write("; unique");
			}
			this.write("}");
		}
	};
	this.printExistence = function(existence) {
		if (existence.lower == "1") {
			return;
		}
		this.write("existence matches ");
		if (existence.lower == "0" && existence.upper == "1") {
			this.write("{0..1}");
		} else {
			this.write("{0}");
		}
	};
	this.printComment = function(nodeId, ontology) {
		var self = this;
		if (nodeId && ontology) {
			if (angular.isArray(ontology.term_definitions)) {
				angular.forEach(ontology.term_definitions, function(term_definition) {
					if (term_definition._language == "en") {
						if (angular.isArray(term_definition.items)) {
							angular.forEach(term_definition.items, function(item) {
								if (item._code == nodeId) {
									angular.forEach(item.items, function(item) {
										if (item._id == "text") {
											self.write("\t--\t" + item.__text);
										}
									});

								}
							});
						} else {
							var item = term_definition.items;
							if (item) {
								if (item._code == nodeId) {
									angular.forEach(item.items, function(item) {
										if (item._id == "text") {
											self.write("\t--\t" + item.__text);
										}
									});
								}
							}
						}

					}
				});

			} else {
				if (ontology.term_definitions._language == "en") {
					var items = ontology.term_definitions.items;
					if (items) {
						if (angular.isArray(items)) {
							angular.forEach(items, function(item) {
								if (item._code == nodeId) {
									angular.forEach(item.items, function(item) {
										if (item._id == "text") {
											self.write("\t--\t" + item.__text);
										}
									});

								}
							});
						} else {
							if (items._code == nodeId) {
								angular.forEach(items.items, function(item) {
									if (item._id == "text") {
										self.write("\t--\t" + item.__text);
									}
								});
							}
						}
					}

				}
			}
		}
	};
	this.printOccurrences = function(occurrences) {
		if (occurrences) {
			if (angular.equals(occurrences.lower, "1") && angular.equals(occurrences.upper, "1")) {
				return;
			}

			this.write(" occurrences matches{");
			if (occurrences.lower) {
				this.write(occurrences.lower);
			} else {
				this.write("*");
			}
			this.write("..");
			if (occurrences.upper) {
				this.write(occurrences.upper);
			} else {
				this.write("*");
			}
			this.write("}");
		}
	};

	this.printMapArray = function(array, number) {
		var self = this;
		if (angular.isArray(array)) {
			angular.forEach(array, function(item) {

				self.writeIndent(number);
				self.write("[\"");
				self.write(item._id);
				self.write("\"] = <\"");
				self.write(item.__text);
				self.write("\">");
				self.newLine();
			});

		} else {
			self.writeIndent(number);
			self.write("[\"");
			self.write(array._id);
			self.write("\"] = <\"");
			self.write(array.__text);
			self.write("\">");
			self.newLine();
		}
	};

	this.printDescriptionItem = function(item, number) {
		this.writeIndent(number);
		this.write("[\"");
		this.write(item.language.code_string);
		this.write("\"] = <");
		this.newLine();

		this.writeIndent(number + 1);
		this.write("language = <");
		this.write("[");
		this.write(item.language.terminology_id.value);
		this.write("::");
		this.write(item.language.code_string);
		this.write("]>");
		this.newLine();

		this.printNonEmptyString("purpose", item.purpose, number + 1);
		this.printNonEmptyStringList("keywords", item.keywords, number + 1);
		this.printNonEmptyString("copyright", item.copyright, number + 1);
		this.printNonEmptyString("use", item.use, number + 1);
		this.printNonEmptyString("missue", item.missue, number + 1);
		this.printNonEmptyString("original_resource_uri", item.original_resource_uri);

		this.writeIndent(number);
		this.write(">");
		this.newLine();

	};
	this.printNonEmptyString = function(label, value, number) {
		var self = this;
		if (value) {
			this.writeIndent(number);
			this.write(label);
			this.write(" = <\"");
			this.write(value.replace("\"", "\\\""));
			this.write("\">");
			this.newLine();
		}
	};

	this.printNonEmptyStringList = function(label, list, number) {
		if (list) {
			if (angular.isArray(list)) {
				this.writeIndent(number);
				this.write(label);
				this.write(" = <");
				for ( i = 0; i < list.length; i++) {
					this.write("\"");
					this.write(list[i].replace("\"", "\\\""));
					this.write("\"");
					if (i != list.length - 1) {
						this.write(",");
					}
				}
				this.write(">");
				this.newLine();
			} else {
				this.printNonEmptyString(label, list, number);
			}
		}
	};
	this.write = function(string) {
		this.adlOutput += string;
	};
	this.writeIndent = function(number) {
		var i;
		for ( i = 0; i < number; i++) {
			this.write(this.indent);
		}
	};
	this.newLine = function() {
		this.adlOutput += this.lineSeparator;
	};

});
