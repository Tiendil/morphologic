<template>
<v-row>
  <v-col>

    <v-row>
      <v-col>
        <v-btn color="primary" v-on:click="createRule">Add Rule</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <morphology-rule v-for="ruleId in sortedRulesIds"
                         :rule-id="ruleId"
                         :key="ruleId"
                         class="mb-4"/>
      </v-col>
    </v-row>

  </v-col>
</v-row>
</template>

<script>

import * as uuid from 'uuid';

import * as rules from '@/logic/rules.js';

import MorphologyRule from '@/components/MorphologyRule';

export default {
    name: 'Rules',

    components: {
        MorphologyRule
    },

    computed: {
        sortedRulesIds() {
            const order = this.$store.getters['rules/rulesByCreationOrder'].slice();

            order.reverse();

            return order;
        }
    },

    methods: {
        createRule: function () {
            this.$store.dispatch("setRule", {ruleId: uuid.v4(),
                                             rule: rules.rawCreateRule({type: rules.RULE_TYPE.CUSTOM})});
        },
    }
}
</script>
