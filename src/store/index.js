import Vue from 'vue'
import Vuex from 'vuex'

import { v4 as uuid4 } from 'uuid';

import Groups from './modules/groups.js';
import Items from './modules/items.js';

Vue.use(Vuex)

export default new Vuex.Store({
    strict: (process.env.NODE_ENV !== 'production'),

    state: {
    },
    mutations: {
    },
    actions: {

        createItem: function(state, payload) {
            let itemId = uuid4();

            this.commit("items/createItem", {itemId: itemId});
            this.commit("groups/addtemToGroup", {groupId: payload.groupId,
                                                 itemId: itemId});
        },

        removeItem: function(state, payload) {
            this.commit("items/removeItem", {itemId: payload.itemId});
            this.commit("groups/removeItemFromGroups", {itemId: payload.itemId});
        }
    },
    modules: {
        groups: Groups,
        items: Items
    }
})
