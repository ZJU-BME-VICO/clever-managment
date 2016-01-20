angular.module('clever.management.filters.typemap', []).filter('typemap', function() {


    var typeMap = {
        'DV_TEXT': 'text',
        'DV_CODED_TEXT': 'text',
        'SLOT': 'slot',
        'DV_QUANTITY': 'quantity',
        'DV_ORDINAL': 'ordinal',
        'ANY': 'any',
        'DV_DATE_TIME': 'datetime',
        'DV_DATE': 'datetime',
        'DV_TIME': 'datetime',
        'DV_COUNT': 'count',
        'DV_DURATION': 'duration',
        'DV_INTERVAL<DV_DATE>': 'interval_datetime',
        'DV_INTERVAl<DV_TIME>': 'interval_datetime',
        'DV_INTERVAL<DV_DATE_TIME>': 'interval_datetime',
        'DV_INTERVAL<COUNT>': 'interval_count',
        'DV_INTERVAL<DV_COUNT>': 'interval_count',
        'DV_INTERVAL<QUANTITY>': 'interval_quantity',
        'DV_INTERVAL<DV_QUANTITY>': 'interval_quantity',
        'CHOICE': 'choice',
        'DV_MULTIMEDIA': 'multimedia',
        'DV_URI': 'uri',
        'DV_PROPORTION': 'ratio',
        'DV_IDENTIFIER': 'id',
        'DV_PARSABLE': 'parsable',
        'DV_BOOLEAN': 'truefalse',
        'LINK': 'link',

        'EVENT': 'any',
        'POINT_EVENT': 'pointintime',
        'INTERVAL_EVENT': 'interval',

        'ITEM_LIST': 'structure',
        'ITEM_TREE': 'structure',
        'PARTY_INDENTITY': 'party_identity',
        'ANDDRESS': 'address',
        'PARTY_RELATIONSHIP': 'party_relationship',
        'CAPABILITY': 'capbliity',
        'ORGANISATION': 'organisation',
        'CONTACT': 'contact',
        'PERSON': 'demographic',
        'ROLE': 'role',
        'ADMIN_ENTRY': 'admin',
        'PARTICIPATION': 'participation',

        //attribute
        'subject': 'attribute',
        'protocol': 'attribute',
        'links': 'attribute',
        'ism_transition': 'attribute',
        'events': 'attribute',
        'otherparticipations': 'attribute',
        'state': 'attribute',
        'data': 'attribute',
        'section': 'attribute',
        'content': 'attribute',
        'context': 'attribute',
        'composer': 'attribute',
        'category': 'attribute',
        'language': 'attribute',
        'territory': 'attribute',

        //node menu

        'text': 'dv_text',
        'coded text': 'dv_text',
        'quantity': 'dv_quantity',
        'count': 'dv_count',
        'date time': 'dv_date_time',
        'duration': 'dv_duration',
        'ordinal': 'dv_ordinal',
        'boolean': 'dv_boolean',
        'multimedia': 'dv_multimedia',
        'uri': 'dv_uri',
        'identifier': 'dv_identifier',
        'proportion': 'dv_proportion',
        'cluster': 'cluster',
        'interval': 'dv_interval',
        'integer': 'dv_count',
        'item': ''


    };

    return function(input) {
        return typeMap[input] ? typeMap[input] : input;
    };
});
