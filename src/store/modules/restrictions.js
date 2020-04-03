
import Vue from 'vue'

import * as uuid from 'uuid';

import * as restrictions from '@/logic/restrictions.js';


const Restrictions = {
    namespaced: true,
    strict: (process.env.NODE_ENV !== 'production'),

    state: {
        restrictions: {}
    },

    getters: {

        allRestrictions (state, getters) {
            const restrictions = [];

            for (let restrictionId in state.restrictions) {
                restrictions.push(getters.restrictionById(restrictionId));
            }

            return restrictions;
        },

        restrictionById: (state) => (restrictionId) => {
            const restrictinoData = state.restrictions[restrictionId];

            return restrictions.deserialize(restrictinoData.type,
                                            restrictinoData.data);
        },

        restrictionIdForItem: (state) => (type, itemId) => {
            for (var restrictionId in state.restrictions) {
                const restrictionData = state.restrictions[restrictionId];

                if (restrictionData.type != type) {
                    continue;
                }

                const restriction = restrictions.deserialize(type, restrictionData.data);

                if (restriction.isForItem(itemId)) {
                    return restrictionId;
                }
            }

            return null;
        },

        restrictionIdForGroup: (state) => (type, groupId) => {
            for (var restrictionId in state.restrictions) {
                const restrictionData = state.restrictions[restrictionId];

                if (restrictionData.type != type) {
                    continue;
                }

                const restriction = restrictions.deserialize(type, restrictionData.data);

                if (restriction.isForGroup(groupId)) {
                    return restrictionId;
                }
            }

            return null;
        }
    },

    mutations: {

        setRestriction: function(state, payload) {
            Vue.set(state.restrictions,
                    payload.restrictionId,
                    {"type": payload.restriction.type(),
                     "data": payload.restriction.serialize()});
        },

        removeRestriction: function(state, payload) {
            Vue.delete(state.restrictions, payload.RestrictionId);
        }
    },

    actions: {

        syncWithGroups: function(context, payload) {
            for (let restrictionId in context.store.restrictions) {
                let restriction = context.store.restrictionById(restrictionId);

                for (let groupId in payload.groups) {
                    let group = payload.groups[groupId];

                    if (restriction.syncWithGroup(group)) {
                        context.commit("restrictions/setRestriction", {restrictionId: restrictionId,
                                                                       restriction: restriction});
                    }
                }
            }
        }
    },

    modules: {
    }
}

export {Restrictions};
