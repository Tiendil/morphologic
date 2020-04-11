<template>
<v-menu v-model="menu"
        :close-on-content-click="false"
        :nudge-width="200"
        offset-x>

  <template v-slot:activator="{ on }">
    <v-btn text
           small
           v-on="on">
          score: {{scoreInfo.totalScore}}
    </v-btn>
  </template>

  <v-card class="pb-4">
    <v-card-title>Total score: {{scoreInfo.totalScore}}</v-card-title>

    <v-alert v-if="scoreInfo.appliedRules.length == 0"
             type="info">
      Solution has no scores.
    </v-alert>

    <template v-else>

      <v-sheet v-for="ruleInfo in scoreInfo.appliedRules"
               class="d-flex ml-4 mr-4 mt-1 font-weight-medium"
               :key="ruleInfo.ruleId">
        <v-sheet :class="'flex-grow-1 ' + ruleTextClasses(ruleInfo.score)">{{ruleInfo.name}}</v-sheet>
        <v-sheet :class="'flex-grow-0 ' + ruleTextClasses(ruleInfo.score)">{{ruleInfo.score}}</v-sheet>
      </v-sheet>

    </template>

  </v-card>
</v-menu>
</template>

<script>

import * as rules from "@/logic/rules";
import * as solver from "@/logic/solver";


function compareScores (a, b) {
    if (a.score > b.score) {
        return -1;
    }

    if (a.score < b.score) {
        return 1;
    }

    return 0;
}


export default {
    name: 'MorphologySolutionScore',

    components: {
    },

    data: () => ({
        menu: false
    }),

    props: ['items'],

    computed: {
        rules() {
            return this.$store.getters['rules/activeRules'];
        },

        scoreInfo () {
            const info = {totalScore: 0,
                          appliedRules: []};


            let checkers = [];

            for (let ruleId in this.rules) {
                const rule = this.rules[ruleId];

                checkers.push(...rules.getCheckers(ruleId, rule));
            }

            const scores = solver.detailedSolutionScore(this.items, checkers);

            scores.sort(compareScores);

            info.appliedRules = scores;

            for (let i in info.appliedRules) {
                let ruleInfo = info.appliedRules[i];

                const rule = this.$store.getters['rules/ruleById'](ruleInfo.ruleId);

                ruleInfo.name = rule.name ? rule.name : 'no name';

                info.totalScore += ruleInfo.score;
            }

            return info;
        }
    },

    methods: {
        ruleTextClasses (score) {
            if (score > 0) {
                return 'green--text';
            }

            return 'red--text';
        }
    }
}
</script>
