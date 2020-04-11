<template>

<strong>

  {{conditionName}}

  <template v-if="conditionType.is('ALL_OF')">
  </template>

  <template v-if="conditionType.is('NONE_OF')">
  </template>

  <template v-if="conditionType.is('CARDINALITY')">

    <code>
      where
      {{condition.args.nOf.min}}
      &le;
      <var>N</var>
      &le;
      {{condition.args.nOf.max}}
    </code>

  </template>

</strong>

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
