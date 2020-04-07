
<template>
<v-card elevation="1" class="pb-4">

  <morphology-editable-toolbar :changeCaption="changeCaption"
                               :caption="ruleForInfo.name"
                               :allowEdit="!ruleLocked"
                               emptyFiller="Enter caption">
    <template v-slot:before_title>
      <v-icon v-if="ruleLocked">mdi-lock-outline</v-icon>
    </template>

    <template v-slot:after_edit_button>
      <v-btn icon v-on:click="remove">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </morphology-editable-toolbar>

  <morphology-switch :modes="bodyModes"
                     v-model="bodyMode">

    <template v-slot:show>
      <morphology-rule-info :rule="ruleForInfo" class="pl-4 pr-4 pt-4"/>

      <v-card-actions v-if="!ruleLocked">
        <v-btn text color="primary" @click="startEdit">Edit</v-btn>
      </v-card-actions>
    </template>

    <template v-slot:edit>
      <morphology-rule-editor :rule="ruleForEdit" class="pl-4 pr-4 pt-4"/>

      <v-card-actions v-if="!ruleLocked">
        <v-btn text color="success" @click="saveEdit">Save</v-btn>
        <v-btn text @click="cancelEdit">Cancel</v-btn>
      </v-card-actions>
    </template>

  </morphology-switch>

</v-card>

</template>

<script>
import MorphologyEditableToolbar from "@/components/MorphologyEditableToolbar";

import MorphologySwitch from "@/components/MorphologySwitch";
import MorphologyRuleEditor from "@/components/MorphologyRuleEditor";
import MorphologyRuleInfo from "@/components/MorphologyRuleInfo";

import * as rules from '@/logic/rules.js';


export default {
    name: "MorphologyRule",

    components: {
        MorphologySwitch,
        MorphologyEditableToolbar,
        MorphologyRuleEditor,
        MorphologyRuleInfo
    },

    data: () => ({bodyMode: 'show',
                  bodyModes: ['show', 'edit'],
                  ruleForEdit: null}),

    props: ["ruleId"],

    computed: {
        ruleForInfo () {
            return this.$store.getters['rules/ruleById'](this.ruleId);
        },

        ruleLocked() {
            return !rules.RULE_TYPE.CUSTOM.is(this.ruleForInfo.type);
        }
    },

    methods: {
        changeCaption: function (value) {
            this.$store.commit("rules/changeRuleName", {ruleId: this.ruleId,
                                                        name: value});
        },

        remove: function() {
            this.$store.dispatch("removeRule", {ruleId: this.ruleId});
        },

        startEdit: function() {
            this.ruleForEdit = this.$store.getters['rules/ruleCopyById'](this.ruleId);
            this.bodyMode = 'edit';
        },

        saveEdit: function() {
            const rule = this.$store.getters['rules/ruleCopyById'](this.ruleId);

            rules.rawUpdateRule(rule, {action: this.ruleForEdit.action,
                                       condition: this.ruleForEdit.condition,
                                       template: this.ruleForEdit.template});

            this.$store.dispatch("setRule", {ruleId: this.ruleId,
                                             rule: rule});
            this.bodyMode = 'show';
        },

        cancelEdit: function() {
            this.bodyMode = 'show';
        }
    }
}
</script>
