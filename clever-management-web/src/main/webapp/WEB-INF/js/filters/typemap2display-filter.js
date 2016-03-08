angular.module('clever.management.filters.typemap2display', []).filter('typemap2display', function() {


  var typeMap = {


    'DV_INTERVAL<DV_DATE>': 'interval_datetime',
    'DV_INTERVAl<DV_TIME>': 'interval_datetime',
    'DV_INTERVAL<DV_DATE_TIME>': 'interval_datetime',
    'DV_INTERVAL<COUNT>': 'interval_count',
    'DV_INTERVAL<DV_COUNT>': 'interval_count',
    'DV_INTERVAL<QUANTITY>': 'interval_quantity',
    'DV_INTERVAL<DV_QUANTITY>': 'interval_quantity',

   'INTERVAL_COUNT' : 'Interval of count',
   'INTERVAL_QUANTITY' : 'Interval of quantity',
   'INTERVAL_DATETIME' : 'Interval of datetime',

    'SLOT': 'Slot',
    'SLOT_CLUSTER': 'Cluster',
    'SLOT_ELEMENT': 'Element',
    'SLOT_ITEM': 'Item',

    'PATHABLE': 'Pathable',
    'LOCATABLE': 'Locatable',
    'LINK': 'Link',
    'PARTY_PROXY': 'Party Proxy',
    'PARTY_SELF': 'Party Self',
    'PARTY_IDENTIFIED': 'Party Identified',
    'PARTY_RELATED': 'Party Related',
    'PARTICIPATION': 'Participation',
    'AUDIT_DETAILS': 'Audit Details',
    'DATA_VALUE': 'Data Value',
    'DV_BOOLEAN': 'Boolean',
    'DV_STATE': 'State',
    'DV_IDENTIFIER': 'Identifier',
    'DV_TEXT': 'Text',
    'CODE_PHRASE': 'Code Phase',
    'DV_CODED_TEXT': 'Coded Text',
    'DV_PARAGRAPH': 'Paragraph',
    'DV_ORDINAL': 'Ordinal',
    'C_DV_QUANTITY': 'Quantity(C)',
    'C_QUANTITY_ITEM': 'Quantity Item',
    'C_DV_ORDINAL': 'Ordinal(C)',
    'DV_COUNT': 'Count',
    'DV_INTERVAL': 'Interval',
    'DV_PROPORTION': 'Proportion',
    'DV_DATE': 'Date',
    'DV_TIME': 'Time',
    'DV_DATE_TIME': 'Date Time',
    'DV_DURATION': 'Duration',
    'DV_ENCAPSULATED': 'Encapsulated',
    'DV_MULTIMEDIA': 'Multimedia',
    'DV_PARSABLE': 'Parsable',
    'DV_URI': 'Uri',
    'DV_EHR_URI': 'Ehr Uri',
    'DATA_STRUCTURE': 'Data Structure',
    'ITEM_STRUCTURE': 'Item Structure',
    'ITEM_SINGLE': 'Item Single',
    'ITEM_LIST': 'Item List',
    'ITEM_TABLE': 'Item Table',
    'ITEM_TREE': 'Item Tree',
    'ITEM': 'Item',
    'CLUSTER': 'Cluster',
    'ELEMENT': 'Element',
    'HISTORY': 'History',
    'EVENT': 'Event',
    'POINT_EVENT': 'Point Event',
    'INTERVAL_EVENT': 'Interval Event',
    'UID': 'UID',
    'ISO_ID': 'ISO ID',
    'UUID': 'UUID',
    'INTERNET_ID': 'Internet ID',
    'OBJECT_ID': 'Object ID',
    'UID_BASE_ID': 'UID Base ID',
    'HIER_OBJECT_ID': 'Hier Object ID',
    'OBJECT_VERSION_ID': 'Object Version ID',
    'VERSION_TREE_ID': 'Version Tree Id',
    'ARCHETYPE_ID': 'Archetype ID',
    'TERMINOLOGY_ID': 'Terminology ID',
    'GENERIC_ID': 'Generic ID',
    'OBJECT_REF': 'Obejct Ref',
    'CCESS_GROUP_REF': 'CCESS_GROUP_REF',
    'PARTY_REF': 'Party Reference',
    'LOCATABLE_REF': 'Locatable Reference',
    'PARTY': 'Party',
    'PARTY_IDENTITY': 'Party Identity',
    'CONTACT': 'Concat',
    'ADDRESS': 'Address',
    'ACTOR': 'Actor',
    'PERSON': 'Person',
    'ORGANISATION': 'Organisation',
    'GROUP': 'Group',
    'AGENT': 'Agent',
    'ROLE': 'Role',
    'CAPABILITY': 'Capability',
    'PARTY_RELATIONSHIP': 'Party Relationship',
    'CONTENT_ITEM': 'Content Item',
    'EVENT_CONTEXT': 'Event Context',
    'COMPOSITION': 'Composition',
    'SECTION': 'Section',
    'ENTRY': 'Entry',
    'ADMIN_ENTRY': 'Admin Entry',
    'CARE_ENTRY': 'Care Entry',
    'OBSERVATION': 'Observation',
    'EVALUATION': 'Evaluation',
    'INSTRUCTION': 'Instruction',
    'ACTIVITY': 'Activity',
    'ACTION': 'Action',
    'INSTRUCTION_DETAILS': 'Instruction Details',
    'ISM_TRANSITION': 'Transition',




    //attribute
    'subject': 'Subject',
    'protocol': 'Protocol',
    'links': 'Links',
    'ism_transition': 'Ism transition',
    'events': 'Events',
    'otherparticipations': 'Other Participation',
    'state': 'State',
    'data': 'Data',
    'section': 'Section',
    'content': 'Content',
    'context': 'Context',
    'composer': 'Composer',
    'category': 'Category',
    'language': 'Language',
    'territory': 'Territory',



  };

  return function(input) {
    return typeMap[input] ? typeMap[input] : input;
  };
});