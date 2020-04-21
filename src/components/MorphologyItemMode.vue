<template>

<v-menu offset-y>
  <template v-slot:activator="{ on }">
    <v-btn icon x-small v-on="on">
      <v-icon>mdi-state-machine</v-icon>
    </v-btn>
  </template>

  <v-list>

    <v-list-item v-for="mode in itemModes"
                 :key="mode.key"
                 @click="changeMode(mode)">
      <v-list-item-content>
        <v-list-item-title class="text-capitalize">{{mode}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

  </v-list>

</v-menu>

</template>

<script>

import * as uuid from 'uuid';

import * as rules from '@/logic/rules.js';
import * as items from '@/logic/items.js';
import * as templates from '@/logic/templates.js';


export default {
    name: 'MorphologyItemMode',

    data: () => ({
    }),

    props: ["itemId"],

    computed: {

        item () {
            return this.$store.getters['items/activeItems'][this.itemId];
        },

        ruleId() {
            return this.$store.getters['rules/ruleIdForTypeAndItem'](rules.RULE_TYPE.ITEM_MODE, this.itemId);
        },

        itemModes () {
            return items.ITEM_MODE.enums;
        },
    },

    methods: {
        changeMode: function(mode) {
            let newRule = null;

            const ruleName = items.ruleNameForItemMode(this.item, mode);

            if (items.ITEM_MODE.OPTIONAL.is(mode)) {
            }

            if (items.ITEM_MODE.REQUIRED.is(mode)) {
                newRule = rules.rawCreateRule({type: rules.RULE_TYPE.ITEM_MODE,
                                               template: templates.createItemsSet({items: [this.itemId]}),
                                               name: ruleName});
                newRule.action.type = rules.ACTION_TYPE.ACCEPT.key;
            }

            if (items.ITEM_MODE.EXCLUDED.is(mode)) {
                newRule = rules.rawCreateRule({type: rules.RULE_TYPE.ITEM_MODE,
                                               template: templates.createItemsSet({items: [this.itemId]}),
                                               name: ruleName});
                newRule.action.type = rules.ACTION_TYPE.REJECT.key;
            }

            if (newRule == null && this.ruleId != null) {
                this.$store.dispatch("removeRule", {ruleId: this.ruleId});
                return;
            }

            if (newRule == null) {
                return;
            }

            this.$store.dispatch("setRule", {ruleId: this.ruleId || uuid.v4(),
                                             rule: newRule});
        }
    }
}
</script>
