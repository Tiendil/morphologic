import Vue from 'vue'
import Vuex from 'vuex'

import Groups from './modules/groups.js';

Vue.use(Vuex)

export default new Vuex.Store({
    strict: (process.env.NODE_ENV !== 'production'),

    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        groups: Groups
    }
})
