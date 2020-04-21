
import Enum from 'enum';

import * as uuid from 'uuid';


const EXPRESSION_TYPE = new Enum({ITEM: 0,
                                  SET: 1,
                                  ALTERNATIVE: 2},
                                 {name: "EXPRESSION_TYPE",
                                  freeze: true });


let EXPRESSION_TYPE_INFO = {};

EXPRESSION_TYPE_INFO[EXPRESSION_TYPE.ITEM] = {};
EXPRESSION_TYPE_INFO[EXPRESSION_TYPE.SET] = {};
EXPRESSION_TYPE_INFO[EXPRESSION_TYPE.ALTERNATIVE] = {};


function exprItem({itemId}) {
    return {type: EXPRESSION_TYPE.ITEM.key,
            uid: uuid.v4(),
            data: {itemId: itemId}};
}


function exprSet() {
    return {type: EXPRESSION_TYPE.SET.key,
            uid: uuid.v4(),
            data: {expressions: []}};
}


function exprAlternative() {
    return {type: EXPRESSION_TYPE.ALTERNATIVE.key,
            uid: uuid.v4(),
            data: {expressions: []}};
}


function addExpression({root, child}) {
    if ( !(EXPRESSION_TYPE.SET.is(root.type) ||
           EXPRESSION_TYPE.ALTERNATIVE.is(root.type)) ) {
        throw `Can not add expression: wrong type of root expression ${root.type}`;
    }

    root.data.expressions.push(child);
}


function subexpressionIndexByUID({expression, uid}) {
    if ( !(EXPRESSION_TYPE.SET.is(expression.type) ||
           EXPRESSION_TYPE.ALTERNATIVE.is(expression.type)) ) {
        throw `Wrong expression type`;
    }

    let index = null;

    for (let i in expression.data.expressions) {
        if (expression.data.expressions[i].uid == uid) {
            index = i;
            break;
        }
    }

    if (index == null) {
        throw `Can not find subexpression "${uid}"`;
    }

    return index;

}


function replaceExpression({expression, uid, newExpression}) {
    if ( !(EXPRESSION_TYPE.SET.is(expression.type) ||
           EXPRESSION_TYPE.ALTERNATIVE.is(expression.type)) ) {
        throw `Can not add expression: wrong type of root expression ${root.type}`;
    }

    const index = subexpressionIndexByUID({expression: expression,
                                           uid: uid});

    expression.data.expressions.splice(index, 1, newExpression);
}


function removeExpression({expression, uid}) {
    if ( !(EXPRESSION_TYPE.SET.is(expression.type) ||
           EXPRESSION_TYPE.ALTERNATIVE.is(expression.type)) ) {
        return false;
    }

    let index = null;

    for (let i in expression.data.expressions) {
        if (expression.data.expressions[i].uid == uid) {
            index = i;
            break;
        }
    }

    if (index == null) {
        return false;
    }

    expression.data.expressions.splice(index, 1);

    return true;
}


function simplifyExpression({expression}) {
    if (EXPRESSION_TYPE.ITEM.is(expression.type)) {
        return false;
    }

    if (EXPRESSION_TYPE.SET.is(expression.type)) {
        for (let i in expression.data.expressions) {
            let child = expression.data.expressions[i];

            if (isExpressionEmpty(child)) {
                removeExpression({expression: expression, uid: child.uid});
                return true;
            }

            if  (EXPRESSION_TYPE.SET.is(child.type)) {
                expression.data.expressions.splice(i, 1, ...child.data.expressions);
                return true;
            }
        }
    }

    if (EXPRESSION_TYPE.ALTERNATIVE.is(expression.type)) {
        for (let i in expression.data.expressions) {

            let child = expression.data.expressions[i];

            if (isExpressionEmpty(child)) {
                removeExpression({expression: expression, uid: child.uid});
                return true;
            }

            if  (EXPRESSION_TYPE.ALTERNATIVE.is(child.type)) {
                expression.data.expressions.splice(i, 1, ...child.data.expressions);
                return true;
            }
        }
    }

    if (EXPRESSION_TYPE.ALTERNATIVE.is(expression.type) &&
        expression.data.expressions.length == 1) {
        Object.assign(expression, expression.data.expressions[0]);
        return true;
    }

    return false;
}


function isExpressionEmpty(expression) {
    if (EXPRESSION_TYPE.ITEM.is(expression.type)) {
        return false;
    }

    if (EXPRESSION_TYPE.SET.is(expression.type)) {
        return expression.data.expressions.length == 0;
    }

    if (EXPRESSION_TYPE.ALTERNATIVE.is(expression.type)) {
        return expression.data.expressions.length == 0;
    }

    return false;
}


function removeExpressionRecursive({expression, uid}) {
    if (removeExpression({expression: expression, uid: uid})) {
        return true;
    }

    if (EXPRESSION_TYPE.ITEM.is(expression.type)) {
        return false;
    }

    if (EXPRESSION_TYPE.SET.is(expression.type)) {
        for (let i in expression.data.expressions) {
            if (removeExpressionRecursive({expression: expression.data.expressions[i],
                                           uid: uid})) {
                return true;
            }
        }
        return false;
    }

    if (EXPRESSION_TYPE.ALTERNATIVE.is(expression.type)) {
        for (let i in expression.data.expressions) {
            if (removeExpressionRecursive({expression: expression.data.expressions[i],
                                           uid: uid})) {
                return true;
            }
        }
        return false;
    }

    return false;
}


function simplifyExpressionRecursive({expression}) {
    if (simplifyExpression({expression: expression})) {
        return true;
    }

    if (EXPRESSION_TYPE.ITEM.is(expression.type)) {
        return false;
    }

    if (EXPRESSION_TYPE.SET.is(expression.type)) {
        for (let i in expression.data.expressions) {
            if (simplifyExpressionRecursive({expression: expression.data.expressions[i]})) {
                return true;
            }
        }
        return false;
    }

    if (EXPRESSION_TYPE.ALTERNATIVE.is(expression.type)) {
        for (let i in expression.data.expressions) {
            if (simplifyExpressionRecursive({expression: expression.data.expressions[i]})) {
                return true;
            }
        }
        return false;
    }

    return false;
}


function removeExpressionFull({expression, uid}) {
    removeExpressionRecursive({expression: expression, uid: uid});

    while (simplifyExpressionRecursive({expression: expression})) {}
}


function hasItem({expression, itemId}) {
    return getItemExpressionUID({expression: expression, itemId: itemId}) != null;
}


function getItemExpressionUID({expression, itemId}) {
    if (EXPRESSION_TYPE.ITEM.is(expression.type)) {
        if (expression.data.itemId == itemId) {
            return expression.uid;
        }
        return null;
    }

    if (EXPRESSION_TYPE.SET.is(expression.type)) {
        for (let i in expression.data.expressions) {
            const uid = getItemExpressionUID({expression: expression.data.expressions[i],
                                              itemId: itemId});
            if (uid != null) {
                return uid;
            }
        }
        return null;
    }

    if (EXPRESSION_TYPE.ALTERNATIVE.is(expression.type)) {
        for (let i in expression.data.expressions) {
            const uid = getItemExpressionUID({expression: expression.data.expressions[i],
                                              itemId: itemId});
            if (uid != null) {
                return uid;
            }
        }
        return null;
    }

    return null;
}


function getItems({expression}) {
    if (EXPRESSION_TYPE.ITEM.is(expression.type)) {
        return new Set([expression.data.itemId]);
    }

    if (EXPRESSION_TYPE.SET.is(expression.type)) {
        const items = new Set();

        for (let i in expression.data.expressions) {
            for (let item of getItems({expression: expression.data.expressions[i]}).values()) {
                items.add(item);
            }
        }

        return items;
    }

    if (EXPRESSION_TYPE.ALTERNATIVE.is(expression.type)) {
        const items = new Set();

        for (let i in expression.data.expressions) {
            for (let item of getItems({expression: expression.data.expressions[i]}).values()) {
                items.add(item);
            }
        }

        return items;
    }

    return new Set();
}


function createItemsSet({items}) {
    const template = exprSet();

    const expressions = [];

    for (let i in items) {
        const itemExpression = exprItem({itemId: items[i]});
        addExpression({root: template,
                       child: itemExpression});
    }

    return template;
}


function combinationsNumber({expression}) {

    if (EXPRESSION_TYPE.ITEM.is(expression.type)) {
        return 1;
    }

    if (EXPRESSION_TYPE.SET.is(expression.type)) {
        let count = 1;

        for (let i in expression.data.expressions) {
            count *= combinationsNumber({expression: expression.data.expressions[i]})
        }

        return count;
    }

    if (EXPRESSION_TYPE.ALTERNATIVE.is(expression.type)) {
        let count = 0;

        for (let i in expression.data.expressions) {
            count += combinationsNumber({expression: expression.data.expressions[i]})
        }

        return count;
    }

    return [];
}


function setsGenerator(expression) {

    if (EXPRESSION_TYPE.ITEM.is(expression.type)) {
        return [new Set([expression.data.itemId])];
    }

    if (EXPRESSION_TYPE.SET.is(expression.type)) {
        let sets = [new Set()];

        for (let i in expression.data.expressions) {
            let expressionSets = setsGenerator(expression.data.expressions[i]);

            let newSets = [];

            for (let j in sets) {
                for (let k in expressionSets) {
                    newSets.push(new Set([...sets[j], ...expressionSets[k]]));
                }
            }

            sets = newSets;
        }

        return sets;n
    }

    if (EXPRESSION_TYPE.ALTERNATIVE.is(expression.type)) {
        let sets = [];

        for (let i in expression.data.expressions) {
            sets.push(...setsGenerator(expression.data.expressions[i]));
        }

        return sets;
    }
}


export {EXPRESSION_TYPE,
        EXPRESSION_TYPE_INFO,
        exprItem,
        exprSet,
        exprAlternative,
        addExpression,
        replaceExpression,
        hasItem,
        getItems,
        subexpressionIndexByUID,
        isExpressionEmpty,
        removeExpressionFull,
        createItemsSet,
        combinationsNumber,
        getItemExpressionUID,
        setsGenerator};
