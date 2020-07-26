
<template>

<v-card elevation="1">

  <v-card-title>
    Group "{{rule.name}}" has no scored items
  </v-card-title>

  <v-card-text>
    <p>
      Your group has no items with applied scores.
    </p>

    <p>
      If you evaluate at least some of them, you greatly increase accuracy of generated solution.
    </p>
  </v-card-text>

  <morphology-advice-actions :advice="advice"/>

</v-card>

</template>

<script>

import * as advices from '@/logic/advices.js';

import MorphologyAdviceActions from "@/components/MorphologyAdviceActions";


export default {
    name: 'MorphologyAdviceGroupHasNoScoredItems',

    components: {
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
