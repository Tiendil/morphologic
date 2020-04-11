<template>

<v-sheet class="d-flex align-baseline">

  <v-select :items="actions"
            dense
            v-model="action.type"
            :menu-props="{ 'offset-y': true }"
            class="flex-grow-0 morphology-select pr-2"/>

  <morphology-switch :modes="actionTypes"
                     v-model="action.type">

    <template v-slot:ACCEPT>
    </template>

    <template v-slot:REJECT>
    </template>

    <template v-slot:SCORE>
      <morphology-number-input v-model="action.args.score.amount"
                               label="Score"
                               placeholder="Score"/>
    </template>

  </morphology-switch>

</v-sheet>

</template>

<script>

import * as rules from '@/logic/rules.js';

import MorphologySwitch from "@/components/MorphologySwitch";
import MorphologyNumberInput from "@/components/MorphologyNumberInput";
import MorphologySimpleAlert from "@/components/MorphologySimpleAlert";

export default {
    name: "MorphologyRuleActionEditor",

    components: {
        MorphologySwitch,
        MorphologyNumberInput,
        MorphologySimpleAlert
    },

    data: function () {

        const selectInfo = rules.getEnumSelectInfo(rules.ACTION_TYPE, rules.ACTION_TYPE_INFO);

        return {actionTypes: selectInfo.types,
                actions: selectInfo.infos};
    },

    props: ["action"],

    computed: {
    },

    methods: {
    }
}
</script>

<style scoped>
  >>>.morphology-select .v-select__selections input {
  width: 1em !important;
  }
</style>
