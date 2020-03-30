<template>
<v-card>
  <v-card-title>Solution Info</v-card-title>

  <v-list two-line subheader>
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
          <span :class="textClasses">
            {{statistics.realDecissionSpace}}
          </span>
        </v-list-item-action-text>

        <v-list-item-action-text v-else>
          —
        </v-list-item-action-text>

      </v-list-item-action>

    </v-list-item>

    <v-divider></v-divider>

    <v-subheader>Best Solution</v-subheader>

    <template v-if="solution">
      <v-list-item  v-for="groupInfo in solution">

        <v-list-item-content>
          <v-list-item-title v-if="groups[groupInfo.groupId].name">
            {{groups[groupInfo.groupId].name}}
          </v-list-item-title>

          <v-list-item-title v-else>
            Unknown group
          </v-list-item-title>

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
import * as solver from "@/logic/solver";
import * as statistics from "@/logic/statistics";

export default {
    name: "MorphologySolutionInfo",

    components: {
    },

    data: () => ({
        statistics: null,
        solution: null,
        topologyVersion: null
    }),

    props: [],

    computed: {

        groups() {
            return this.$store.getters['groups/activeGroups'];
        },

        items() {
            return this.$store.getters['items/activeItems'];
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

        solutionSpaceEstimation() {

            let space = 1;

            for (let i in this.groups) {
                const group = this.groups[i];

                space *= statistics.solutionSpaceEstimationForGroup(group.items.length,
                                                                    group.solutionCardinality.min,
                                                                    group.solutionCardinality.max);
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
                const group = groups[groupId];
                const restriction = new solver.GroupRestriction(groupId,
                                                                group.solutionCardinality.min,
                                                                group.solutionCardinality.max,
                                                                group.items.slice());

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

            this.topologyVersion = this.$store.state.topologyVersion;
        }
    }
}
</script>
