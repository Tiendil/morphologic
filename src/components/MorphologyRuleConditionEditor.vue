<template>

<v-sheet class="d-inline-flex align-baseline">

  <v-select :items="conditions"
            dense
            v-model="condition.type"
            :menu-props="{ 'offset-y': true }"
            class="flex-grow-0 morphology-select pr-2"/>

  <morphology-switch :modes="conditionTypes"
                     v-model="condition.type">

    <template v-slot:ALL_OF>
    </template>

    <template v-slot:NONE_OF>
    </template>

    <template v-slot:CARDINALITY>

      where

      <morphology-number-input v-model="condition.args.nOf.min"
                               class="ml-1"
                               placeholder="Min"/>

      <v-sheet class="text-no-wrap ml-2 mr-2">
        &le;
        <var>N</var>
        &le;
      </v-sheet>

      <morphology-number-input v-model="condition.args.nOf.max"
                               placeholder="Max"/>

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
    name: "MorphologyRuleConditionEditor",

    components: {
        MorphologySwitch,
        MorphologyNumberInput,
        MorphologySimpleAlert
    },

    data: function () {
        const selectInfo = rules.getEnumSelectInfo(rules.CONDITION_TYPE, rules.CONDITION_TYPE_INFO);

        return {conditionTypes: selectInfo.types,
                conditions: selectInfo.infos};
    },

    props: ["condition"],

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

  >>>.morphology-cardinality-input input{
  width: 3em;
  }
</style>
