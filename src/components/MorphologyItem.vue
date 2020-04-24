<template>

<v-list-item  :class="itemClasses">
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
                      v-on:change="confirmCaptionChange"/>
      </v-list-item-content>
    </template>

    <template v-slot:show>
      <v-list-item-content>

        <v-list-item-title  v-if="item.text"
                            :class="itemTextClasses">

          <!-- <v-icon v-if="partOfBestSolution" -->
          <!--         style="color: blue;">mdi-star-outline</v-icon> -->

          {{item.text}}
        </v-list-item-title>

        <v-list-item-title v-else>Enter description</v-list-item-title>

        <v-list-item-subtitle>
          <morphology-item-score :item-id="itemId"
                                 :textClasses="itemTextClasses"/>
        </v-list-item-subtitle>

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
import * as rules from '@/logic/rules.js';

import MorphologySwitch from "@/components/MorphologySwitch";

import MorphologyItemMode from "@/components/MorphologyItemMode";
import MorphologyItemScore from "@/components/MorphologyItemScore";


export default {
    name: 'MorphologyItem',

    components: {
        MorphologySwitch,
        MorphologyItemMode,
        MorphologyItemScore
    },

    data: () => ({
        captionMode: "show"
    }),

    props: ["itemId"],

    computed: {
        item () {
            return this.$store.getters['items/activeItems'][this.itemId];
        },

        itemModeRuleId() {
            return this.$store.getters['rules/ruleIdForTypeAndItem'](rules.RULE_TYPE.ITEM_MODE, this.itemId);
        },

        itemScoreRuleId() {
            return this.$store.getters['rules/ruleIdForTypeAndItem'](rules.RULE_TYPE.ITEM_SCORE, this.itemId);
        },

        itemTextClasses() {
            if (this.itemModeRuleId == null) {
                return '';
            }

            const rule = this.$store.getters['rules/ruleById'](this.itemModeRuleId);

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
        },

        partOfBestSolution () {
            const items = this.$store.getters['solutions/bestSolutionItems'];

            if (items == null) {
                return false;
            }

            return items.indexOf(this.itemId) != -1;
        },

        itemClasses () {
            if (!this.partOfBestSolution) {
                return '';
            }

            return 'light-blue lighten-5'
        }
    },

    methods: {

        confirmCaptionChange: function (value) {
            this.$store.commit("items/changeItemText", {itemId: this.itemId,
                                                        text: value});

            if (this.itemModeRuleId) {
                const rule = this.$store.getters['rules/ruleById'](this.itemModeRuleId);

                const itemMode = items.itemModeByRule(rule)

                this.$store.commit("rules/changeRuleName", {ruleId: this.itemModeRuleId,
                                                            name: items.ruleNameForItemMode(this.item, itemMode)});
            }

            if (this.itemScoreRuleId) {
                const rule = this.$store.getters['rules/ruleById'](this.itemScoreRuleId);

                this.$store.commit("rules/changeRuleName", {ruleId: this.itemScoreRuleId,
                                                            name: items.ruleNameForItemScore(this.item)});
            }

            this.captionMode = 'show';

            this.$gtag.event('change_caption_item', {event_label: value});
        },

        remove: function() {
            this.$gtag.event('remove_item', {event_label: this.item.text});
            this.$store.dispatch("removeItem", {itemId: this.itemId});
        }
    }
}
</script>
