<template>
<v-sheet>
    <morphology-solution-statistics-record caption="Possible solutions"
                                           :is-changed="isChanged"
                                           :value="fullSolutionsSpace"/>

    <morphology-solution-statistics-record caption="Expected solutions"
                                           :is-changed="isChanged"
                                           :value="solutionsSpaceEstimation"/>

    <morphology-solution-statistics-record caption="Checked solutions"
                                           :is-changed="isChanged"
                                           :value="checkedSolutions"/>

    <morphology-solution-statistics-record caption="Scored solutions"
                                           :is-changed="isChanged"
                                           :value="scoredSolutions"/>

    <morphology-solution-statistics-record caption="Time consumed"
                                           :is-changed="isChanged"
                                           :value="searchTime"
                                           suffix="sec"/>
</v-sheet>
</template>

<script>

import MorphologySolutionStatisticsRecord from "@/components/MorphologySolutionStatisticsRecord";

export default {
    name: "MorphologySolutionStatistics",

    components: {
        MorphologySolutionStatisticsRecord
    },

    data: () => ({}),

    props: ['fullSolutionsSpace', 'solutionsSpaceEstimation', 'checkedSolutions', 'scoredSolutions', 'searchTime', 'isChanged'],

    computed: {
    }
}
</script>
