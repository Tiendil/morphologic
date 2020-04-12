
import Vue from 'vue'


function defaultState() {
    return {items: {}};
}


const Items = {
    namespaced: true,
    strict: (process.env.NODE_ENV !== 'production'),

    state: defaultState,

    getters: {
        activeItems (state) {
            return state.items;
        },

        serialize(state) {
            return {items: state.items};
        }
    },

    mutations: {

        changeItemText: function(state, payload) {
            state.items[payload.itemId].text = payload.text;
        },

        createItem: function(state, payload) {
            Vue.set(state.items, payload.itemId,  {"text": payload.text || ""});
        },

        removeItem: function(state, payload) {
            Vue.delete(state.items, payload.itemId);
        },

        clearAll: function(state, payload) {
            Object.assign(state, defaultState());
        },

        importAll: function(state, payload) {
            state.items = payload.data.items;
        }

    },

    actions: {
    },

    modules: {
    }
}

export {Items};
