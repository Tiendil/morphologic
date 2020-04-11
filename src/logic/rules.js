
import Enum from 'enum';


const RULE_TYPE = new Enum({CUSTOM: 0,
                            ITEM_MODE: 1,
                            GROUP: 2},
                           {name: "RULE_TYPE",
                            freeze: true });


const ACTION_TYPE = new Enum({ACCEPT: 0,
                              REJECT: 1},
                             {name: "ACTION_TYPE",
                              freeze: true });


let ACTION_TYPE_INFO = {};

ACTION_TYPE_INFO[ACTION_TYPE.ACCEPT] = {text: "Accept solution"};
ACTION_TYPE_INFO[ACTION_TYPE.REJECT] = {text: "Reject solution"};


const CONDITION_TYPE = new Enum({ALL_OF: 0,
                                 NONE_OF: 1,
                                 CARDINALITY: 2},
                             {name: "CONDITION_TYPE",
                              freeze: true });


let CONDITION_TYPE_INFO = {};

CONDITION_TYPE_INFO[CONDITION_TYPE.ALL_OF] = {text: "All of"};
CONDITION_TYPE_INFO[CONDITION_TYPE.NONE_OF] = {text: "None of"};
CONDITION_TYPE_INFO[CONDITION_TYPE.CARDINALITY] = {text: "N of"};


function getEnumSelectInfo(enumObject, enumInfos) {

    const types = [];
    const infos = [];

    for (let i in enumObject.enums) {
        const item = enumObject.enums[i];

        types.push(item.key);
        infos.push({'value': item.key, 'text': enumInfos[item].text});
    }

    return {types: types,
            infos: infos};

}


function syncCardinality(rule) {
    if (!CONDITION_TYPE.CARDINALITY.is(rule.condition.type)) {
        return;
    }

    rule.condition.args.nOf.min = Math.min(rule.condition.args.nOf.min, rule.template.items.length);
    rule.condition.args.nOf.max = Math.min(rule.condition.args.nOf.max, rule.template.items.length);
}


function rawCreateRule(data) {

    const name = data.name || ''

    const template = {items: data.items || []};

    let condition = data.condition;

    if (!condition) {
        condition = {type: CONDITION_TYPE.ALL_OF.key,
                     args: {nOf: {min: 1,
                                  max: 1}}};
    }

    const action = {type: ACTION_TYPE.ACCEPT.key,
                    args: {}}

    const rule = {name: name,
                  type: data.type.key,
                  template: template,
                  condition: condition,
                  action: action,
                  avatarIndex: null};

    return rule;
}


function rawUpdateRule(rule, newData) {
    for (let key in newData) {
        rule[key] = newData[key];
    }
}


// intersect sets implemented in arrays
// bad solution, whatever, it will be implemented in normal language on server side
function intersect(itemsA, itemsB) {
    const result = [];

    itemsB.forEach((item) => {
        if (itemsA.indexOf(item) != -1) {
            result.push(item);
        }
    });

    return result;
}


class Checker {

    constructor(items, condition, action) {
        this.items = items;
        this.condition = condition;
        this.action = action;
    }

    conditionAnswer(intersection) {
        if (CONDITION_TYPE.ALL_OF.is(this.condition.type)) {
            return this.items.length == intersection.length;
        }

        if (CONDITION_TYPE.NONE_OF.is(this.condition.type)) {
            return intersection.length == 0;
        }

        if (CONDITION_TYPE.CARDINALITY.is(this.condition.type)) {
            const border = this.condition.args.nOf;
            return (border.min <= intersection.length && intersection.length <= border.max);
        }
    }

    checkUpper(searcher, item) {
        if (ACTION_TYPE.ACCEPT.is(this.action.type)) {
            return true;
        }

        const intersection = intersect([...searcher.items, item], this.items);

        if (ACTION_TYPE.REJECT.is(this.action.type)) {
            return !this.conditionAnswer(intersection);
        }
    }

    checkLower(searcher) {
        const intersection = intersect(searcher.items.slice(), this.items);

        if (ACTION_TYPE.ACCEPT.is(this.action.type)) {
            return this.conditionAnswer(intersection);
        }

        if (ACTION_TYPE.REJECT.is(this.action.type)) {
            return !this.conditionAnswer(intersection);
        }
    }
}


function getCheckers(rule) {
    return [new Checker(rule.template.items,
                        rule.condition,
                        rule.action)];
}


export {RULE_TYPE,
        ACTION_TYPE,
        ACTION_TYPE_INFO,
        CONDITION_TYPE,
        CONDITION_TYPE_INFO,
        getEnumSelectInfo,
        rawCreateRule,
        rawUpdateRule,
        getCheckers,
        syncCardinality};