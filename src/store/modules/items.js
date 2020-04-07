
import Vue from 'vue'


const Items = {
    namespaced: true,
    strict: (process.env.NODE_ENV !== 'production'),

    state: {
        items: {}
    },

    getters: {
        activeItems (state) {
            return state.items;
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
        }
    },

    actions: {
    },

    modules: {
    }
}

export {Items};
