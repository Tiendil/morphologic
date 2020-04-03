
import * as ItemMode from '@/logic/restrictions/ItemMode.js';
import * as GroupCardinality from '@/logic/restrictions/GroupCardinality.js';


function buildClasses(classes) {
    let result = {};

    classes.forEach((restrictionModule) => {
        result[restrictionModule.TYPE] = restrictionModule.Restriction;
    });

    return result;
}

const TYPES = buildClasses([ItemMode,
                            GroupCardinality]);


function getClass(type) {
    return TYPES[type];
}


function deserialize(type, data) {
    return TYPES[type].deserialize(data);
}


export {deserialize};
