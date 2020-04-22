<template>
<v-row>
  <v-col>

    <v-data-iterator :items="rules"
                     :search="search"
                     :custom-filter="rulesFilter"
                     disable-pagination
                     hide-default-footer>

      <template v-slot:header>
        <v-toolbar class="d-flex flex-row align-center">

          <v-btn color="primary"
                 class="mr-4 flex-grow-0"
                 v-on:click="createRule">
            Add Rule
          </v-btn>

          <v-chip class="mr-4">
            {{ rules.length }}
          </v-chip>

          <v-select :items="actions"
                    dense
                    clearable
                    label="Action"
                    v-model="action"
                    :menu-props="{ 'offset-y': true }"
                    class="flex-grow-0 mr-4 morphology-select"/>

          <v-select :items="conditions"
                    dense
                    clearable
                    label="Condition"
                    v-model="condition"
                    :menu-props="{ 'offset-y': true }"
                    class="flex-grow-0 mr-4 morphology-select"/>

          <v-select :items="types"
                    dense
                    clearable
                    label="Type"
                    v-model="type"
                    :menu-props="{ 'offset-y': true }"
                    class="flex-grow-0 mr-4 morphology-select"/>

          <v-text-field v-model="search"
                        clearable
                        flat
                        hide-details
                        label="Search"
                        class="flex-grow-1"
                        prepend-inner-icon="mdi-magnify"/>

        </v-toolbar>
      </template>

      <template v-slot:no-data>
        <v-alert class="mt-8 pl-1"
                 type="info">
          No rules found
        </v-alert>
      </template>

      <template v-slot:no-results>
        <v-alert class="mt-8 pl-1"
                 type="info">
          No rules found
        </v-alert>
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

    data: function () {
        const actionsInfo = rules.getEnumSelectInfo(rules.ACTION_TYPE, rules.ACTION_TYPE_INFO);

        const conditionsInfo = rules.getEnumSelectInfo(rules.CONDITION_TYPE, rules.CONDITION_TYPE_INFO);

        const typesInfo = rules.getEnumSelectInfo(rules.RULE_TYPE, rules.RULE_TYPE_INFO);

        return {search: '',
                action: null,
                actions: actionsInfo.infos,
                condition: null,
                conditions: conditionsInfo.infos,
                type: null,
                types: typesInfo.infos};
    },

    computed: {

        rules () {
            const order = this.$store.getters['rules/rulesByCreationOrder'].slice();

            order.reverse();

            const rulesObjects = [];

            for (let i in order) {

                const ruleId = order[i];

                const rule = this.$store.getters['rules/activeRules'][ruleId];

                if (this.action != null && rule.action.type != this.action) {
                    continue;
                }

                if (this.condition != null && rule.condition.type != this.condition) {
                    continue;
                }

                if (this.type != null && rule.type != this.type) {
                    continue;
                }

                rulesObjects.push({ruleId: ruleId,
                                   order: i,
                                   type: rule.type});
            }

            rulesObjects.sort(function(a, b) {
                if (rules.RULE_TYPE.CUSTOM.is(a.type) && !rules.RULE_TYPE.CUSTOM.is(b.type)) {
                    return -1;
                }

                if (rules.RULE_TYPE.CUSTOM.is(b.type) && !rules.RULE_TYPE.CUSTOM.is(a.type)) {
                    return 1;
                }

                if (a.order < b.order) {
                    return -1;
                }

                if (b.order < a.order) {
                    return 1;
                }

                return 0;
            });

            return rulesObjects;
        }
    },

    methods: {
        createRule: function () {
            this.action = null;
            this.condition = null;
            this.type = null;

            this.$store.dispatch("setRule", {ruleId: uuid.v4(),
                                             rule: rules.rawCreateRule({type: rules.RULE_TYPE.CUSTOM})});
        },

        rulesFilter (rules, search) {
            const result = [];

            const template = search ? search.toLowerCase() : '';

            for (let i in rules) {
                const rule = this.$store.getters['rules/activeRules'][rules[i].ruleId];

                if (rule.name.toLowerCase().includes(template)) {
                    result.push(rules[i]);
                    continue;
                }

                const items = [...templates.getItems({expression: rule.template})];

                for (let j in items) {
                    const item = this.$store.getters['items/activeItems'][items[j]];

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


<style scoped>
  >>>.morphology-select .v-select__selections input {
  width: 1em !important;
  }

  >>>.morphology-select .v-input__control {
    flex-direction: row !important;
    flex-wrap: inherit !important;
  }
</style>
