<template>

<strong>

  {{actionName}}

  <template v-if="isScore">
    <code>{{action.args.score.amount}}</code>
  </template>

</strong>

</template>

<script>

import * as rules from '@/logic/rules.js';

export default {
    name: "MorphologyRuleActionInfo",

    components: {
    },

    data: () => ({}),

    props: ["action"],

    computed: {
        actionType() {
            return rules.ACTION_TYPE.get(this.action.type);
        },

        actionName() {
            return rules.ACTION_TYPE_INFO[this.actionType].text;
        },

        isScore() {
            return rules.ACTION_TYPE.SCORE.is(this.action.type);
        }
    },

    methods: {
    }
}
</script>
