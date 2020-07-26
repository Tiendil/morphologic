
import Vue from 'vue'

import * as rules from '@/logic/rules';
import * as templates from '@/logic/templates';


function defaultState() {
    return {rules: {},
            creationOrder: [],
            groupsCounter: 0};
}


function RemoveRule(state, ruleId) {
    state.creationOrder.splice(state.creationOrder.indexOf(ruleId), 1);
    Vue.delete(state.rules, ruleId);
}


const Rules = {
    namespaced: true,
    strict: (process.env.NODE_ENV !== 'production'),

    state: defaultState,

    getters: {
        rulesNumber: (state) => {
            return Object.keys(state.rules).length;
        },

        activeRules: (state) => {
            return state.rules;
        },

        rulesByCreationOrder: (state) => {
            return state.creationOrder;
        },

        ruleById: (state) => (ruleId) => {
            return state.rules[ruleId];
        },

        ruleCopyById: (state) => (ruleId) => {
            return JSON.parse(JSON.stringify(state.rules[ruleId]));
        },

        ruleIdForTypeAndItem: (state) => (type, itemId) => {
            return rules.ruleIdForTypeAndItem(state.rules, type, itemId);
        },

        groupRulesIds: (state) => {
            let groupRules = [];

            for (let ruleId in state.rules) {
                const rule = state.rules[ruleId];

                if (rules.RULE_TYPE.GROUP.is(rule.type)) {
                    groupRules.push(ruleId);
                }
            }

            return groupRules;
        },

        serialize(state) {
            return {rules: state.rules,
                    creationOrder: state.creationOrder,
                    groupsCounter: state.groupsCounter};
        }
    },

    mutations: {

        removeRule: function(state, payload) {
            RemoveRule(state, payload.ruleId)
        },

        setRule: function(state, payload) {
            if (rules.RULE_TYPE.GROUP.is(payload.rule.type)) {
                state.groupsCounter += 1;
                payload.rule.avatarIndex = state.groupsCounter;
            }

            Vue.set(state.rules, payload.ruleId,  payload.rule);

            if (state.creationOrder.indexOf(payload.ruleId) == -1)  {
                state.creationOrder.push(payload.ruleId);
            }
        },

        changeRuleName: function(state, payload) {
            state.rules[payload.ruleId].name = payload.name;
        },

        addItemToRule: function(state, payload) {
            const rule = state.rules[payload.ruleId];
            templates.addExpression({root: rule.template,
                                     child: templates.exprItem({itemId: payload.itemId})});
        },

        changeRuleCondition: function (state, payload) {
            state.rules[payload.ruleId].condition = payload.condition;
        },

        removeItemFromRules: function(state, payload) {
            const rulesToDelete = [];

            for (let ruleId in state.rules) {
                const rule = state.rules[ruleId];

                let template = rule.template;

                const expressionUID = templates.getItemExpressionUID({expression: template, itemId: payload.itemId});

                if (expressionUID == null) {
                    continue;
                }

                templates.removeExpressionFull({expression: template, uid: expressionUID});

                rules.syncCardinality(rule);

                if (templates.isExpressionEmpty(template) && !rules.RULE_TYPE.GROUP.is(rule.type)) {
                    rulesToDelete.push(ruleId);
                }
            }

            for (let i in rulesToDelete) {
                RemoveRule(state, rulesToDelete[i]);
            }
        },

        clearAll: function(state, payload) {
            Object.assign(state, defaultState());
        },

        importAll: function(state, payload) {
            state.rules = payload.data.rules;
            state.creationOrder = payload.data.creationOrder;
            state.groupsCounter = payload.data.groupsCounter;
        }
    },

    actions: {
    },

    modules: {
    }
}

export {Rules};
