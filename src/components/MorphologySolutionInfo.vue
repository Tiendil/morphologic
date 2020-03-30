<template>
<v-card>
  <v-card-title>Solution Info</v-card-title>

  <v-list two-line subheader>
    <v-divider></v-divider>
    <v-subheader>General</v-subheader>

    <v-list-item>

      <v-list-item-content>
        <v-list-item-title>Full decission space:</v-list-item-title>
      </v-list-item-content>

      <v-list-item-action>
        <v-list-item-action-text>
          {{solutionSpaceEstimation}}
        </v-list-item-action-text>
      </v-list-item-action>

    </v-list-item>

    <v-list-item>

      <v-list-item-content>
        <v-list-item-title>Real decission space:</v-list-item-title>
      </v-list-item-content>

      <v-list-item-action>

        <v-list-item-action-text v-if="statistics">
          {{statistics.realDecissionSpace}}
        </v-list-item-action-text>

        <v-list-item-action-text v-else>
          —
        </v-list-item-action-text>

      </v-list-item-action>

    </v-list-item>

    <v-divider></v-divider>

    <v-subheader>Best Solution</v-subheader>

    <template v-if="solution">
      <template v-for="groupInfo in solution">
        <v-subheader :key="'group-header-' + groupInfo.groupId">{{groups[groupInfo.groupId].name}}</v-subheader>

        <v-list-item v-for="itemId in groupInfo.items"
                     :key="itemId">

          <v-list-item-content>
            <v-list-item-title>{{items[itemId].text}}</v-list-item-title>
          </v-list-item-content>

        </v-list-item>

      </template>
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
import * as solver from "@/logic/solver";
import * as statistics from "@/logic/statistics";

export default {
    name: "MorphologySolutionInfo",

    components: {
        // MorphologyItem
    },

    data: () => ({
        statistics: null,
        solution: null
    }),

    props: [],

    computed: {

        groups() {
            return this.$store.getters['groups/activeGroups'];
        },

        items() {
            return this.$store.getters['items/activeItems'];
        },

        solutionSpaceEstimation() {

            let space = 1;

            for (let i in this.groups) {
                const group = this.groups[i];

                space *= statistics.solutionSpaceEstimationForGroup(group.items.length,
                                                                    1,
                                                                    1);
            }

            return space;
        }

    },

    methods: {
        runSolver() {
            const items = [];

            for (let itemId in this.$store.getters['items/activeItems']) {
                items.push(itemId);
            }

            let restrictions = [];

            const groups = this.$store.getters['groups/activeGroups'];

            for (let groupId in groups) {
                const restriction = new solver.GroupRestriction(groupId,
                                                                1,
                                                                1,
                                                                groups[groupId].items.slice());

                restrictions.push(restriction);
            }

            const info = solver.solve(items,
                                      restrictions);

            this.statistics = info.statistics;

            let solution = [];

            for (let groupId in this.groups) {

                const groupInfo = {'groupId': groupId,
                                   'items': []};

                for (let i in info.bestSolution) {
                    const itemId = info.bestSolution[i];

                    if (this.groups[groupId].items.indexOf(itemId) != -1) {
                        groupInfo.items.push(itemId);
                    }
                }

                solution.push(groupInfo);
            }

            this.solution = solution;
        }
    }
}
</script>
