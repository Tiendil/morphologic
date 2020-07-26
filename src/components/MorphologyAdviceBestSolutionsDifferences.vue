
<template>

<v-card elevation="1">

  <v-card-title>
    Differentiate solutions
  </v-card-title>

  <v-card-text>

    <p>
      Your have two (best) solutions, which differ in some items.
    </p>

    <p>
      If you evaluate items from one of them (or change there evaluation), you reduce the number of best solutions.
    </p>

    <v-subheader>Common items</v-subheader>

    <template v-if="advice.data.itemsCommon.length > 0">
      <morphology-items-set :items="advice.data.itemsCommon"
                            class="flex-grow-1"/>
    </template>

    <span v-else
          class="font-italic">
      No common part
    </span>

    <v-subheader>Solution 1</v-subheader>

    <morphology-items-set :items="advice.data.itemsA"
                          class="flex-grow-1"/>

    <v-subheader>Solution 2</v-subheader>

    <morphology-items-set :items="advice.data.itemsB"
                          class="flex-grow-1"/>

  </v-card-text>

  <morphology-advice-actions :advice="advice"/>

</v-card>

</template>

<script>

import * as advices from '@/logic/advices.js';

import MorphologyItemsSet from "@/components/MorphologyItemsSet";
import MorphologyAdviceActions from "@/components/MorphologyAdviceActions";


export default {
    name: 'MorphologyAdviceBestSolutionsDifferences',

    components: {
        MorphologyItemsSet,
        MorphologyAdviceActions
    },

    data: () => ({}),

    props: ['advice'],

    computed: {
        rule () {
            return this.$store.getters['rules/ruleById'](this.advice.data.ruleId);
        }
    },

    methods: {
    }
}
</script>
