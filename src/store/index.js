import Vue from 'vue'
import Vuex from 'vuex'

import * as uuid from 'uuid';

import Groups from './modules/groups.js';
import {Items} from './modules/items.js';

Vue.use(Vuex)

export default new Vuex.Store({
    strict: (process.env.NODE_ENV !== 'production'),

    state: {
        topologyVersion: uuid.v4()
    },
    mutations: {
        updateTopologyVersion(state) {
            state.topologyVersion = uuid.v4()
        }
    },
    actions: {

        createGroup (context, payload) {
            let groupId = uuid.v4();

            context.commit("groups/createGroup", {groupId: groupId});

            context.dispatch('createItem', {groupId: groupId});
            context.dispatch('setSolutionCardinality', {groupId: groupId,
                                                        solutionCardinality: {min: 1, max: 1}});

            context.commit("updateTopologyVersion");
        },

        removeGroup (context, payload) {
            const itemsToRemove = context.getters['groups/activeGroups'][payload.groupId].items.slice();

            for (let i in itemsToRemove) {
                context.commit("groups/removeItemFromGroups", {itemId: itemsToRemove[i]});
            }

            context.commit("groups/removeGroup", {groupId: payload.groupId});

            context.commit("updateTopologyVersion");
        },

        createItem (context, payload) {
            let itemId = uuid.v4();

            context.commit("items/createItem", {itemId: itemId});
            context.commit("groups/addtemToGroup", {groupId: payload.groupId,
                                                    itemId: itemId});

            context.commit("updateTopologyVersion");
        },

        removeItem (context, payload) {
            context.commit("items/removeItem", {itemId: payload.itemId});
            context.commit("groups/removeItemFromGroups", {itemId: payload.itemId});

            context.commit("updateTopologyVersion");
        },

        setSolutionCardinality (context, payload) {
            context.commit("groups/setSolutionCardinality", {groupId: payload.groupId,
                                                             solutionCardinality: payload.solutionCardinality});

            context.commit("updateTopologyVersion");
        },

        changeItemMode (context, payload) {
            context.commit("items/changeItemMode", {itemId: payload.itemId,
                                                    mode: payload.mode});

            context.commit("updateTopologyVersion");
        }
    },
    modules: {
        groups: Groups,
        items: Items
    }
})
