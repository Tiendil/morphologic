
<template>
<v-sheet>

  <morphology-rule-action-info :action="rule.action"/>

  if it contains

  <morphology-rule-condition-info :condition="rule.condition"/>

  <div class="pt-4 pb-4"
       style="overflow: auto;">

    <morphology-rule-template :template="rule.template"
                              :grow="false"
                              mode="info"
                              class="mt-4"/>
  </div>

  <p>
    <strong>Expected sets</strong>: {{templateSetsNumber}}
  </p>

</v-sheet>

</template>

<script>

import * as templates from '@/logic/templates.js';

import MorphologyRuleTemplate from "@/components/MorphologyRuleTemplate";
import MorphologyRuleConditionInfo from "@/components/MorphologyRuleConditionInfo";
import MorphologyRuleActionInfo from "@/components/MorphologyRuleActionInfo";

export default {
    name: "MorphologyRuleInfo",

    components: {
        MorphologyRuleTemplate,
        MorphologyRuleConditionInfo,
        MorphologyRuleActionInfo
    },

    data: () => ({
    }),

    props: ["rule"],

    computed: {
        templateSetsNumber () {
            return templates.combinationsNumber({expression: this.rule.template});
        }
    },

    methods: {
    }
}
</script>
