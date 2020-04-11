<template>

<v-sheet class="d-flex align-baseline">

  <v-select :items="conditions"
            dense
            v-model="condition.type"
            :menu-props="{ 'offset-y': true }"
            class="flex-grow-0 morphology-select pr-2"/>

  <morphology-switch :modes="conditionTypes"
                     v-model="condition.type">

    <template v-slot:ALL_OF>
      <morphology-simple-alert type="info">
        Apply rule if solution contains all of choosen items
      </morphology-simple-alert>
    </template>

    <template v-slot:NONE_OF>
      <morphology-simple-alert type="info">
        Apply rule if solution contains none of choosen items
      </morphology-simple-alert>
    </template>

    <template v-slot:CARDINALITY>

      <v-text-field dense
                    type="number"
                    v-model="condition.args.nOf.min"
                    class="flex-grow-0 morphology-cardinality-input"
                    placeholder="Min"/>

      <v-sheet class="text-no-wrap ml-2 mr-2">
        &le;
        <var>N</var>
        &le;
      </v-sheet>

      <v-text-field dense
                    type="number"
                    v-model="condition.args.nOf.max"
                    class="flex-grow-0 morphology-cardinality-input"
                    placeholder="Max"/>

      <morphology-simple-alert type="info">
        Apply rule if solution contains between <strong>min</strong> and <strong>max</strong> items inclusively.
      </morphology-simple-alert>

    </template>

  </morphology-switch>

</v-sheet>

</template>

<script>

import * as rules from '@/logic/rules.js';

import MorphologySwitch from "@/components/MorphologySwitch";
import MorphologySimpleAlert from "@/components/MorphologySimpleAlert";

export default {
    name: "MorphologyRuleConditionEditor",

    components: {
        MorphologySwitch,
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
