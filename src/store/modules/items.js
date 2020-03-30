
import Vue from 'vue'


const MODE = {
    OPTIONAL: 'OPTIONAL',
    REQUIRED: 'REQUIRED',
    EXCLUDED: 'EXCLUDED'
};


function createItem(text='', mode=MODE.OPTIONAL) {
    return {'text': text,
            'mode': mode};
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

        changeItemMode: function(state, payload) {
            state.items[payload.itemId].mode = payload.mode;
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

export {Items, MODE};
