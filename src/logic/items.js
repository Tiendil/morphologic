
import Enum from 'enum';

import * as rules from '@/logic/rules.js';


const ITEM_MODE = new Enum({OPTIONAL: 0,
                            REQUIRED: 1,
                            EXCLUDED: 2},
                           {name: "ITEM_MODE",
                            freez: true });


let ITEM_MODE_INFO = [];

ITEM_MODE_INFO[ITEM_MODE.OPTIONAL] = {name: "Optional"};
ITEM_MODE_INFO[ITEM_MODE.REQUIRED] = {name: "Required"};
ITEM_MODE_INFO[ITEM_MODE.EXCLUDED] = {name: "Excluded"};


function itemModeByRule(rule) {
    if (rules.ACTION_TYPE.ACCEPT.is(rule.action.type)) {
        return ITEM_MODE.REQUIRED;
    }

    if (rules.ACTION_TYPE.REJECT.is(rule.action.type)) {
        return ITEM_MODE.EXCLUDED;
    }

    return ITEM_MODE.OPTIONAL;
}


function ruleNameForItemMode(item, mode) {
    if (ITEM_MODE.REQUIRED.is(mode)) {
        return `Require ${item.text}`;
    }

    if (ITEM_MODE.EXCLUDED.is(mode)) {
        return `Exclude ${item.text}`;
    }

    return null;
}


export {ITEM_MODE, ITEM_MODE_INFO, itemModeByRule, ruleNameForItemMode};
