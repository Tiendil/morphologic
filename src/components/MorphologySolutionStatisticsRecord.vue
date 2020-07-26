<template>

<v-list-item>

  <v-list-item-content>
    <v-list-item-title>{{caption}}:</v-list-item-title>
  </v-list-item-content>

  <v-list-item-action>

    <v-list-item-action-text v-if="value">
      <morphology-short-number :value="value"
                               maxDigits="5"
                               precision="2"
                               :class="textClasses"/>
      <span v-if="suffix">
        {{suffix}}
      </span>
    </v-list-item-action-text>

    <v-list-item-action-text v-else>
      —
    </v-list-item-action-text>

  </v-list-item-action>

</v-list-item>

</template>

<script>

import MorphologyShortNumber from "@/components/MorphologyShortNumber";


export default {
    name: "MorphologySolutionStatisticsRecord",

    components: {
        MorphologyShortNumber
    },

    data: () => ({
    }),

    props: ["caption", "value", "isChanged", "suffix"],

    computed: {

        textClasses() {
            if (this.isChanged) {
                return 'warning--text';
            }

            return '';
        }
    },

    methods: {
    }
}
</script>
