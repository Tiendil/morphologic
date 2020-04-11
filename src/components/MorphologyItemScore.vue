<template>

<morphology-switch :modes="['x', 'show']"
                   v-model="scoreMode">
  <template v-slot:x>
    <v-text-field label="score"
                  autofocus
                  dense
                  single-line
                  :value="score"
                  v-on:blur="scoreMode = 'show'"
                  v-on:change="confirmScoreChange"/>
  </template>

  <template v-slot:show>
    <v-btn text
           x-small
           :class="textClasses"
           v-on:click="scoreMode = 'x'">
      <template v-if="score == 0">no score</template>
      <template v-else>score {{score}}</template>
    </v-btn>
  </template>
</morphology-switch>

</template>

<script>

import { Fragment } from 'vue-fragment'

import * as uuid from 'uuid';

import * as rules from '@/logic/rules.js';
import * as items from '@/logic/items.js';

import MorphologySwitch from "@/components/MorphologySwitch";


export default {
    name: 'MorphologyItemScore',

    components: {
        Fragment,
        MorphologySwitch
    },

    data: () => ({
        scoreMode: "show"
    }),

    props: ["itemId", "textClasses"],

    computed: {

        item () {
            return this.$store.getters['items/activeItems'][this.itemId];
        },

        ruleId() {
            return this.$store.getters['rules/ruleIdForTypeAndItem'](rules.RULE_TYPE.ITEM_SCORE, this.itemId);
        },

        score () {
            if (this.ruleId == null) {
                return 0;
            }

            const rule = this.$store.getters['rules/activeRules'][this.ruleId];

            return rule.action.args.score.amount;
        },

    },

    methods: {
        confirmScoreChange: function (value) {
            this.scoreMode = 'show';

            let newRule = null;

            const score = parseInt(value);

            const ruleName = items.ruleNameForItemScore(this.item);

            if (score == 0) {
            }

            else {
                newRule = rules.rawCreateRule({type: rules.RULE_TYPE.ITEM_SCORE,
                                               name: ruleName});
                newRule.action.type = rules.ACTION_TYPE.SCORE.key;
                newRule.action.args.score.amount = score;
                newRule.template.items.push(this.itemId);
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
