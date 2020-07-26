<template>

<v-overlay :absolute="false"
           :opacity="0.5"
           :value="!!searcher">
  <v-card light>

    <v-card-title>Solution search progress</v-card-title>

    <morphology-solution-statistics :fullSolutionsSpace="fullSolutionsSpace"
                                    :solutionsSpaceEstimation="solutionsSpaceEstimation"
                                    :checkedSolutions="statistics && statistics.checkedSolutions"
                                    :scoredSolutions="statistics && statistics.scoredSolutions"
                                    :searchTime="statistics && statistics.searchTime"/>

    <v-card-actions>
      <v-btn text
             @click="cancel">
        Cancel
      </v-btn>
    </v-card-actions>

  </v-card>

</v-overlay>

</template>

<script>

import MorphologySolutionStatistics from "@/components/MorphologySolutionStatistics";

export default {
    name: "MorphologySolver",

    components: {
        MorphologySolutionStatistics
    },

    data: function() {
        const self = this;
        const timer = setInterval(function(){ self.doStep()}, 1);

        return {timer: timer};
    },

    props: ['searcher', 'onComplete', 'onCancel', 'statistics', 'fullSolutionsSpace', 'solutionsSpaceEstimation'],

    computed: {
    },

    methods: {

        cancel () {
            this.onCancel();
        },

        doStep () {
            if (!this.searcher) {
                return;
            }

            const result = this.searcher.next();

            this.statistics.searchTime = (Date.now() - this.statistics.searchStartAt) / 1000;

            if (result.done) {
                this.onComplete();
                return;
            }
        }
    }
}
</script>
