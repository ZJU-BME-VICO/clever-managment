angular.module('clever.management.services.treeDataFormat', []).service('treeDataFormatService', function() {
	this.childrenName = "";
	this.formatTreeData = function(dataList, childrenName) {
		var formatedData = new FormatObject(childrenName);
	    formatedData.refreshFormatList(dataList);
	    return formatedData;
	};

	function Cluster(childrenName) {
		var cluster = {
			isDirectory : true,
			type : 'cluster',
			name : 'Cluster',
		};
		cluster[childrenName] = [];
		return cluster;
	}

	function Composition(childrenName) {
		var composition = {
			isDirectory : true,
			type : 'composition',
			name : 'Composition',
		};
		composition[childrenName] = [];
		return composition;
	}

	function Element(childrenName) {
		var element = {
			isDirectory : true,
			type : 'element',
			name : 'Element',
		};
		element[childrenName] = [];
		return element;
	}

	function Action(childrenName) {
		var action = {
			isDirectory : true,
			type : 'action',
			name : 'Action',
		};
		action[childrenName] = [];
		return action;
	}

	function Evaluation(childrenName) {
		var evaluation = {
			isDirectory : true,
			type : 'evaluation',
			name : 'Evaluation',
		};
		evaluation[childrenName] = [];
		return evaluation;
	}

	function Observation(childrenName) {
		var observation = {
			isDirectory : true,
			type : 'observation',
			name : 'Observation',
		};
		observation[childrenName] = [];
		return observation;
	}

	function Instruction(childrenName) {
		var instruction = {
			isDirectory : true,
			type : 'instruction',
			name : 'Instruction',
		};
		instruction[childrenName] = [];
		return instruction;
	}

	function Admin(childrenName) {
		var admin = {
			isDirectory : true,
			type : 'admin',
			name : 'Admin',
		};
		admin[childrenName] = [];
		return admin;
	}

	function Entry(childrenName, children) {
		var entry = {
			isDirectory : true,
			type : 'folder',
			name : 'Entry',
			collapsed : false,
		};
		entry[childrenName] = children;
		return entry;
	}

	function Section(childrenName) {
		var section = {
			isDirectory : true,
			type : 'section',
			name : 'Section',

		};
		section[childrenName] = [];
		return section;
	}

	function Stucture(childrenName) {
		var stucture = {
			isDirectory : true,
			type : 'ehr-structure',
			name : 'Stucture',

		};
		stucture[childrenName] = [];
		return stucture;
	}

	function Demographic(childrenName) {
		var demographic = {
			isDirectory : true,
			type : 'folder',
			name : 'Demographic Model Archetypes',
		};
		demographic[childrenName] = [];
		return demographic;
	}

	function FormatList(childrenName, ehr, demographic) {
		var archetypeList = [{
			isDirectory : true,
			type : 'folder',
			name : 'EHR Archetypes',
			collapsed : false,
		}, demographic];
		archetypeList[0][childrenName] = ehr;
		return archetypeList;
	}

	function FormatObject(childrenName) {// format the data by the children name 
		this.cluster = Cluster(childrenName);
		this.composition = Composition(childrenName);
		this.element = Element(childrenName);
		this.action = Action(childrenName);
		this.evaluation = Evaluation(childrenName);
		this.observation = Observation(childrenName);
		this.instruction = Instruction(childrenName);

		this.admin_entry = Admin(childrenName);
		var entry = [this.action, this.evaluation, this.observation, this.instruction, this.admin_entry];
		this.entry = Entry(childrenName, entry);
		this.section = Section(childrenName);
		this.stucture = Stucture(childrenName);
		this.demographic = Demographic(childrenName);
		var ehr = [this.cluster, this.composition, this.element, this.entry, this.section, this.stucture];
		this.formatedList = FormatList(childrenName, ehr, this.demographic);
         var self = this;
		with (self) {
			this.listMap = {
				cluster : cluster[childrenName],
				composition : composition[childrenName],
				element : composition[childrenName],
				action : action[childrenName],
				evaluation : evaluation[childrenName],
				observation : observation[childrenName],
				instruction : instruction[childrenName],
				admin_entry : admin_entry[childrenName],
				section : section[childrenName],
				item_list : stucture[childrenName],
				item_tree : stucture[childrenName],
				item_table : stucture[childrenName],
				item_single : stucture[childrenName],
				demographic : demographic[childrenName],
			};
			
			this.refreshFormatList = function(list) {
				angular.forEach(listMap, function(value, key) {
					value.length = 0;
				});
				angular.forEach(list, function(item, index) {
					if (item) {
						if (item.rmName == 'DEMOGRAPHIC') {
							listMap['demographic'].push(item);
						} else  {
						   
							var array = listMap[item.rmEntity.toLowerCase()];
							if (array == undefined) {
								console.log('Cannot classify archetype ' + item.name);
								console.log("Archetype informationi is here:" );
								console.log(item);
							} else {
								array.push(item);
							}

						}
					}

				});

			};

			this.pushToFormatList = function(item, referenceModel, entityType) {
				if (referenceModel == 'DEMOGRAPHIC') {
					listMap['demographic'].push(item);
				} else {
					var temp = listMap[entityType];
					if (temp == undefined) {
						console.log('Cannot classify archetype ' + info.entityType);
					} else {
						temp.push(item);
					}
				};
			};
		}

	}

});
