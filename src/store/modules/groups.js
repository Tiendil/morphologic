
import Vue from 'vue'

const Groups = {
    namespaced: true,
    strict: (process.env.NODE_ENV !== 'production'),

    state: {
        groups: {'uid-1': {'name': 'XYZ l'},
                 'uid-2': {'name': 'qwer adfda'}}
    },

    getters: {
        activeGroups (state) {
            return state.groups;
        }
    },

    mutations: {

        changeGroupName: function(state, payload) {
            state.groups[payload.groupId].name = payload.name;
        },

        // createGroup: function(state, payload) {
        //     state.groups['???'] = {'name': '????'};
        // },

        removeGroup: function(state, payload) {
            Vue.delete(state.groups, payload.groupId);
        }
    },

    actions: {
    },

    modules: {
    }
}

export default Groups;
