<template>

<v-sheet class="d-flex align-baseline">

  {{conditionName}}


  <template v-if="conditionType.is('ALL_OF')">
    <morphology-simple-alert type="info">
      Apply rule if solution contains all of choosen items
    </morphology-simple-alert>
  </template>

  <template v-if="conditionType.is('NONE_OF')">
    <morphology-simple-alert type="info">
      Apply rule if solution contains none of choosen items
    </morphology-simple-alert>
  </template>

  <template v-if="conditionType.is('CARDINALITY')">

    <v-sheet class="text-no-wrap ml-2 mr-2">
      (where:
      {{condition.args.nOf.min}}
      &le;
      <var>N</var>
      &le;
      {{condition.args.nOf.max}})
    </v-sheet>

    <morphology-simple-alert type="info">
      Apply rule if solution contains between <strong>min</strong> and <strong>max</strong> items inclusively.
    </morphology-simple-alert>

  </template>

</v-sheet>

</template>

<script>

import * as rules from '@/logic/rules.js';

import MorphologySwitch from "@/components/MorphologySwitch";
import MorphologySimpleAlert from "@/components/MorphologySimpleAlert";

export default {
    name: "MorphologyRuleConditionInfo",

    components: {
        MorphologySimpleAlert
    },

    data: () => ({}),

    props: ["condition"],

    computed: {
        conditionType() {
            return rules.CONDITION_TYPE.get(this.condition.type);
        },

        conditionName() {
            return rules.CONDITION_TYPE_INFO[this.conditionType].text;
        }
    },

    methods: {
    }
}
</script>
