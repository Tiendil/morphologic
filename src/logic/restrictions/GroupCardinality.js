

const TYPE = 'restriction_group_cardinality';


class CardinalityChecker {

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



class Restriction {

    constructor(groupId, minCardinality, maxCardinality) {

        this.groupId = groupId;
        this.minCardinality = minCardinality;
        this.maxCardinality = maxCardinality;
    }

    type() {
        return TYPE;
    }

    serialize() {
        return {"groupId": this.groupId,
                "minCardinality": this.minCardinality,
                "maxCardinality": this.maxCardinality};
    }

    static deserialize(data) {
        return new Restriction(data.groupId, data.minCardinality, data.maxCardinality);
    }

    isForItem(itemId) {
        return false;
    }

    isForGroup(groupId) {
        return groupId == this.groupId;
    }

    syncWithGroup(group) {
        this.minCardinality = Math.min(this.minCardinality, group.items.length);
        this.maxCardinality = Math.min(this.maxCardinality, group.items.length);
        return true;
    }

    getChekes(groups, items) {
        return [new CardinalityChecker(this.groupId,
                                       this.minCardinality,
                                       this.maxCardinality,
                                       groups[this.groupId].items)]
    }

}


export {TYPE, Restriction};
