
<template>
<v-sheet>

  <morphology-rule-action-editor :action="rule.action"/>

  <v-subheader>If it contains</v-subheader>

  <morphology-rule-condition-editor :condition="rule.condition"/>

  <v-subheader>Items</v-subheader>

  <morphology-rule-template-editor :template="rule.template"/>

</v-sheet>

</template>

<script>
import MorphologyRuleTemplateEditor from "@/components/MorphologyRuleTemplateEditor";
import MorphologyRuleConditionEditor from "@/components/MorphologyRuleConditionEditor";
import MorphologyRuleActionEditor from "@/components/MorphologyRuleActionEditor";

export default {
    name: "MorphologyRuleEditor",

    components: {
        MorphologyRuleTemplateEditor,
        MorphologyRuleConditionEditor,
        MorphologyRuleActionEditor
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
