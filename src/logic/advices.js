
import Enum from 'enum';

import * as rules from '@/logic/rules.js';


const ADVICE_TYPE = new Enum({GROUP_HAS_NO_SCORED_ITEMS: 0,
                              BEST_SOLUTIONS_DIFFERENCES: 1},
                             {name: 'ADVICE_TYPE',
                              freez: true });


let ADVICE_TYPE_INFO = [];

ADVICE_TYPE_INFO[ADVICE_TYPE_INFO.GROUP_HAS_NO_SCORED_ITEMS] = {name: "Group has no scored items"};
ADVICE_TYPE_INFO[ADVICE_TYPE_INFO.BEST_SOLUTIONS_DIFFERENCES] = {name: "Best solutions has minor differences"};

function rawAdvice({type, uid, data}) {
    return {type: type.key,
            uid: `advice:${type.key}:${uid}`,
            data: data};
}


function AdviceGroupHasNoScoredItems({currentRules, solutions}) {

    const advices = [];

    for (let ruleId in currentRules) {
        const rule = currentRules[ruleId];

        if (!rules.RULE_TYPE.GROUP.is(rule.type)) {
            continue;
        }

        let scoredItemFound = false;

        for (let i in rule.template.items) {
            const itemId = rule.template.items[i];

            const scoreRuleId = rules.ruleIdForTypeAndItem(currentRules,
                                                           rules.RULE_TYPE.ITEM_SCORE,
                                                           itemId);

            if (scoreRuleId != null) {
                scoredItemFound = true;
                break
            }
        }

        if (!scoredItemFound) {
            advices.push(rawAdvice({type: ADVICE_TYPE.GROUP_HAS_NO_SCORED_ITEMS,
                                    uid: ruleId,
                                    data: {ruleId: ruleId}}));
        }
    }

    return advices;
};


function BestSolutionsDifferences({currentRules, solutions}) {

    const minorChangesMaximum = 5;
    const majorChangesMaximum = 5;

    if (solutions.length == 0) {
        return [];
    }

    const bestScore = solutions[0].score;

    solutions = solutions.filter(solution => solution.score == bestScore);

    const advices = [];

    for (let i=0; i<solutions.length-1; i++) {
        for (let j=i+1; j < solutions.length; j++) {
            const itemsA = solutions[i].items;
            const itemsB = solutions[j].items;

            const commonItems = rules.intersect(itemsA, itemsB);

            const uniqueItemsA = itemsA.filter(itemId => commonItems.indexOf(itemId) == -1);
            const uniqueItemsB = itemsB.filter(itemId => commonItems.indexOf(itemId) == -1);

            const uidSource = [...uniqueItemsA, ...uniqueItemsB];

            uidSource.sort();

            advices.push(rawAdvice({type: ADVICE_TYPE.BEST_SOLUTIONS_DIFFERENCES,
                                    uid: uidSource.join('/'),
                                    data: {itemsCommon: commonItems,
                                           itemsA: uniqueItemsA,
                                           itemsB: uniqueItemsB}}));
        }
    }

    if (advices.length <= minorChangesMaximum + majorChangesMaximum) {
        return advices;
    }

    advices.sort(function(a, b) {
        const complexityA = a.data.itemsA.length + a.data.itemsB.length;
        const complexityB = b.data.itemsA.length + b.data.itemsB.length;

        if (complexityA > complexityB) {
            return 1;
        }

        if (complexityA < complexityB) {
            return -1;
        }

        return 0;
    });

    return [...advices.slice(0, minorChangesMaximum + 1),
            ...advices.slice(-majorChangesMaximum)];
}


let ADVICES = {}

ADVICES[ADVICE_TYPE.GROUP_HAS_NO_SCORED_ITEMS] = AdviceGroupHasNoScoredItems;
ADVICES[ADVICE_TYPE_INFO.BEST_SOLUTIONS_DIFFERENCES] = BestSolutionsDifferences;


function generateAdvices({currentRules, solutions}) {
    const advices = [];

    for (let type in ADVICES) {
        const newAdvices = ADVICES[type]({currentRules: currentRules,
                                          solutions: solutions});

        advices.push(...newAdvices);
    }

    return advices;
}


export {ADVICE_TYPE,
        ADVICE_TYPE_INFO,
        generateAdvices};
