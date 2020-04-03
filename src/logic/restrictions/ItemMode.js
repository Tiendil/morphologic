
import Enum from 'enum';


const ITEM_MODE = new Enum({OPTIONAL: 0,
                            REQUIRED: 1,
                            EXCLUDED: 2},
                           {name: "ITEM_MODE",
                            freez: true });


let ITEM_MODE_INFO = [];

ITEM_MODE_INFO[ITEM_MODE.OPTIONAL] = {name: "Optional"};
ITEM_MODE_INFO[ITEM_MODE.REQUIRED] = {name: "Required"};
ITEM_MODE_INFO[ITEM_MODE.EXCLUDED] = {name: "Excluded"};



function validateMode(mode) {
    if (!ITEM_MODE.isDefined(mode)) {
        throw "mode '${mode}' must be instance of ITEM_MODE";
    }
}


const TYPE = 'restriction_item_mode';


class ModeRequiredChecker {

    constructor(itemId) {
        this.itemId = itemId;

        this.defaultMeta = {itemUsed: false}

        this.key = 'item-required-' + itemId;
    }

    nextMetaFor(searcher, item) {
        const meta = searcher.getMeta(this.key, this.defaultMeta);
        return {itemUsed: (meta.itemUsed || (this.itemId == item))}
    }

    // TODO: we can restrict brute force by checking
    //       if we already processed group with requred items (and do not use them)
    checkUpper(searcher, item) {
        return true;
    }

    checkLower(searcher) {
        return searcher.getMeta(this.key, this.defaultMeta).itemUsed;
    }
}

class ModeExcludedCheker {

    constructor(itemId) {
        this.itemId = itemId;
        this.key = 'items-excluded' + itemId;
    }

    nextMetaFor(searcher, item) {
        return null;
    }

    checkUpper(searcher, item) {
        return !(this.itemId == item);
    }

    checkLower(searcher) {
        return true;
    }
}


class Restriction {

    constructor(itemId, mode) {

        validateMode(mode);

        this.itemId = itemId;
        this.mode = mode;
    }

    type() {
        return TYPE;
    }

    serialize() {
        return {"itemId": this.itemId,
                "mode": this.mode.value};
    }

    static deserialize(data) {
        validateMode(data.mode);

        return new Restriction(data.itemId, ITEM_MODE.get(data.mode));
    }

    isForItem(itemId) {
        return this.itemId == itemId;
    }

    isForGroup(groupId) {
        return false;
    }

    syncWithGroup(group) {
        return false;
    }

    getChekes(groups, items) {
        if (ITEM_MODE.REQUIRED.is(this.mode)) {
            return [new ModeRequiredChecker(this.itemId)];
        }

        if (ITEM_MODE.EXCLUDED.is(this.mode)) {
            return [new ModeExcludedCheker(this.itemId)];
        }

        return [];
    }

}


export {TYPE, ITEM_MODE, ITEM_MODE_INFO, Restriction};
