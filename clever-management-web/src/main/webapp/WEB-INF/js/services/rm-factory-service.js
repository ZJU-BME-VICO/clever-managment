angular.module('clever.management.service.rmFactoryService', []).service('rmFactoryService', function() {
    var REQUIERD = true;
    var OPTIONAL = false;
    var IS_ARRAY = true;
    var NOT_ARRAY = false;
    var PARSABLE = true;
    var UNPARSABLE = false;
    var TYPE = 'TYPE';
    var ATTRIBUTE = 'ATTRIBUTE';
    var MenuType = {};
    MenuType.TYPE = 'TYPE';
    MenuType.ATTRIBUTE = 'ATTRIBUTE';
    MenuType.NULL = null;
    MenuType.LEAPFROG = 'LEAPFROG';

    var T_HIER_OBJECT_ID = 'HIER_OBJECT_ID';

    var T_STRING = 'STRING';
    var T_TERMINOLOGY_ID = 'TERMINOLOGY_ID';

    var T_PARTY_IDENTITY = 'PARTY_IDENTITY';
    var T_PARTY_RELATIONSHIPS = 'PARTY_RELATIONSHIPS';
    var T_PARTY_REF = 'PARTY_REF';
    var T_PARTY_PROXY = 'PARTY_PROXY';

    var T_CONTACT = 'CONTACT';
    var T_LOCATABLE_REF = 'LOCATABLE_REF';
    var T_ITEM_STRUCTURE = 'ITEM_STRUCTURE';

    var T_DV_TEXT = 'DV_TEXT';
    var T_DV_EHR_URI = 'DV_EHR_URI';
    var T_DV_IDENTIFIER = 'DV_IDENTIFIER';
    var T_DV_CODED_TEXT = 'DV_CODED_TEXT';
    var T_DV_INTERVAL_DATE_TIME = 'DV_INTERVAL_DATE_TIME';
    var T_DV_DATE_TIME = 'DV_DATE_TIME'
    var T_BOOLEAN = 'BOOLEAN';
    var T_CODE_PHRASE = 'CODE_PHRASE';
    var T_DV_ORDINAL = 'DV_ORDINAL';
    var T_C_QUANTITY_ITEM = 'C_QUANTITY_ITEM';
    var T_INTERVAL_REAL = 'INTERVAL_REAL';
    var T_INTERVAL_INTEGER = 'INTERVAL_INTEGER';
    var T_CLUSTER = 'CLUSTER';
    var T_ITEM = 'ITEM';
    var T_DATA_VALUE = 'DATA_VALUE';
    var T_DV_DURATION = 'DV_DURATION';
    var T_UID = 'UID';
    var T_VERSIONI_TREE_ID = 'VERSIONI_TREE_ID';
    var T_OBJECT_VERSION_ID = 'OBJECT_VERSION_ID';
    var T_CAPABILITY = 'CAPABILITY';
    var T_LINK = 'LINK';
    var T_INTEGER = 'INTEGER';
    var T_ELEMENT = 'ELEMENT';
    var T_EVENT = 'EVENT';
    var T_ADDRESS = 'ADDRESS';
    var T_CONTENT_ITEM = 'CONTENT_ITEM';
    var T_HISTORY_ITEM_STRUCTURE = 'HISTORY_ITEM_STRUCTURE';
    var T_PARTICIPATION = 'PARTICIPATION';
    var T_EVENT_CONTEXT = 'EVENT_CONTEXT';
    var T_ISM_TRANSITION = 'ISM_TRANSITION';
    var T_INSTRUCTION_DETAILS = 'INSTRUCTION_DETAILS';
    var P

    //Attribute generator
    function Attr(attributeName, required, childrenType, childrenIsArray) {
        return {
            name: attributeName,
            '@children': {
                type: childrenType,
                isArray: childrenIsArray,
            },
            '@required': required,
        }
    }

    function inheritEstablish(parent, children) {
        children.prototype = Object.create(parent.prototype);
        children.prototype.constructor = children;
    }

    function RmObject(menuType, parsable) {
        this.menuType = menuType;
        this.attributes = [];
        this.parsable = parsable;
    }
    RmObject.prototype.type = 'rm_Object';;




    /*--------RM COMMON INFORMATION---------*/

    /* PATHABLE */
    function PATHABLE(menuType, parsable) {

        RmObject.call(this, menuType, parsable);
        this.isAbstract = true;
    }
    inheritEstablish(RmObject, PATHABLE);
    console.log(new PATHABLE);


    /*LOACTABLE*/
    function LOCATABLE(menuType, parsable) {
        RmObject.call(this, menuType, parsable);
        this.attributes.push(Attr('links', OPTIONAL, T_LINK, IS_ARRAY));
        this.isAbstract = true;
    }
    inheritEstablish(RmObject, LOCATABLE);
    console.log(new LOCATABLE);

    /* ARCHETYPED */
    function ARCHETYPED() {}

    /* LINK */
    function LINK() {
        RmObject.call(this, MenuType.NULL, PARSABLE);
        this.attributes.push(Attr('meaning', REQUIERD, T_DV_TEXT, NOT_ARRAY));
        this.attributes.push(Attr('type', REQUIERD, T_DV_TEXT, NOT_ARRAY));
        this.attributes.push(Attr('target', REQUIERD, T_DV_EHR_URI, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.LINK = LINK;
    inheritEstablish(RmObject, LINK);
    console.log(new LINK);
    /* FEEDER_AUDIT */
    function FEEDER_AUDIT() {}

    /* FEEDER_AUDIT_DETAILS */
    function FEEDER_AUDIT_DETAILS() {}

    /* PARTY_PROXY */
    function PARTY_PROXY() {
        RmObject.call(this, MenuType.TYPE, PARSABLE);
        this.attributes.push(Attr('external_ref', OPTIONAL, T_PARTY_REF, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.PARTY_PROXY = PARTY_PROXY;
    inheritEstablish(RmObject, PARTY_PROXY);
    console.log(new PARTY_PROXY);

    /* PARTY_SELF */
    function PARTY_SELF() {
        PARTY_PROXY.call(this);
        this.isAbstract = false;
    }
    this.PARTY_SELF = PARTY_SELF;
    inheritEstablish(PARTY_PROXY, PARTY_SELF);
    console.log(new PARTY_SELF);

    /* PARTY_IDENTIFIED */
    function PARTY_IDENTIFIED() {
        PARTY_PROXY.call(this);
        this.attributes.push(Attr('name', OPTIONAL, T_STRING, NOT_ARRAY));
        this.attributes.push(Attr('identifiers', OPTIONAL, T_DV_IDENTIFIER, IS_ARRAY));
        this.isAbstract = false;
    }
    this.PARTY_IDENTIFIED = PARTY_IDENTIFIED;
    inheritEstablish(PARTY_PROXY, PARTY_IDENTIFIED);
    console.log(new PARTY_IDENTIFIED);

    /* PARTY_RELATED */
    function PARTY_RELATED() {
        PARTY_IDENTIFIED.call(this);
        this.attributes.push(Attr('relationships', REQUIERD, T_DV_CODED_TEXT, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.PARTY_RELATED = PARTY_RELATED;
    inheritEstablish(PARTY_IDENTIFIED, PARTY_RELATED);
    console.log(new PARTY_RELATED);

    /* PARTICIPATION */
    function PARTICIPATION() {
        RmObject.call(this, MenuType.ATTRIBUTE, PARSABLE);
        this.attributes.push(Attr('function', OPTIONAL, T_DV_TEXT, NOT_ARRAY));
        this.attributes.push(Attr('mode', OPTIONAL, T_DV_CODED_TEXT, NOT_ARRAY));
        this.attributes.push(Attr('time', OPTIONAL, T_DV_INTERVAL_DATE_TIME, NOT_ARRAY));
        this.attributes.push(Attr('performer', REQUIERD, T_PARTY_PROXY, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.PARTICIPATION = PARTICIPATION;
    inheritEstablish(RmObject, PARTICIPATION);
    console.log(new PARTICIPATION());

    /* AUDIT_DETAILS */
    function AUDIT_DETAILS() {
        RmObject.call(this, MenuType.ATTRIBUTE, PARSABLE);
        this.attributes.push(Attr('system_id', REQUIERD, T_STRING, NOT_ARRAY));
        this.attributes.push(Attr('commiter', REQUIERD, T_PARTY_PROXY, NOT_ARRAY));
        this.attributes.push(Attr('time_committed', REQUIERD, T_DV_DATE_TIME, NOT_ARRAY));
        this.attributes.push(Attr('change_type', REQUIERD, T_DV_CODED_TEXT, NOT_ARRAY));
        this.attributes.push(Attr('description', OPTIONAL, T_DV_TEXT, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.AUDIT_DETAILS = AUDIT_DETAILS;
    inheritEstablish(RmObject, AUDIT_DETAILS);
    console.log(new AUDIT_DETAILS);
    /* ATTESTATION */
    function ATTESTATION() {}

    /* REVISION_HISTORY */
    function REVISION_HISTORY() {}

    /* REVISION_HISTORY_ITEM */
    function REVISION_HISTORY_ITEM() {}


    /* DATA TYPES INFORMATION */

    /* Basic package */

    /* DATA_VALUE */
    function DATA_VALUE() {
        RmObject.call(this, MenuType.NULL, UNPARSABLE);
        this.isAbstract = true;
    }
    this.DATA_VALUE = DATA_VALUE;
    inheritEstablish(RmObject, DATA_VALUE);
    console.log(new DATA_VALUE);

    /* DV_BOOLEAN */
    function DV_BOOLEAN() {
        DATA_VALUE.call(this);
        this.attributes.push(Attr('value', REQUIERD, T_BOOLEAN, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.DV_BOOLEAN = DV_BOOLEAN;
    inheritEstablish(DATA_VALUE, DV_BOOLEAN);
    console.log(new DV_BOOLEAN);

    /* DV_STATE */
    function DV_STATE() {
        DATA_VALUE.call(this);
        this.attributes.push(Attr('value', REQUIERD, T_DV_CODED_TEXT, NOT_ARRAY));
        this.attributes.push(Attr('is_temrminal', REQUIERD, T_BOOLEAN, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.DV_STATE = DV_STATE;
    inheritEstablish(DATA_VALUE, DV_STATE);
    console.log(new DV_STATE);

    function DV_IDENTIFIER() {
        DATA_VALUE.call(this);
        this.attributes.push(Attr('issuer', REQUIERD, T_STRING, NOT_ARRAY));
        this.attributes.push(Attr('assigner', REQUIERD, T_STRING, NOT_ARRAY));
        this.attributes.push(Attr('id', REQUIERD, T_STRING, NOT_ARRAY));
        this.attributes.push(Attr('type', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.DV_IDENTIFIER = DV_IDENTIFIER;
    inheritEstablish(DATA_VALUE, DV_IDENTIFIER);
    console.log(new DV_IDENTIFIER);

    /* Text package */

    /* DV_TEXT */
    function DV_TEXT() {
        DATA_VALUE.call(this);
        this.attributes.push(Attr('value', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
        /*mappings optional TERM_MAPPING is_array  //if this attributes is implement, the TERM_MAPPING type should be implement before that
         *formatting  optional string not_array
         *hyperlink optional dv_uri not_array
         *language optional code_phrase not_array
         *encoding optional code_phrase not_array
         */
    }
    this.DV_TEXT = DV_TEXT;
    inheritEstablish(DATA_VALUE, DV_TEXT);
    console.log(new DV_TEXT);

    /* CODE_PHRASE */
    function CODE_PHRASE() {
        RmObject.call(this, MenuType.NULL, UNPARSABLE);
        this.attributes.push(Attr('terminology_id', REQUIERD, T_TERMINOLOGY_ID, NOT_ARRAY));
        this.attributes.push(Attr('code_string', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.CODE_PHRASE = CODE_PHRASE;
    inheritEstablish(RmObject, CODE_PHRASE);
    console.log(new CODE_PHRASE);

    /* DV_CODED_TEXT */
    function DV_CODED_TEXT() {
        DV_TEXT.call(this);
        this.attributes.push(Attr('defining_code', REQUIERD, T_CODE_PHRASE, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.DV_CODED_TEXT = DV_CODED_TEXT;
    inheritEstablish(DV_TEXT, DV_CODED_TEXT);
    console.log(new DV_CODED_TEXT);

    /* DV_PARAGRAPH */
    function DV_PARAGRAPH() {
        DATA_VALUE.call(this);
        this.attributes.push(Attr('items', REQUIERD, T_DV_TEXT, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.DV_PARAGRAPH = DV_PARAGRAPH;
    inheritEstablish(DATA_VALUE, DV_PARAGRAPH);
    console.log(new DV_PARAGRAPH);


    /* Quantity package */

    /* DV_ORDERED */
    function DV_ORDERED() {} //not used now

    function DV_AMOUNT() {} //not used now

    /* may be use C_DV_ORDINAL */
    function DV_ORDINAL() {
        DATA_VALUE.call(this);
        this.isAbstract = false;
    }
    this.DV_ORDINAL = DV_ORDINAL;
    inheritEstablish(DATA_VALUE, DV_ORDINAL);
    console.log(new DV_ORDINAL);

    function C_DV_ORDINAL() {
        DATA_VALUE.call(this);
        this.attributes.push(Attr('list', REQUIERD, T_DV_ORDINAL, IS_ARRAY));
        this.isAbstract = false;
    }
    this.C_DV_ORDINAL = C_DV_ORDINAL;
    inheritEstablish(DATA_VALUE, C_DV_QUANTITY);
    console.log(new C_DV_ORDINAL);

    function C_DV_QUANTITY() {
        DATA_VALUE.call(this);
        this.attributes.push(Attr('list', OPTIONAL, T_C_QUANTITY_ITEM, IS_ARRAY));
        this.attributes.push(Attr('property', OPTIONAL, T_CODE_PHRASE, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.C_DV_QUANTITY = C_DV_QUANTITY;
    inheritEstablish(DATA_VALUE, C_DV_QUANTITY);
    console.log(new C_DV_QUANTITY);

    function C_QUANTITY_ITEM() {
        RmObject.call(this, MenuType.NULL, UNPARSABLE);
        this.attributes.push(Attr('magnitude', OPTIONAL, T_INTERVAL_REAL, NOT_ARRAY));
        this.attributes.push(Attr('precision', OPTIONAL, T_INTERVAL_INTEGER, NOT_ARRAY));
        this.attributes.push(Attr('unit', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.C_QUANTITY_ITEM = C_QUANTITY_ITEM;
    console.log(new C_QUANTITY_ITEM);

    /* DV_COUNT */
    function DV_COUNT() {
        DATA_VALUE.call(this);
        this.attributes.push(Attr('magnitude', REQUIERD, T_INTEGER, NOT_ARRAY));
        this.attributes.push(Attr('value', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.DV_COUNT = DV_COUNT;
    inheritEstablish(DATA_VALUE, DV_COUNT);
    console.log(new DV_COUNT);

    /* DV_PROPORTION */
    function DV_PROPORTION() {
        DATA_VALUE.call(this);
        this.attributes.push(Attr('value', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.DV_PROPORTION = DV_PROPORTION;
    inheritEstablish(DATA_VALUE, DV_PROPORTION);
    console.log(new DV_PROPORTION);

    /* DV_DATE */
    function DV_DATE() {
        DATA_VALUE.call(this);
        this.attributes.push(Attr('value', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.DV_DATE = DV_DATE;
    inheritEstablish(DATA_VALUE, DV_DATE);
    console.log(new DV_DATE);

    /* DV_TIME */
    function DV_TIME() {
        DATA_VALUE.call(this);
        this.attributes.push(Attr('value', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.DV_TIME = DV_TIME;
    inheritEstablish(DATA_VALUE, DV_TIME);
    console.log(new DV_TIME);

    /* DV_DATE_TIME*/
    function DV_DATE_TIME() {
        DATA_VALUE.call(this);
        this.attributes.push(Attr('value', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.DV_DATE_TIME = DV_DATE_TIME;
    inheritEstablish(DATA_VALUE, DV_DATE_TIME);
    console.log(new DV_DATE_TIME);

    /* DV_DUREATION */
    function DV_DURATION() {
        DATA_VALUE.call(this);
        this.attributes.push(Attr('value', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.DV_DURATION = DV_DURATION;
    inheritEstablish(DATA_VALUE, DV_DURATION);
    console.log(new DV_DURATION);


    /* Encapsulated package */

    /* DV_ENCAPSULATED */
    function DV_ENCAPSULATED() {
        DATA_VALUE.call(this);
        this.attributes.push(Attr('charset', OPTIONAL, T_CODE_PHRASE, NOT_ARRAY));
        this.attributes.push(Attr('language', OPTIONAL, T_CODE_PHRASE, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.DV_ENCAPSULATED = DV_ENCAPSULATED;
    inheritEstablish(DATA_VALUE, DV_ENCAPSULATED);
    console.log(new DV_ENCAPSULATED);

    /* DV_MULTIMEDIA */
    function DV_MULTIMEDIA() {
        DV_ENCAPSULATED.call(this);
        this.attributes.push(Attr('media_type', REQUIERD, T_CODE_PHRASE, NOT_ARRAY));
        this.attributes.push(Attr('size', REQUIERD, T_INTEGER, NOT_ARRAY));
        /*
         * alternate_text
         * compression algorithm
         * integrity_check
         * thumbnail
         * uri
         * data
         */
        this.isAbstract = false;
    }
    this.DV_MULTIMEDIA = DV_MULTIMEDIA;
    inheritEstablish(DATA_VALUE, DV_MULTIMEDIA);
    console.log(new DV_MULTIMEDIA);

    /* DV_PARSABLE */
    function DV_PARSABLE() {
        DV_ENCAPSULATED.call(this);
        this.attributes.push(Attr('size', REQUIERD, T_INTEGER, NOT_ARRAY));
        this.attributes.push(Attr('value', REQUIERD, T_STRING, NOT_ARRAY));
        this.attributes.push(Attr('formalism', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.DV_PARSABLE = DV_PARSABLE;
    inheritEstablish(DV_ENCAPSULATED, DV_PARSABLE);
    console.log(new DV_PARSABLE);

    /* Uri package */

    /* DV_URI */
    function DV_URI() {
        DATA_VALUE.call(this);
        this.attributes.push(Attr('value', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.DV_URI = DV_URI;
    inheritEstablish(DATA_VALUE, DV_URI);
    console.log(new DV_URI);

    /* DV_EHR_URI */
    function DV_EHR_URI() {
        DV_URI.call(this);
        this.isAbstract = false;
    }
    this.DV_EHR_URI = DV_EHR_URI;
    inheritEstablish(DV_URI, DV_EHR_URI);
    console.log(new DV_EHR_URI);







    /* data_structures im*/


    /* DATA_STRUCTURE */
    function DATA_STRUCTURE(menuType) {
        RmObject.call(this, menuType, PARSABLE);
        this.isAbstract = true;
    }
    inheritEstablish(RmObject, DATA_STRUCTURE);
    console.log(new DATA_STRUCTURE(MenuType.ATTRIBUTE));



    /* Item structure package */

    /* ITEM_STRUCTURE */
    function ITEM_STRUCTURE() {
        DATA_STRUCTURE.call(this, MenuType.LEAPFROG);
        this.isAbstract = true;
    }
    this.ITEM_STRUCTURE = ITEM_STRUCTURE;
    inheritEstablish(DATA_STRUCTURE, ITEM_STRUCTURE);
    console.log(new ITEM_STRUCTURE);

    /* ITEM_SINGLE */
    function ITEM_SINGLE() {
        ITEM_STRUCTURE.call(this);
        this.attributes.push(Attr('item', REQUIERD, T_ELEMENT, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.ITEM_SINGLE = ITEM_SINGLE;
    inheritEstablish(ITEM_STRUCTURE, ITEM_SINGLE);
    console.log(new ITEM_SINGLE);

    /* ITEM_LIST */
    function ITEM_LIST() {
        ITEM_STRUCTURE.call(this);
        this.attributes.push(Attr('items', REQUIERD, T_ELEMENT, IS_ARRAY));
        this.isAbstract = false;
    }
    this.ITEM_LIST = ITEM_LIST;
    inheritEstablish(ITEM_STRUCTURE, ITEM_LIST);
    console.log(new ITEM_LIST);

    /* ITEM_TABLE */
    function ITEM_TABLE() {
        ITEM_STRUCTURE.call(this);
        this.attributes.push(Attr('rows', REQUIERD, T_CLUSTER, IS_ARRAY));
        this.isAbstract = false;
    }
    this.ITEM_TABLE = ITEM_TABLE;
    inheritEstablish(ITEM_STRUCTURE, ITEM_TABLE);
    console.log(new ITEM_TABLE);

    /* ITEM_TREE */
    function ITEM_TREE() {
        ITEM_STRUCTURE.call(this);
        this.attributes.push(Attr('items', OPTIONAL, T_ITEM, IS_ARRAY));
        this.isAbstract = false;
    }
    this.ITEM_TREE = ITEM_TREE;
    inheritEstablish(ITEM_STRUCTURE, ITEM_TREE);
    console.log(new ITEM_TREE);



    /* Repesentation package */

    /* ITEM */
    function ITEM(menuType) {
        RmObject.call(this, menuType, PARSABLE);
        this.isAbstract = true;
    }
    inheritEstablish(RmObject, ITEM);
    console.log(new ITEM);

    /* CLUSTER */
    function CLUSTER() {
        ITEM.call(this, MenuType.LEAPFROG);
        this.attributes.push(Attr('items', REQUIERD, T_ITEM, IS_ARRAY));
        this.isAbstract = false;
    }
    this.CLUSTER = CLUSTER;
    inheritEstablish(ITEM, CLUSTER);
    console.log(new CLUSTER);

    /* ELEMENT */
    function ELEMENT() {
        ITEM.call(this, MenuType.NULL);
        this.attributes.push(Attr('value', OPTIONAL, T_DATA_VALUE, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.ELEMENT = ELEMENT;
    inheritEstablish(ITEM, ELEMENT);
    console.log(new ELEMENT);




    /* Hisroty package */

    /* HISTORY */
    function HISTORY() {
        DATA_STRUCTURE.call(this, MenuType.ATTRIBUTE, PARSABLE);
        this.attributes.push(Attr('origin', REQUIERD, T_DV_DATE_TIME, NOT_ARRAY));
        this.attributes.push(Attr('events', OPTIONAL, T_EVENT, NOT_ARRAY));
        this.attributes.push(Attr('period', OPTIONAL, T_DV_DURATION, NOT_ARRAY));
        this.attributes.push(Attr('duration', OPTIONAL, T_DV_DURATION, NOT_ARRAY));
        this.attributes.push(Attr('summary', OPTIONAL, T_ITEM_STRUCTURE, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.HISTORY = HISTORY;
    inheritEstablish(DATA_STRUCTURE, HISTORY);
    console.log(new HISTORY);

    /* EVENT */
    function EVENT() {
        RmObject.call(this, MenuType.ATTRIBUTE, PARSABLE);
        this.attributes.push(Attr('time', REQUIERD, T_DV_DATE_TIME, NOT_ARRAY));
        this.attributes.push(Attr('data', REQUIERD, T_ITEM_STRUCTURE, NOT_ARRAY));
        this.attributes.push(Attr('state', OPTIONAL, T_ITEM_STRUCTURE, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.EVENT = EVENT;
    inheritEstablish(RmObject, EVENT);
    console.log(new EVENT);

    /* POINT_EVENT */
    function POINT_EVENT() {
        EVENT.call(this);
        this.isAbstract = false;
    }
    this.POINT_EVENT = POINT_EVENT;
    inheritEstablish(EVENT, POINT_EVENT);
    console.log(new POINT_EVENT);

    /* INTERVAL_EVENT */
    function INTERVAL_EVENT() {
        EVENT.call(this);
        this.attributes.push(Attr('width', REQUIERD, T_DV_DURATION, NOT_ARRAY));
        this.attributes.push(Attr('math_function', REQUIERD, T_DV_CODED_TEXT, NOT_ARRAY));
        this.attributes.push(Attr('sample_count', REQUIERD, T_INTEGER, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.INTERVAL_EVENT = INTERVAL_EVENT;
    inheritEstablish(EVENT, INTERVAL_EVENT);
    console.log(new INTERVAL_EVENT);



    /* Support im */
    /* UID */
    function UID() {
        RmObject.call(this, MenuType.NULL, PARSABLE);
        this.attributes.push(Attr('value', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.UID = UID;
    inheritEstablish(RmObject, UID);
    console.log(new UID);

    /* ISO_ID */
    function ISO_ID() {
        UID.call(this);
        this.isAbstract = false;
    }
    this.ISO_ID = ISO_ID;
    inheritEstablish(UID, ISO_ID);
    console.log(new ISO_ID);

    /* UUID */
    function UUID() {
        UID.call(this);
        this.isAbstract = false;
    }
    this.UUID = UUID;
    inheritEstablish(UID, ISO_ID);
    console.log(new UUID);

    /* INTERNET_ID */
    function INTERNET_ID() {
        UID.call(this);
        this.isAbstract = false;
    }
    this.INTERNET_ID = INTERNET_ID;
    inheritEstablish(UID, INTERNET_ID);
    console.log(new INTERNET_ID);

    /* OBJECT_ID */
    function OBJECT_ID() {
        RmObject.call(this, MenuType.NULL, PARSABLE);
        this.attributes.push(Attr('value', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.OBJECT_ID = OBJECT_ID;
    inheritEstablish(RmObject, OBJECT_ID);
    console.log(new OBJECT_ID);

    /* UID_BASE_ID */
    function UID_BASE_ID() {
        OBJECT_ID.call(this);
        this.attributes.push(Attr('root', REQUIERD, T_UID, NOT_ARRAY));
        this.attributes.push(Attr('extension', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.UID_BASE_ID = UID_BASE_ID;
    inheritEstablish(OBJECT_ID, UID_BASE_ID);
    console.log(new UID_BASE_ID);

    /* HIER_OBJECT_ID */
    function HIER_OBJECT_ID() {
        UID_BASE_ID.call(this);
        this.isAbstract = false;
    }
    this.HIER_OBJECT_ID = HIER_OBJECT_ID;
    inheritEstablish(UID_BASE_ID, HIER_OBJECT_ID);
    console.log(new HIER_OBJECT_ID);

    /* OBJECT_VERSION_ID */
    function OBJECT_VERSION_ID() {
        UID_BASE_ID.call(this);;
        this.attributes.push(Attr('object_id', REQUIERD, T_UID, NOT_ARRAY));
        this.attributes.push(Attr('version_tree_id', REQUIERD, T_VERSIONI_TREE_ID, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.OBJECT_VERSION_ID = OBJECT_VERSION_ID;
    inheritEstablish(UID_BASE_ID, OBJECT_VERSION_ID);
    console.log(new OBJECT_VERSION_ID);

    /* VERSION_TREE_ID */
    function VERSION_TREE_ID() {
        RmObject.call(this, MenuType.NULL);
        this.attributes.push(Attr('value', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.VERSION_TREE_ID = VERSION_TREE_ID;
    inheritEstablish(RmObject, VERSION_TREE_ID);
    console.log(new VERSION_TREE_ID);

    /* ARCHETYPE_ID */
    function ARCHETYPE_ID() {
        OBJECT_ID.call(this, MenuType.NULL);
        this.attributes.push(Attr('qualified_rm_entity', REQUIERD, T_STRING, NOT_ARRAY));
        this.attributes.push(Attr('domain_concept', REQUIERD, T_STRING, NOT_ARRAY));
        this.attributes.push(Attr('rm_originator', REQUIERD, T_STRING, NOT_ARRAY));
        this.attributes.push(Attr('rm_name', REQUIERD, T_STRING, NOT_ARRAY));
        this.attributes.push(Attr('rm_entity', REQUIERD, T_STRING, NOT_ARRAY));
        this.attributes.push(Attr('specialisation', REQUIERD, T_STRING, NOT_ARRAY));
        this.attributes.push(Attr('version_id', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.ARCHETYPE_ID = ARCHETYPE_ID;
    inheritEstablish(OBJECT_ID, ARCHETYPE_ID);
    console.log(new ARCHETYPE_ID());

    /* TERMINOLOGY_ID */
    function TERMINOLOGY_ID() {
        OBJECT_ID.call(this);
        this.attributes.push(Attr('name', REQUIERD, T_STRING, NOT_ARRAY));
        this.attributes.push(Attr('version_id', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.TERMINOLOGY_ID = TERMINOLOGY_ID;
    inheritEstablish(OBJECT_ID, TERMINOLOGY_ID);
    console.log(new TERMINOLOGY_ID());

    /* GENERIC_ID */
    function GENERIC_ID() {
        OBJECT_ID.call(this);
        this.attributes.push(Attr('scheme', REQUIERD, T_STRING, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.GENERIC_ID = GENERIC_ID;
    inheritEstablish(OBJECT_ID, GENERIC_ID);
    console.log(new GENERIC_ID());

    /* OBJECT_REF */
    function OBJECT_REF() {
        RmObject.call(this, MenuType.NULL, PARSABLE);
        this.attributes.push(Attr('id', REQUIERD, OBJECT_ID, NOT_ARRAY));
        this.attributes.push(Attr('namespace', REQUIERD, T_STRING, NOT_ARRAY));
        this.attributes.push(Attr('type', REQUIERD, T_STRING), NOT_ARRAY);
        this.isAbstract = true;
    }
    this.OBJECT_REF = OBJECT_REF;
    inheritEstablish(RmObject, OBJECT_REF);
    console.log(new OBJECT_REF());

    /* ACCESS_GROUP_REF */
    function ACCESS_GROUP_REF() {
        OBJECT_REF.call(this);
        this.isAbstract = false;
    }
    this.ACCESS_GROUP_REF = ACCESS_GROUP_REF;
    inheritEstablish(OBJECT_REF, ACCESS_GROUP_REF);
    console.log(new ACCESS_GROUP_REF());

    /* PARTY_REF */
    function PARTY_REF() {
        OBJECT_REF.call(this);
        this.isAbstract = false;
    }
    this.PARTY_REF = PARTY_REF;
    inheritEstablish(OBJECT_REF, PARTY_REF);
    console.log(new PARTY_REF());

    /* LOCATABLE_REF */
    function LOCATABLE_REF() {
        OBJECT_REF.call(this);
        this.attributes.push(Attr('id', REQUIERD, T_OBJECT_VERSION_ID, NOT_ARRAY));
        this.attributes.push(Attr('path', OPTIONAL, T_STRING, NOT_ARRAY));
        this.isAbstract = false;

    }
    this.LOCATABLE_REF = LOCATABLE_REF;
    inheritEstablish(OBJECT_REF, LOCATABLE_REF);
    var locatable_ref = new LOCATABLE_REF();
    console.log(locatable_ref);










    /* Demographic im*/
    /* Demographic package */
    /* PARTY */
    function PARTY() {
        LOCATABLE.call(this, MenuType.ATTRIBUTE, PARSABLE);
        //   this.attributes.push(Attr('uid', REQUIERD, T_HIER_OBJECT_ID, NOT_ARRAY));
        this.attributes.push(Attr('identities', REQUIERD, T_PARTY_IDENTITY, IS_ARRAY));
        this.attributes.push(Attr('contacts', REQUIERD, T_CONTACT, NOT_ARRAY));
        this.attributes.push(Attr('relationships', REQUIERD, T_PARTY_IDENTITY, IS_ARRAY));
        this.attributes.push(Attr('revers_relationships', OPTIONAL, T_LOCATABLE_REF, IS_ARRAY));
        this.attributes.push(Attr('details', REQUIERD, T_ITEM_STRUCTURE, NOT_ARRAY));
        this.isAbstract = true;

    }
    inheritEstablish(LOCATABLE, PARTY);
    var party = new PARTY();
    console.log(new PARTY);

    /* PARTY_IDENTITY */
    function PARTY_IDENTITY() {
        LOCATABLE.call(this, MenuType.NULL, PARSABLE);
        this.attributes.push(Attr('details', REQUIERD, T_ITEM_STRUCTURE, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.PARTY_IDENTITY = PARTY_IDENTITY;
    inheritEstablish(LOCATABLE, PARTY_IDENTITY);
    var party_identity = new PARTY_IDENTITY();
    console.log(new PARTY_IDENTITY);

    /* CONTACT */
    function CONTACT() {
        LOCATABLE.call(this, MenuType.ATTRIBUTE, PARSABLE);
        this.attributes.push(Attr('time_validity', OPTIONAL, T_DV_INTERVAL_DATE_TIME, NOT_ARRAY));
        this.attributes.push(Attr('addresses', REQUIERD, T_ADDRESS, IS_ARRAY));
        this.isAbstract = false;
    }
    this.CONTACT = CONTACT;
    inheritEstablish(LOCATABLE, CONTACT);
    var contact = new CONTACT();
    console.log(contact);

    /* ADDRESS */
    function ADDRESS() {
        LOCATABLE.call(this, MenuType.ATTRIBUTE, PARSABLE);
        this.attributes.push(Attr('details', REQUIERD, T_ITEM_STRUCTURE, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.ADDRESS = ADDRESS;
    inheritEstablish(LOCATABLE, ADDRESS);
    var address = new ADDRESS();
    console.log(address);

    /* ARCTOR */
    function ACTOR() {
        PARTY.call(this);
        this.attributes.push(Attr('roles', OPTIONAL, T_PARTY_REF, IS_ARRAY));
        this.attributes.push(Attr('languages', OPTIONAL, T_DV_TEXT, IS_ARRAY));
        this.isAbstract = false;
    }
    this.ACTOR = ACTOR;
    inheritEstablish(PARTY, ACTOR);
    /*Test*/
    var actor = new ACTOR();
    console.log(actor);

    /* PERSON */
    function PERSON() {
        ACTOR.call(this);
        this.isAbstract = false;
    }
    this.PERSON = PERSON;
    inheritEstablish(PERSON, ACTOR);
    var person = new PERSON();
    console.log(person);

    /* ORGNIZATION */
    function ORGNIZATION() {
        ACTOR.call(this);
        this.isAbstract = false;
    }
    this.ORGNIZATION = ORGNIZATION;
    inheritEstablish(ACTOR, ORGNIZATION);
    /*Test*/
    var orgnization = new ORGNIZATION();
    console.log(orgnization);

    /* GROUP */
    function GROUP() {
        ACTOR.call(this);
        this.isAbstract = false;
    }
    this.GROUP = GROUP;
    inheritEstablish(ACTOR, GROUP);
    /*Test*/
    var group = new GROUP();
    console.log(group);

    /* AGENT */
    function AGENT() {
        ACTOR.call(this);
        this.isAbstract = false;
    }
    this.AGENT = AGENT;
    inheritEstablish(ACTOR, AGENT);
    /*TEST*/
    var agent = new AGENT();
    console.log(agent);

    /* ROLE */
    function ROLE() {
        PARTY.call(this);
        this.attributes.push(Attr('capabilities', OPTIONAL, T_CAPABILITY, IS_ARRAY));
        this.attributes.push(Attr('time_validity', OPTIONAL, T_DV_INTERVAL_DATE_TIME, IS_ARRAY));
        this.attributes.push(Attr('performer', REQUIERD, T_PARTY_REF, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.ROLE = ROLE;
    inheritEstablish(PARTY, ROLE);
    /*Test*/
    var role = new ROLE();
    console.log(role);

    /* CAPABILITY */
    function CAPABILITY() {
        LOCATABLE.call(this, MenuType.ATTRIBUTE, PARSABLE);
        this.attributes.push(Attr('credentials', REQUIERD, T_ITEM_STRUCTURE, NOT_ARRAY));
        this.attributes.push(Attr('time_validity', OPTIONAL, T_DV_INTERVAL_DATE_TIME, NOT_ARRAY));
        this.isAbstract = false;

    }
    this.CAPABILITY = CAPABILITY;
    inheritEstablish(LOCATABLE, CAPABILITY);
    /*Test*/
    var capability = new CAPABILITY();
    console.log(capability);

    /* PARTY_RELATIONSHIP */
    function PARTY_RELATIONSHIP() {
        LOCATABLE.call(this, MenuType.ATTRIBUTE, PARSABLE);
        this.attributes.push(Attr('uid', REQUIERD, T_HIER_OBJECT_ID, NOT_ARRAY));
        this.attributes.push(Attr('source', REQUIERD, PARTY_REF, NOT_ARRAY));
        this.attributes.push(Attr('target', REQUIERD, PARTY_REF, NOT_ARRAY));
        this.attributes.push(Attr('details', OPTIONAL, T_ITEM_STRUCTURE, NOT_ARRAY));
        this.attributes.push(Attr('time_validity', OPTIONAL, T_DV_INTERVAL_DATE_TIME, NOT_ARRAY));
        this.isAbstract = false;

    }
    this.PARTY_RELATIONSHIP = PARTY_RELATIONSHIP;
    inheritEstablish(LOCATABLE, PARTY_RELATIONSHIP);
    /*Test*/
    var party_relationship = new PARTY_RELATIONSHIP();
    console.log(party_relationship);



    /* Composition package */

    /* CONTENT_ITEM*/
    function CONTENT_ITEM() {
        LOCATABLE.call(this, MenuType.ATTRIBUTE, PARSABLE);
        this.isAbstract = true;
    }
    this.CONTENT_ITEM = CONTENT_ITEM;
    inheritEstablish(LOCATABLE, CONTENT_ITEM);
    console.log(new CONTENT_ITEM);

    /* EVENT_CONTEXT */
    function EVENT_CONTEXT() {
        PATHABLE.call(this, MenuType.ATTRIBUTE, PARSABLE);
        this.attributes.push(Attr('start_time', REQUIERD, T_DV_DATE_TIME, NOT_ARRAY));
        this.attributes.push(Attr('setting', REQUIERD, T_DV_CODED_TEXT, NOT_ARRAY));
        this.attributes.push(Attr('participation', OPTIONAL, T_PARTICIPATION, IS_ARRAY));
        this.isAbstract = false;
        /*
         * health_care_facility
         * end_time
         * location
         * other_context
         */
    }
    this.EVENT_CONTEXT = EVENT_CONTEXT;
    inheritEstablish(PATHABLE, EVENT_CONTEXT);
    console.log(new EVENT_CONTEXT);

    /* COMPOSITION */
    function COMPOSITION() {
        LOCATABLE.call(this, MenuType.ATTRIBUTE, PARSABLE);
        this.attributes.push(Attr('content', OPTIONAL, T_CONTENT_ITEM, IS_ARRAY));
        this.attributes.push(Attr('context', OPTIONAL, T_EVENT_CONTEXT, NOT_ARRAY));
        this.attributes.push(Attr('composer', OPTIONAL, T_PARTY_PROXY, NOT_ARRAY));
        this.attributes.push(Attr('category', REQUIERD, T_DV_CODED_TEXT, NOT_ARRAY));
        this.attributes.push(Attr('language', REQUIERD, T_CODE_PHRASE, NOT_ARRAY));
        this.attributes.push(Attr('territory', REQUIERD, T_CODE_PHRASE, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.COMPOSITION = COMPOSITION;
    inheritEstablish(LOCATABLE, COMPOSITION);
    console.log(new COMPOSITION);

    /* SECTION */
    function SECTION() {
        LOCATABLE.call(this, MenuType.ATTRIBUTE, PARSABLE);
        this.attributes.push(Attr('items', OPTIONAL, T_CONTENT_ITEM, IS_ARRAY));
    }
    this.SECTION = SECTION;
    inheritEstablish(LOCATABLE, SECTION);
    console.log(new SECTION);

    /* Entry package */

    /* ENTRY */
    function ENTRY() {
        CONTENT_ITEM.call(this);
        this.attributes.push(Attr('language', REQUIERD, T_CODE_PHRASE, NOT_ARRAY));
        this.attributes.push(Attr('encoding', REQUIERD, T_CODE_PHRASE, NOT_ARRAY));
        this.attributes.push(Attr('subject', REQUIERD, T_PARTY_PROXY, NOT_ARRAY));
        this.attributes.push(Attr('participation', OPTIONAL, T_PARTICIPATION, IS_ARRAY));
        this.attributes.push(Attr('provider', OPTIONAL, T_PARTY_PROXY, NOT_ARRAY));
        this.isAbstract = true;
    }
    inheritEstablish(CONTENT_ITEM, ENTRY);
    console.log(new ENTRY);

    /* ADMIN_ENTRY */
    function ADMIN_ENTRY() {
        ENTRY.call(this);
        this.attributes.push(Attr('data', REQUIERD, T_ITEM_STRUCTURE, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.ADMIN_ENTRY = ADMIN_ENTRY;
    inheritEstablish(ENTRY, ADMIN_ENTRY);
    console.log(new ADMIN_ENTRY);

    /* CARE ENTRY */
    function CARE_ENTRY() {
        ENTRY.call(this);
        this.attributes.push(Attr('protocol', OPTIONAL, T_ITEM_STRUCTURE, IS_ARRAY));
        this.isAbstract = true;
        /*
         * guideline_id
         */
    }

    inheritEstablish(ENTRY, CARE_ENTRY);
    console.log(new CARE_ENTRY);

    /* OBSERVATION */
    function OBSERVATION() {
        CARE_ENTRY.call(this);
        this.attributes.push(Attr('data', REQUIERD, T_HISTORY_ITEM_STRUCTURE, IS_ARRAY));
        this.attributes.push(Attr('state', OPTIONAL, T_HISTORY_ITEM_STRUCTURE, IS_ARRAY));
        this.isAbstract = false;
    }
    this.OBSERVATION = OBSERVATION;
    inheritEstablish(CARE_ENTRY, OBSERVATION);
    console.log(new OBSERVATION);

    /* EVALUATION */
    function EVALUATION() {
        CARE_ENTRY.call(this);
        this.attributes.push(Attr('data', REQUIERD, T_ITEM_STRUCTURE, IS_ARRAY));
        this.isAbstract = false;

    }
    this.EVALUATION = EVALUATION;
    inheritEstablish(CARE_ENTRY, EVALUATION);
    console.log(new EVALUATION);

    /* INSTRUCTION */
    function INSTRUCTION() {
        CARE_ENTRY.call(this);
        this.attributes.push(Attr('activities', OPTIONAL, ACTIVITY, IS_ARRAY));
        this.attributes.push(Attr('expiry_time', OPTIONAL, DV_DATE_TIME, NOT_ARRAY));
        this.attributes.push(Attr('narrative', REQUIERD, T_DV_TEXT, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.INSTRUCTION = INSTRUCTION;
    inheritEstablish(CARE_ENTRY, INSTRUCTION);
    console.log(new INSTRUCTION);

    /* ACTIVITY  */
    function ACTIVITY() {
        LOCATABLE.call(this, MenuType.LEAPFROG);
        this.attributes.push(Attr('description', REQUIERD, T_ITEM_STRUCTURE, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.ACTIVITY = ACTIVITY;
    inheritEstablish(LOCATABLE, ACTIVITY);
    console.log(new ACTIVITY);

    /* ACTION */
    function ACTION() {
        CARE_ENTRY.call(this);
        this.attributes.push(Attr('time', REQUIERD, T_DV_DATE_TIME, NOT_ARRAY));
        this.attributes.push(Attr('description', REQUIERD, T_ITEM_STRUCTURE, NOT_ARRAY));
        this.attributes.push(Attr('ism_transition', REQUIERD, T_ISM_TRANSITION, NOT_ARRAY));
        this.attributes.push(Attr('instruction_details', OPTIONAL, T_INSTRUCTION_DETAILS, NOT_ARRAY));
        this.isAbstract = false;
    }
    this.ACTION = ACTION;
    inheritEstablish(CARE_ENTRY, ACTION);
    console.log(new ACTION);

    /* INSTRUCTION_DETAILS */
    function INSTRUCTION_DETAILS() {
        PATHABLE.call(this, MenuType.ATTRIBUTE, PARSABLE);
        this.attributes.push(Attr('introduction_id', REQUIERD, T_LOCATABLE_REF, NOT_ARRAY));
        this.attributes.push(Attr('activity_id', REQUIERD, T_STRING, NOT_ARRAY));
        this.attributes.push(Attr('wf_details', OPTIONAL, T_ITEM_STRUCTURE, NOT_ARRAY));
        this.isAbstract = false;

    }
    this.INSTRUCTION_DETAILS = INSTRUCTION_DETAILS;
    inheritEstablish(PATHABLE, INSTRUCTION_DETAILS);
    console.log(new INSTRUCTION_DETAILS);

    /* ISM_TRANSITION */
    function ISM_TRANSITION() {
        PATHABLE.call(this, MenuType.ATTRIBUTE, PARSABLE);
        this.attributes.push(Attr('current_state', REQUIERD, T_DV_CODED_TEXT, NOT_ARRAY));
        this.attributes.push(Attr('transition', OPTIONAL, T_DV_CODED_TEXT, NOT_ARRAY));
        this.attributes.push(Attr('careflow_step', OPTIONAL, T_DV_CODED_TEXT, NOT_ARRAY));
        this.isAbstract = false;

    }
    this.ISM_TRANSITION = ISM_TRANSITION;
    inheritEstablish(PATHABLE, ISM_TRANSITION);
    console.log(new ISM_TRANSITION);
    console.log((new ISM_TRANSITION).type);

})
