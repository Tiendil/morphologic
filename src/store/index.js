import Vue from 'vue'
import Vuex from 'vuex'

import * as uuid from 'uuid';

import * as rules from '@/logic/rules.js';

import {Items} from './modules/items.js';
import {Rules} from './modules/rules.js';
import {Solutions} from './modules/solutions.js';
import {Advices} from './modules/advices.js';


Vue.use(Vuex)


export default new Vuex.Store({
    strict: (process.env.NODE_ENV !== 'production'),

    state: {
        topologyVersion: uuid.v4()
    },

    getters: {
        serialize(state, getters) {
            return {varsion: 1,
                    items: getters['items/serialize'],
                    rules: getters['rules/serialize']};
        }
    },

    mutations: {
        updateTopologyVersion(state) {
            state.topologyVersion = uuid.v4()
        }
    },

    actions: {

        createGroupRule (context, payload) {

            let items = [];

            if (payload.items) {
                items = payload.items.slice()
            }

            if (payload.createFirstItem) {
                const itemId = uuid.v4();

                context.dispatch("createItem", {itemId: itemId, text: ''});

                items.push(itemId);
            }

            const rule = rules.rawCreateRule({type: rules.RULE_TYPE.GROUP,
                                              name: payload.name || '',
                                              items: items,
                                              condition: {type: rules.CONDITION_TYPE.CARDINALITY.key,
                                                          args: {nOf: {min: 1,
                                                                       max: 1}}}});

            context.dispatch("setRule", {ruleId: uuid.v4(),
                                         rule: rule});

            context.commit("updateTopologyVersion");
        },

        createItem (context, payload) {
            let itemId = payload.itemId || uuid.v4();

            context.commit("items/createItem", {itemId: itemId,
                                                text: payload.text});

            if (payload.ruleId) {
                context.commit("rules/addItemToRule", {ruleId: payload.ruleId,
                                                       itemId: itemId});
            }

            context.commit("updateTopologyVersion");
        },

        removeItem (context, payload) {
            context.commit("items/removeItem", {itemId: payload.itemId});
            context.commit("rules/removeItemFromRules", {itemId: payload.itemId});

            context.commit("updateTopologyVersion");
        },

        setRule (context, payload) {
            context.commit("rules/setRule", {ruleId: payload.ruleId,
                                             rule: payload.rule});
            context.commit("updateTopologyVersion");
        },

        removeRule (context, payload) {
            context.commit("rules/removeRule", {ruleId: payload.ruleId});
            context.commit("updateTopologyVersion");
        },

        clearAll (context) {
            context.commit('items/clearAll');
            context.commit('rules/clearAll');
            context.commit('solutions/clearAll');
            context.commit('advices/clearAll');

            context.commit("updateTopologyVersion");
        },

        importAll (context, payload) {
            context.dispatch('clearAll');

            context.commit('items/importAll', {data: payload.data.items});
            context.commit('rules/importAll', {data: payload.data.rules});

            context.commit("updateTopologyVersion");
        }
    },

    modules: {
        items: Items,
        rules: Rules,
        solutions: Solutions,
        advices: Advices
    }
})
