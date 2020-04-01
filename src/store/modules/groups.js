
import Vue from 'vue'


function removeItemFromGroup(group, itemId) {
    let itemIndex = group.items.indexOf(itemId);

    if (itemIndex == -1) {
        return;
    }

    Vue.delete(group.items, itemIndex);

    syncSolutionCardinality(group);
}


function syncSolutionCardinality(group) {
    group.solutionCardinality.min = Math.min(group.solutionCardinality.min, group.items.length);
    group.solutionCardinality.max = Math.min(group.solutionCardinality.max, group.items.length);
}


function createGroup(name='', items=null, cardinality=null) {
    const groupItems = items ? items : [];

    if (cardinality == null) {
        cardinality = {'min': 1, 'max': 1};
    }

    return {'name': name,
            'items': groupItems,
            'solutionCardinality': cardinality};
}


const Groups = {
    namespaced: true,
    strict: (process.env.NODE_ENV !== 'production'),

    state: {
        groups: {'group-uid-1': createGroup('XYZ l', ['item-uid-1',
                                                      'item-uid-2',
                                                      'item-uid-5']),
                 'group-uid-2': createGroup('qwer adfda', ['item-uid-3',
                                                           'item-uid-4'])}
    },

    getters: {
        activeGroups (state) {
            return state.groups;
        }
    },

    mutations: {

        changeGroupName (state, payload) {
            state.groups[payload.groupId].name = payload.name;
        },

        createGroup (state, payload) {
            Vue.set(state.groups, payload.groupId,  createGroup());
        },

        removeGroup (state, payload) {
            Vue.delete(state.groups, payload.groupId);
        },

        addtemToGroup (state, payload) {
            state.groups[payload.groupId].items.push(payload.itemId);
        },

        removeItemFromGroups (state, payload) {
            let itemId = payload.itemId;

            for (var groupId in state.groups) {
                removeItemFromGroup(state.groups[groupId], itemId);
            }
        },

        setSolutionCardinality (state, payload) {
            state.groups[payload.groupId].solutionCardinality = payload.solutionCardinality;
            syncSolutionCardinality(state.groups[payload.groupId]);
        }
    },

    actions: {
    },

    modules: {
    }
}

export default Groups;
