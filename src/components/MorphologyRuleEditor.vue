
<template>
<v-sheet>

  <morphology-rule-action-editor :action="rule.action"/>

  if it contains

  <morphology-rule-condition-editor :condition="rule.condition"/>

  <div class="pt-4 pb-4"
       style="overflow: auto;">

    <morphology-rule-template :template="rule.template"
                              :rootTemplate="rule.template"
                              :grow="false"
                              mode="edit"/>

  </div>

  <p>
    <strong>Expected sets</strong>: {{templateSetsNumber}}
  </p>

</v-sheet>

</template>

<script>
import * as templates from '@/logic/templates.js';

import MorphologyRuleTemplate from "@/components/MorphologyRuleTemplate";
import MorphologyRuleConditionEditor from "@/components/MorphologyRuleConditionEditor";
import MorphologyRuleActionEditor from "@/components/MorphologyRuleActionEditor";

export default {
    name: "MorphologyRuleEditor",

    components: {
        MorphologyRuleTemplate,
        MorphologyRuleConditionEditor,
        MorphologyRuleActionEditor
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
