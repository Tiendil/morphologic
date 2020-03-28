
import Vue from 'vue'

const Items = {
    namespaced: true,
    strict: (process.env.NODE_ENV !== 'production'),

    state: {
        items: {'item-uid-1': {'text': 'item x'},
                'item-uid-2': {'text': 'item y'},
                'item-uid-3': {'text': 'item z'},
                'item-uid-4': {'text': 'item p'},
                'item-uid-5': {'text': 'item q'}}
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
            Vue.set(state.items, payload.itemId,  {'text': ''});
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

export default Items;
