
<template>
<v-sheet>

  <morphology-rule-action-info :action="rule.action"/>

  <v-subheader>If it contains</v-subheader>

  <morphology-rule-condition-info :condition="rule.condition"/>

  <v-subheader>Items</v-subheader>

  <morphology-rule-template-info :template="rule.template"/>

</v-sheet>

</template>

<script>

import MorphologyRuleTemplateInfo from "@/components/MorphologyRuleTemplateInfo";
import MorphologyRuleConditionInfo from "@/components/MorphologyRuleConditionInfo";
import MorphologyRuleActionInfo from "@/components/MorphologyRuleActionInfo";

export default {
    name: "MorphologyRuleInfo",

    components: {
        MorphologyRuleTemplateInfo,
        MorphologyRuleConditionInfo,
        MorphologyRuleActionInfo
    },

    data: () => ({
    }),

    props: ["rule"],

    computed: {
    },

    methods: {
    }
}
</script>
