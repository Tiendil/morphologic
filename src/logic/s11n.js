
const FORMAT_VERSION = 2;


import * as templates from '@/logic/templates.js';


function serialize({items, rules}) {
    return {version: FORMAT_VERSION,
            items: items,
            rules: rules};
}


function migration_from_1_to_2({data}) {
    data.version = 2;

    for (let i in data.rules.rules) {
        const rule = data.rules.rules[i];

        rule.template = templates.createItemsSet({items: rule.template.items});
    }
}


function actualizeFormat({data}) {

    if (data.varsion == 1) {
        migration_from_1_to_2({data: data});
    }

    return data;
}


export {FORMAT_VERSION,
        serialize,
        actualizeFormat};
