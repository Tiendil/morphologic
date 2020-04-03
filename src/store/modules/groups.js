
import Vue from 'vue'


function removeItemFromGroup(group, itemId) {
    let itemIndex = group.items.indexOf(itemId);

    if (itemIndex == -1) {
        return;
    }

    Vue.delete(group.items, itemIndex);
}


const Groups = {
    namespaced: true,
    strict: (process.env.NODE_ENV !== 'production'),

    state: {
        groups: {}
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
            Vue.set(state.groups, payload.groupId, {'name': '',
                                                    'items': []});
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
        }
    },

    actions: {
    },

    modules: {
    }
}

export default Groups;
