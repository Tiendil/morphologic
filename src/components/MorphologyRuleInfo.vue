
<template>
<v-sheet>

  <morphology-rule-action-info :action="rule.action"/>

  if it contains

  <morphology-rule-condition-info :condition="rule.condition"/>

  <morphology-rule-template-info :template="rule.template"
                                 class="mt-4"/>

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
