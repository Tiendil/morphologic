
import Vue from 'vue'
import { v4 as uuid4 } from 'uuid';

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

        createGroup: function(state, payload) {
            Vue.set(state.groups, uuid4(),  {'name': ''});
        },

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
