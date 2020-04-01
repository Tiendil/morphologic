
import Vue from 'vue'


function createItem(text='') {
    return {'text': text};
}


const Items = {
    namespaced: true,
    strict: (process.env.NODE_ENV !== 'production'),

    state: {
        items: {'item-uid-1': createItem('item 1'),
                'item-uid-2': createItem('item 2'),
                'item-uid-3': createItem('item 3'),
                'item-uid-4': createItem('item 4'),
                'item-uid-5': createItem('item 5')}
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
            Vue.set(state.items, payload.itemId,  createItem());
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
