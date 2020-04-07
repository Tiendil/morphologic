<template>
<v-col cols="3">
  <v-card elevation="1">

    <morphology-editable-toolbar :changeCaption="changeCaption"
                                 :caption="rule.name"
                                 emptyFiller="Enter caption">

      <template v-slot:before_title>
        <v-btn icon>
          <morphology-rule-avatar :avatar="avatar"/>
        </v-btn>
      </template>

      <template v-slot:before_edit_button>
        <morphology-rule-cardinality :rule-id="ruleId"/>
      </template>

      <template v-slot:after_edit_button>
        <v-btn icon v-on:click="remove">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </morphology-editable-toolbar>

    <morphology-item v-for="itemId in rule.template.items"
                     :key="itemId"
                     :item-id="itemId"/>

    <v-card-actions>
      <v-btn block
             small
             color="primary"
             v-on:click="createItem">Add item</v-btn>
    </v-card-actions>

  </v-card>

</v-col>

</template>

<script>

import * as avatars from "@/logic/avatars";

import MorphologyEditableToolbar from "@/components/MorphologyEditableToolbar";
import MorphologyItem from "@/components/MorphologyItem";
import MorphologyRuleAvatar from "@/components/MorphologyRuleAvatar";
import MorphologyRuleCardinality from "@/components/MorphologyRuleCardinality";


export default {
    name: "MorphologyGroup",

    components: {
        MorphologyEditableToolbar,
        MorphologyItem,
        MorphologyRuleAvatar,
        MorphologyRuleCardinality
    },

    data: () => ({
    }),

    props: ["ruleId"],

    computed: {
        rule () {
            return this.$store.getters['rules/ruleById'](this.ruleId);
        },

        avatar () {
            return avatars.constructAvatar(this.rule.avatarIndex);
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

        createItem: function () {
            this.$store.dispatch("createItem", {ruleId: this.ruleId});
        },
    }
}
</script>
