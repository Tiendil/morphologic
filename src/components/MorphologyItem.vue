<template>

<v-list-item>
  <morphology-switch :modes="['edit', 'show']"
                     v-model="captionMode">

    <template v-slot:edit>
      <v-list-item-content>
        <v-text-field label="item text"
                      autofocus
                      dense
                      single-line
                      :value="item.text"
                      v-on:blur="captionMode = 'show'"
                      v-on:change="confirmTextChange"/>
      </v-list-item-content>
    </template>

    <template v-slot:show>
      <v-list-item-content v-if="item.text">
        <v-list-item-title :class="itemTextClasses">{{item.text}}</v-list-item-title>
      </v-list-item-content>

      <v-list-item-content v-else class="font-weight-light">
        <v-list-item-title>Enter description</v-list-item-title>
      </v-list-item-content>

      <v-list-item-action>
        <morphology-item-mode :item-id="itemId"/>
      </v-list-item-action>

      <v-list-item-action>
        <v-btn icon x-small v-on:click="captionMode = 'edit'">
          <v-icon>mdi-lead-pencil</v-icon>
        </v-btn>
      </v-list-item-action>

      <v-list-item-action class="ml-0">
        <v-btn icon x-small v-on:click="remove">
          <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-list-item-action>
  </template>

</morphology-switch>

</v-list-item>

</template>

<script>

import * as items from '@/logic/items.js';

import MorphologySwitch from "@/components/MorphologySwitch";

import MorphologyItemMode from "@/components/MorphologyItemMode";


export default {
    name: 'MorphologyItem',

    components: {
        MorphologySwitch,
        MorphologyItemMode
    },

    data: () => ({
        captionMode: "show"
    }),

    props: ["itemId"],

    computed: {
        item () {
            return this.$store.getters['items/activeItems'][this.itemId];
        },

        ruleId() {
            return this.$store.getters['rules/itemModeRuleIdForItem'](this.itemId);
        },

        itemTextClasses() {
            if (this.ruleId == null) {
                return '';
            }

            const rule = this.$store.getters['rules/ruleById'](this.ruleId);

            const itemMode = items.itemModeByRule(rule);

            if (items.ITEM_MODE.OPTIONAL.is(itemMode)) {
                return '';
            }

            if (items.ITEM_MODE.REQUIRED.is(itemMode)) {
                return 'success--text font-weight-medium';
            }

            if (items.ITEM_MODE.EXCLUDED.is(itemMode)) {
                return 'warning--text font-weight-medium';
            }

            return '';
        }
    },

    methods: {

        confirmTextChange: function (value) {
            this.$store.commit("items/changeItemText", {itemId: this.itemId,
                                                        text: value});

            if (this.ruleId) {
                const rule = this.$store.getters['rules/ruleById'](this.ruleId);

                const itemMode = items.itemModeByRule(rule)

                this.$store.commit("rules/changeRuleName", {ruleId: this.ruleId,
                                                            name: items.ruleNameForItemMode(this.item, itemMode)});
            }

            this.captionMode = 'show';
        },

        remove: function() {
            this.$store.dispatch("removeItem", {itemId: this.itemId});
        }
    }
}
</script>
