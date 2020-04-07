<template>
<v-card>
  <v-card-title>Solution Info</v-card-title>

  <v-list>
    <v-list-item v-if="isTopologyChanged">
      <v-list-item-content>
        <v-alert dense
                 outlined
                 type="warning"
                 class="body-2">
          Data changed.<br/>
          Solution may not satisfy new conditions.
        </v-alert>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>
    <v-subheader>General</v-subheader>

    <morphology-solution-statistics-record caption="Possible solutions"
                                           :is-changed="isTopologyChanged"
                                           :value="fullSolutionsSpace"/>

    <morphology-solution-statistics-record caption="Expected solutions"
                                           :is-changed="isTopologyChanged"
                                           :value="solutionsSpaceEstimation"/>

    <morphology-solution-statistics-record caption="Checked solutions"
                                           :is-changed="isTopologyChanged"
                                           :value="statistics && statistics.checkedSolutions"/>

    <morphology-solution-statistics-record caption="Rated solutions"
                                           :is-changed="isTopologyChanged"
                                           :value="statistics && statistics.ratedSolutions"/>

    <v-divider></v-divider>

    <v-subheader>Best Solution</v-subheader>

    <template v-if="solution">
      <v-list-item  v-for="groupInfo in solution"
                    :key="groupInfo.grupId">

        <v-list-item-content>
          <v-list-item-title v-if="rules[groupInfo.ruleId].name">
            {{rules[groupInfo.ruleId].name}}
          </v-list-item-title>

          <v-list-item-title v-else>
            Unknown group
          </v-list-item-title>

          <template v-if="groupInfo.items.length > 0">
            <v-list-item-subtitle v-for="itemId in groupInfo.items"
                                  :key="itemId"
                                  :class="textClasses">
              <span v-if="items[itemId].text">
                {{items[itemId].text}}
              </span>

              <span v-else>
                Unknown item
              </span>
            </v-list-item-subtitle>
          </template>

          <v-list-item-subtitle v-else :class="textClasses">
            —
          </v-list-item-subtitle>

        </v-list-item-content>

      </v-list-item>

    </template>

    <v-list-item v-else>

      <v-list-item-content>
        <v-list-item-title>No info</v-list-item-title>
        <v-list-item-subtitle>Press "Solve" to build one</v-list-item-subtitle>
      </v-list-item-content>

    </v-list-item>

  </v-list>

  <v-card-actions>
    <v-btn color="success"
           v-on:click="runSolver">Solve</v-btn>
  </v-card-actions>
</v-card>
</template>

<script>
import * as rules from "@/logic/rules";
import * as solver from "@/logic/solver";
import * as statistics from "@/logic/statistics";

import MorphologySolutionStatisticsRecord from "@/components/MorphologySolutionStatisticsRecord";


export default {
    name: "MorphologySolutionInfo",

    components: {
        MorphologySolutionStatisticsRecord
    },

    data: () => ({
        statistics: null,
        solution: null,
        topologyVersion: null
    }),

    props: [],

    computed: {

        items() {
            return this.$store.getters['items/activeItems'];
        },

        rules() {
            return this.$store.getters['rules/activeRules'];
        },

        isTopologyChanged() {
            if (this.topologyVersion == null) {
                return false;
            }
            return this.$store.state.topologyVersion != this.topologyVersion;
        },

        textClasses() {
            if (this.isChanged) {
                return 'warning--text';
            }

            return '';
        },

        fullSolutionsSpace() {
            return statistics.factorial(Object.keys(this.items).length);
        },

        solutionsSpaceEstimation() {

            const rulesIds = this.$store.getters['rules/groupRulesIds'];

            let space = 1;

            for (let i in rulesIds) {
                const rule = this.$store.getters['rules/ruleById'](rulesIds[i]);

                space *= statistics.solutionSpaceEstimationForGroup(rule.template.items.length,
                                                                    rule.condition.args.nOf.min,
                                                                    rule.condition.args.nOf.max);
            }

            return space;
        }

    },

    methods: {

        runSolver() {
            // get checkers
            const items = Object.keys(this.$store.getters['items/activeItems']);

            let checkers = [];

            for (let ruleId in this.rules) {
                const rule = this.rules[ruleId];

                checkers.push(...rules.getCheckers(rule));
            }

            // solve
            const info = solver.solve(items, checkers);

            // process result
            this.statistics = info.statistics;

            let solution = [];

            const groupRulesIds = this.$store.getters['rules/groupRulesIds'];

            for (let i in groupRulesIds) {
                const ruleId = groupRulesIds[i];

                const groupRule = this.rules[ruleId];

                const groupInfo = {'ruleId': ruleId,
                                   'items': []};

                for (let i in info.bestSolution) {
                    const itemId = info.bestSolution[i];

                    if (groupRule.template.items.indexOf(itemId) != -1) {
                        groupInfo.items.push(itemId);
                    }
                }

                solution.push(groupInfo);
            }

            this.solution = solution;

            this.topologyVersion = this.$store.state.topologyVersion;
        }
    }
}
</script>
