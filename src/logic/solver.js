///////////////////////////////////////////
// Ideomatic, but highly unoptimised solver
///////////////////////////////////////////


class GroupRestriction {

    constructor(groupId, minItems, maxItems, items) {
        this.groupId = groupId;
        this.minItems = minItems;
        this.maxItems = maxItems;
        this.items = items;

        this.defaultMeta = {usedItems: 0}

        this.key = 'group-' + this.groupId;
    }

    isItemBelongToGroup(item) {
        return (this.items.indexOf(item) != -1);
    }

    nextMetaFor(searcher, item) {
        if (!this.isItemBelongToGroup(item)) {
            return null;
        }

        const meta = searcher.getMeta(this.key, this.defaultMeta);

        return {usedItems: meta.usedItems + 1};
    }

    checkUpper(searcher, item) {

        if (!this.isItemBelongToGroup(item)) {
            return true;
        }

        const meta = searcher.getMeta(this.key, this.defaultMeta);

        if (this.maxItems < meta.usedItems + 1) {
            return false;
        }

        return true;
    }

    checkLower(searcher) {
        const meta = searcher.getMeta(this.key, this.defaultMeta);

        if (meta.usedItems < this.minItems) {
            return false;
        }

        return true;
    }
}


class ItemsRequiredRestriction {

    constructor(items) {
        this.items = items;

        this.defaultMeta = {requiredItems: 0}

        this.key = 'items-required';
    }

    nextMetaFor(searcher, item) {
        const meta = searcher.getMeta(this.key, this.defaultMeta);

        if (this.items.indexOf(item) == -1) {
            return {requiredItems: meta.requiredItems};
        }

        return {requiredItems: meta.requiredItems + 1};
    }

    // TODO: we can restrict brute force by checking
    //       if we already processed group with requred items (and do not use them)
    checkUpper(searcher, item) {

        // if (!this.isItemBelongToGroup(item)) {
        //     return true;
        // }

        // const meta = searcher.getMeta(this.key, this.defaultMeta);

        // if (this.maxItems < meta.usedItems + 1) {
        //     return false;
        // }

        return true;
    }

    checkLower(searcher) {
        const meta = searcher.getMeta(this.key, this.defaultMeta);

        if (meta.requiredItems < this.items.length) {
            return false;
        }

        return true;
    }
}

class ItemsExcludedRestriction {

    constructor(items) {
        this.items = items;
        this.key = 'items-excluded';
    }

    nextMetaFor(searcher, item) {
    }

    checkUpper(searcher, item) {
        return (this.items.indexOf(item) == -1);
    }

    checkLower(searcher) {
        return true;
    }
}


class SolutionSearcher {

    constructor(bestSolutionsLimit) {
        this.items = [];
        this.rulesMeta = {};
        this.bestSolutions = [];
        this.bestSolutionsLimit = bestSolutionsLimit;
    }

    depth() {
        return this.items.length;
    }

    getMeta(key, defaultValue) {
        if (!(key in this.rulesMeta)) {
            return defaultValue;
        }

        if (this.rulesMeta[key].length == 0) {
            return defaultValue;
        }

        return this.rulesMeta[key][this.rulesMeta[key].length - 1].data;
    }

    setMeta(key, data) {
        if (!(key in this.rulesMeta)) {
            this.rulesMeta[key] = [];
        }
        this.rulesMeta[key].push({'depth': this.depth(),
                                  'data': data});
    }

    forward(item, metas) {
        this.items.push(item)

        for (let key in metas) {
            this.setMeta(key, metas[key]);
        }
    }

    backward() {
        for (let key in this.rulesMeta) {
            const metas = this.rulesMeta[key];

            if (!metas || metas.length == 0) {
                continue;
            }

            const lastMeta = metas[metas.length - 1];

            if (lastMeta.depth != this.depth()) {
                continue;
            }

            metas.pop();
        }

        this.items.pop();
    }

    worstBestSolution() {
        return this.bestSolutions[this.bestSolutions.length-1];
    }

    bestSolution() {
        return this.bestSolutions[0];
    }

    acceptCurrentSolution(cost) {

        while (this.bestSolutions.length && this.worstBestSolution().cost < cost) {
            this.bestSolutions.pop();
        }

        if (this.bestSolutions.length == this.bestSolutionsLimit) {
            return;
        }

        this.bestSolutions.push({'cost': cost,
                                 'items': this.items.slice()});
    }

}


function checkUpperRestrictions(searcher, restrictions, item) {

    for (let i in restrictions) {
        if (!restrictions[i].checkUpper(searcher, item)) {
            return false;
        }
    }

    return true;
}


function checkLowerRestrictions(searcher, restrictions) {

    for (let i in restrictions) {
        if (!restrictions[i].checkLower(searcher)) {
            return false;
        }
    }

    return true;
}


function getRestrictionsMetas(searcher, item, restrictions) {

    let metas = {};

    for (let i in restrictions) {
        const meta = restrictions[i].nextMetaFor(searcher, item);

        if (!meta) {
            continue;
        }

        metas[restrictions[i].key] = meta;
    }

    return metas;
}


function search(searcher, items, restrictions, nextItemIndex, statistics) {

    statistics.checkedSolutions += 1;

    if (checkLowerRestrictions(searcher, restrictions)) {
        statistics.ratedSolutions += 1;

        searcher.acceptCurrentSolution(searcher.depth());
    }

    for (let i=nextItemIndex; i<items.length; i++) {
        const item = items[i];

        if (!checkUpperRestrictions(searcher, restrictions, item)) {
            continue;
        }

        const metas = getRestrictionsMetas(searcher, item, restrictions);

        searcher.forward(item, metas);

        search(searcher, items, restrictions, i + 1, statistics);

        searcher.backward();
    }
};



function solve(items, restrictions) {

    const statistics = {checkedSolutions: 0,
                        ratedSolutions: 0};

    const searcher = new SolutionSearcher(3);

    search(searcher, items, restrictions, 0, statistics);

    return {'bestSolution': searcher.bestSolution().items,
            'statistics': statistics};

}


export {solve,
        GroupRestriction,
        ItemsRequiredRestriction,
        ItemsExcludedRestriction};
