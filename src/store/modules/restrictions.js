
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

        allCheckers (state) {
            const checkers = [];

            for (let restrictionId in state.restrictions) {
                const restrictionData = state.restrictions[restrictionId];
                const restriction = restrictions.deserialize(restrictionData.type, restrictionData.data);

                checkers.push(...restriction.getChekes());
            }

            return checkers;
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
    },

    modules: {
    }
}

export {Restrictions};
