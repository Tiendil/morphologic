import Vue from 'vue'
import Vuex from 'vuex'

import * as uuid from 'uuid';

import * as s11n from '@/logic/s11n';
import * as rules from '@/logic/rules';
import * as templates from '@/logic/templates';

import {Items} from './modules/items';
import {Rules} from './modules/rules';
import {Solutions} from './modules/solutions';
import {Advices} from './modules/advices';



Vue.use(Vuex)


export default new Vuex.Store({
    strict: (process.env.NODE_ENV !== 'production'),

    state: {
        topologyVersion: uuid.v4()
    },

    getters: {
        serialize(state, getters) {
            return s11n.serialize({items: getters['items/serialize'],
                                   rules: getters['rules/serialize']});
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

            const template = templates.exprSet()

            for (let i in items) {
                const itemId = items[i];

                const templateItem = templates.exprItem({itemId: itemId});

                templates.addExpression({root: template,
                                         child: templateItem});
            }

            const rule = rules.rawCreateRule({type: rules.RULE_TYPE.GROUP,
                                              name: payload.name || '',
                                              template: template,
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

        changeRuleCondition (context, payload) {
            context.commit("rules/changeRuleCondition", {ruleId: payload.ruleId,
                                                         condition: payload.condition});
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

            const data = s11n.actualizeFormat({data: payload.data});

            context.commit('items/importAll', {data: data.items});
            context.commit('rules/importAll', {data: data.rules});

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
