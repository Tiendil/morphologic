
import Vue from 'vue'


function defaultState() {
    return {advices: [],
            hiddenAdvices: []};
}


const Advices = {
    namespaced: true,
    strict: (process.env.NODE_ENV !== 'production'),

    state: defaultState,

    getters: {
        currentAdvices (state) {
            return state.advices;
        },

        isAdviceHidden: (state) => (adviceUid) => {
            return state.hiddenAdvices.indexOf(adviceUid) != -1;
        },

        advicesNumber (state) {
            return state.advices.length;
        },

        visibleAdvicesNumber (state) {
            let count = 0;

            for (let i in state.advices) {
                if (state.hiddenAdvices.indexOf(state.advices[i].uid) == -1) {
                    count += 1;
                }
            }

            return count;
        }
    },

    mutations: {
        refreshAdvices: function(state, payload) {
            state.advices = payload.advices;
        },

        hideAdvice: function(state, payload) {
            if (state.hiddenAdvices.indexOf(payload.adviceUid) != -1) {
                return;
            }

            state.hiddenAdvices.push(payload.adviceUid);
        },

        showAdvice: function(state, payload) {
            const index = state.hiddenAdvices.indexOf(payload.adviceUid);
            if (index == -1) {
                return;
            }

            state.hiddenAdvices.splice(index, 1);
        },

        showAllAdvices: function(state, payload) {
            state.hiddenAdvices = [];
        },

        clearAll: function(state, payload) {
            Object.assign(state, defaultState());
        }

    },

    actions: {
    },

    modules: {
    }
}

export {Advices};
