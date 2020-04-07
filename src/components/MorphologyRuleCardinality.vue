<template>

<v-menu offset-y>
  <template v-slot:activator="{ on }">
    <v-btn text v-on="on">
      {{cardinality.min}} … {{cardinality.max}}
    </v-btn>
  </template>

  <v-list class="overflow-y-auto"
          style="max-height: 21em;">
    <v-list-item v-for="borders in possibleCardinalities"
                 :key="borders.min + '-' + borders.max"
                 @click="setCardinality(borders)">
      <v-list-item-title>{{ borders.min }} … {{ borders.max }}</v-list-item-title>
    </v-list-item>
  </v-list>

</v-menu>

</template>

<script>

import * as uuid from 'uuid';

import * as rules from '@/logic/rules.js';


export default {
    name: 'MorphologyRestrictionGroupCardinality',

    data: () => ({
    }),

    props: ["ruleId"],

    computed: {

        rule () {
            return this.$store.getters['rules/ruleById'](this.ruleId);
        },

        cardinality () {
            return this.rule.condition.args.nOf;
        },

        possibleCardinalities() {
            const minCardinality = 0;
            const maxCardinality = this.rule.template.items.length;

            const cardinalities = [];

            for (let i=minCardinality; i <= maxCardinality; i++) {
                for (let j=i; j <= maxCardinality; j++) {
                    cardinalities.push({'min': i, 'max': j});
                }
            }

            return cardinalities;
        },
    },

    methods: {
        setCardinality: function (borders) {
            const rule = this.$store.getters['rules/ruleCopyById'](this.ruleId);

            rules.rawUpdateRule(rule, {condition: {type: rules.CONDITION_TYPE.CARDINALITY.key,
                                                   args: {nOf: borders}}})

            this.$store.dispatch("setRule", {ruleId: this.ruleId,
                                             rule: rule});
        }
    }
}
</script>
