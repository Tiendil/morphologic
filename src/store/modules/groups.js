
import Vue from 'vue'
import { v4 as uuid4 } from 'uuid';


function RemoveItemFromGroup(group, itemId) {
    let itemIndex = group.items.indexOf(itemId);

    if (itemIndex == -1) {
        return;
    }

    Vue.delete(group.items, itemIndex);
}


function createGroup(name='', items=null) {
    return {'name': name,
            'items': items ? items : []}
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
                RemoveItemFromGroup(state.groups[groupId], itemId);
            }
        }
    },

    actions: {
    },

    modules: {
    }
}

export default Groups;
