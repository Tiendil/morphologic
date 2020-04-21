<template>
<v-card>
  <v-card-title>Solution Info</v-card-title>

  <morphology-solver :searcher="currentSolver"
                     :statistics="currentStatistics"
                     :onComplete="onSearchComplete"
                     :onCancel="onSearchCancel"
                     :fullSolutionsSpace="fullSolutionsSpace"
                     :solutionsSpaceEstimation="solutionsSpaceEstimation"/>

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

    <morphology-solution-statistics :fullSolutionsSpace="fullSolutionsSpace"
                                    :solutionsSpaceEstimation="solutionsSpaceEstimation"
                                    :checkedSolutions="statistics && statistics.checkedSolutions"
                                    :scoredSolutions="statistics && statistics.scoredSolutions"
                                    :searchTime="statistics && statistics.searchTime"
                                    :isChanged="isTopologyChanged"/>

    <v-divider></v-divider>

    <v-subheader>Best Solution</v-subheader>

    <template v-if="solutionDescription">
      <v-list-item  v-for="groupInfo in solutionDescription"
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
import * as templates from "@/logic/templates";
import * as solver from "@/logic/solver";
import * as statistics from "@/logic/statistics";
import * as advices from "@/logic/advices";

import MorphologySolutionStatistics from "@/components/MorphologySolutionStatistics";
import MorphologySolver from "@/components/MorphologySolver";


export default {
    name: "MorphologySolutionInfo",

    components: {
        MorphologySolver,
        MorphologySolutionStatistics
    },

    data: () => ({
        statistics: null,
        searcher: null,
        topologyVersion: null,
        currentSolver: null,
        currentStatistics: null
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
            if (this.isTopologyChanged) {
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

                space *= statistics.solutionSpaceEstimationForGroup(templates.getItems({expression: rule.template}).size,
                                                                    rule.condition.args.nOf.min,
                                                                    rule.condition.args.nOf.max);
            }

            return space;
        },

        solutionDescription() {
            const bestSolutionItems = this.$store.getters['solutions/bestSolutionItems'];

            const solutionDescription = [];

            const groupRulesIds = this.$store.getters['rules/groupRulesIds'];

            for (let i in groupRulesIds) {
                const ruleId = groupRulesIds[i];

                const groupRule = this.rules[ruleId];

                const groupInfo = {'ruleId': ruleId,
                                   'items': []};

                for (let i in bestSolutionItems) {
                    const itemId = bestSolutionItems[i];

                    if (templates.hasItem({expression: groupRule.template, itemId: itemId})) {
                        groupInfo.items.push(itemId);
                    }
                }

                solutionDescription.push(groupInfo);
            }

            return solutionDescription;
        }

    },

    methods: {

        runSolver() {
            // get checkers
            const items = Object.keys(this.$store.getters['items/activeItems']);

            let checkers = [];

            for (let ruleId in this.rules) {
                const rule = JSON.parse(JSON.stringify(this.rules[ruleId]));

                checkers.push(...rules.getCheckers(ruleId, rule));
            }

            // solve
            this.currentStatistics = {checkedSolutions: 0,
                                      scoredSolutions: 0,
                                      searchStartAt: Date.now(),
                                      searchTime: 0};

            const bestSolutionsLimit = 100;

            this.searcher = new solver.SolutionSearcher(bestSolutionsLimit);

            this.currentSolver = solver.search({searcher: this.searcher,
                                                items: items,
                                                checkers: checkers,
                                                statistics: this.currentStatistics,
                                                breakEvery: 10000});
        },

        onSearchComplete () {
            this.currentSolver = null;

            this.statistics = this.currentStatistics;

            this.currentStatistics = null;

            this.$store.commit("solutions/rewriteSolutions", {solutions: this.searcher.solutions.solutions});

            this.searcher = null;

            // genereate advices

            const newAdvices = advices.generateAdvices({currentRules: this.$store.getters['rules/activeRules'],
                                                        solutions: this.$store.getters['solutions/currentSolutions']})

            this.$store.commit("advices/refreshAdvices", {advices: newAdvices});

            this.topologyVersion = this.$store.state.topologyVersion;
        },

        onSearchCancel () {
            this.currentSolver = null;
            this.searcher = null;
        }
    }
}
</script>
