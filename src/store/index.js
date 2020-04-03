import Vue from 'vue'
import Vuex from 'vuex'

import * as uuid from 'uuid';

import Groups from './modules/groups.js';
import {Items} from './modules/items.js';
import {Restrictions} from './modules/restrictions.js';

import * as GroupCardinality from '@/logic/restrictions/GroupCardinality.js';


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
            let groupId = payload.groupId || uuid.v4();

            context.commit("groups/createGroup", {groupId: groupId});

            if (payload.name) {
                context.commit("groups/changeGroupName", {groupId: groupId, name: payload.name});
            }

            let cardinality = null;

            if (payload.createFirstItem) {
                context.dispatch('createItem', {groupId: groupId});
                cardinality = new GroupCardinality.Restriction(groupId, 1, 1);
            }
            else {
                cardinality = new GroupCardinality.Restriction(groupId, 0, 0);
            }

            context.dispatch('setRestriction', {restrictionId: uuid.v4(),
                                                restriction: cardinality});

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
            let itemId = payload.itemId || uuid.v4();

            context.commit("items/createItem", {itemId: itemId});
            context.commit("groups/addtemToGroup", {groupId: payload.groupId,
                                                    itemId: itemId});

            if (payload.text) {
                context.commit("items/changeItemText", {itemId: itemId, text: payload.text});
            }

            if (context.getters['groups/activeGroups'][payload.groupId].items.length == 1) {
                const restrictionId = context.getters['restrictions/restrictionIdForGroup'](GroupCardinality.TYPE,
                                                                                            payload.groupId);

                const restriction = new GroupCardinality.Restriction(payload.groupId, 1, 1);

                context.dispatch('setRestriction', {'restrictionId': restrictionId,
                                                    'restriction': restriction});
            }

            context.commit("updateTopologyVersion");
        },

        removeItem (context, payload) {
            context.commit("items/removeItem", {itemId: payload.itemId});
            context.commit("groups/removeItemFromGroups", {itemId: payload.itemId});

            context.dispatch("restrictions/syncWithGroups", {"groups": context.store.getters['groups/activeGroups']});

            context.commit("updateTopologyVersion");
        },

        setRestriction (context, payload) {
            context.commit("restrictions/setRestriction", {restrictionId: payload.restrictionId,
                                                           restriction: payload.restriction});

            context.commit("updateTopologyVersion");
        }
    },
    modules: {
        groups: Groups,
        items: Items,
        restrictions: Restrictions
    }
})
