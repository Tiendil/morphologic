<template>

<v-sheet>

  {{actionName}}

</v-sheet>

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
        }
    },

    methods: {
    }
}
</script>
