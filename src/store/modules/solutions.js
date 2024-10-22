
import Vue from 'vue'


function defaultState() {
    return {solutions: []};
}


const Solutions = {
    namespaced: true,
    strict: (process.env.NODE_ENV !== 'production'),

    state: defaultState,

    getters: {
        currentSolutions (state) {
            return state.solutions;
        },

        currentSolutionsCopy (state) {
            return JSON.parse(JSON.stringify(state.solutions));
        },

        solutionsNumber (state) {
            return state.solutions.length;
        },

        bestSolutionItems (state) {
            if (state.solutions.length == 0) {
                return null;
            }

            return state.solutions[0].items;
        }
    },

    mutations: {

        rewriteSolutions: function(state, payload) {
            state.solutions = [];

            for (let i in payload.solutions) {
                const solution = payload.solutions[i];

                state.solutions.push({'items': solution.items,
                                      'score': solution.score});
            }
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

export {Solutions};
