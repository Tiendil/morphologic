<template>
<v-row>
  <v-col>

    <v-data-iterator :items="advices"
                     :custom-filter="advicesFilter"
                     disable-pagination
                     hide-default-footer>

      <template v-slot:header>

        <v-toolbar>

          <v-btn @click="unhideAll"
                 color="primary">
            Unhide All
          </v-btn>

          <v-switch v-model="showHiddenAdvices"
                    hide-details
                    label="Show hidden advices"
                    class="ml-4"/>

          <v-spacer/>

          <morphology-simple-alert type="info">
            List of advices refreshed every time after solutions recalculating.
          </morphology-simple-alert>

        </v-toolbar>

      </template>

      <template v-slot:no-data>
        <v-alert class="mt-8 pl-1"
                 type="info">
          No advices found
        </v-alert>
      </template>

      <template v-slot:no-results>
        <v-alert class="mt-8 pl-1"
                 type="info">
          No advices found
        </v-alert>
      </template>

      <template v-slot:item="props">

        <morphology-advice-group-has-no-scored-items v-if="ADVICE_TYPE.GROUP_HAS_NO_SCORED_ITEMS.is(props.item.type)"
                                                     :advice="props.item"
                                                     class="mt-4"/>

        <morphology-advice-best-solutions-differences v-if="ADVICE_TYPE.BEST_SOLUTIONS_DIFFERENCES.is(props.item.type)"
                                                      :advice="props.item"
                                                      class="mt-4"/>

      </template>

    </v-data-iterator>

  </v-col>
</v-row>
</template>

<script>

import * as advices from '@/logic/advices.js';

import MorphologySimpleAlert from "@/components/MorphologySimpleAlert";
import MorphologyAdviceGroupHasNoScoredItems from "@/components/MorphologyAdviceGroupHasNoScoredItems";
import MorphologyAdviceBestSolutionsDifferences from "@/components/MorphologyAdviceBestSolutionsDifferences";


export default {
    name: 'Advices',

    components: {
        MorphologySimpleAlert,
        MorphologyAdviceGroupHasNoScoredItems,
        MorphologyAdviceBestSolutionsDifferences
    },

    data: () => ({
        showHiddenAdvices: false
    }),

    computed: {
        advices () {
            let advices = this.$store.getters['advices/currentAdvices'];

            if (!this.showHiddenAdvices) {
                advices = advices.filter(advice => !this.$store.getters['advices/isAdviceHidden'](advice.uid));
            }

            return advices;
        },

        ADVICE_TYPE () {
            return advices.ADVICE_TYPE;
        }
    },

    methods: {

        advicesFilter (advices, search) {
            return advices;

        },

        unhideAll() {
            this.$store.commit('advices/showAllAdvices');
        }
    }
}
</script>
