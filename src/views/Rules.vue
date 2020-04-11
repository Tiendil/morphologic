<template>
<v-row>
  <v-col>

    <v-data-iterator :items="rules"
                     :search="search"
                     :custom-filter="rulesFilter"
                     disable-pagination
                     hide-default-footer>

      <template v-slot:header>
        <v-toolbar>

          <v-btn color="primary"
                 class="mr-4"
                 v-on:click="createRule">
            Add Rule
          </v-btn>

          <v-text-field v-model="search"
                        clearable
                        flat
                        hide-details
                        label="Search"
                        prepend-inner-icon="mdi-magnify"/>

        </v-toolbar>
      </template>

      <template v-slot:item="props">
        <morphology-rule :rule-id="props.item.ruleId"
                         :key="props.item.ruleId"
                         class="mt-4"/>
      </template>

      <template v-slot:footer>
      </template>

    </v-data-iterator>

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

    data: () => ({
        search: ''
    }),

    computed: {

        rules () {
            const order = this.$store.getters['rules/rulesByCreationOrder'].slice();

            order.reverse();

            const rules = [];

            for (let i in order) {
                rules.push({ruleId: order[i]});
            }

            return rules;
        },

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

        rulesFilter (rules, search) {
            const result = [];

            const template = search.toLowerCase();

            for (let i in rules) {
                const rule = this.$store.getters['rules/activeRules'][rules[i].ruleId];

                if (rule.name.toLowerCase().includes(template)) {
                    result.push(rules[i]);
                    continue;
                }

                for (let j in rule.template.items) {
                    const item = this.$store.getters['items/activeItems'][rule.template.items[j]];

                    if (item.text.toLowerCase().includes(template)) {
                        result.push(rules[i]);
                        break;
                    }
                }
            }

            return result;
        }
    }
}
</script>
