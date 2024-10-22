<template>
<v-row>
  <v-col>

    <v-data-iterator :items="solutions"
                     :search="search"
                     :custom-filter="itemsFilter"
                     disable-pagination
                     hide-default-footer>

      <template v-slot:header>
        <v-toolbar>

          <v-text-field v-model="search"
                        clearable
                        flat
                        hide-details
                        label="Search"
                        prepend-inner-icon="mdi-magnify"/>

        </v-toolbar>
      </template>

      <template v-slot:no-data>
        <v-alert class="mt-8 pl-1"
                 type="info">
          No solutions found
        </v-alert>
      </template>

      <template v-slot:no-results>
        <v-alert class="mt-8 pl-1"
                 type="info">
          No solutions found
        </v-alert>
      </template>

      <template v-slot:item="props">
        <v-sheet class="d-flex flex-row align-center mt-4 pl-1">

          <strong>
            {{ props.item.index + 1 }}
          </strong>

          <morphology-solution-score :items="props.item.items"
                                     class="ml-4 flex-grow-0"/>

          <morphology-items-set :items="props.item.items"
                                :itemsColors="itemsColors"
                                class="ml-4 flex-grow-1"/>
        </v-sheet>
      </template>

      <template v-slot:footer>
      </template>

    </v-data-iterator>

  </v-col>
</v-row>
</template>

<script>

import * as uuid from 'uuid';

import * as rules from '@/logic/rules';
import * as templates from '@/logic/templates';

import MorphologyItemsSet from "@/components/MorphologyItemsSet";
import MorphologySolutionScore from "@/components/MorphologySolutionScore";


function sortItemsByGroup (store, items) {
    const itemsIds = [];

    const rulesIds = store.getters['rules/groupRulesIds'];

    for (let i in rulesIds) {
        const rule = store.getters['rules/ruleById'](rulesIds[i]);

        for (let itemId of templates.getItems({expression: rule.template})) {
            if (items.indexOf(itemId) != -1) {
                itemsIds.push(itemId);
            }

        }
    }

    return itemsIds;
}


export default {
    name: 'Rules',

    components: {
        MorphologyItemsSet,
        MorphologySolutionScore
    },

    data: () => ({
        search: ''
    }),

    computed: {
        solutions () {
            const solutions = this.$store.getters['solutions/currentSolutionsCopy'];

            for (let i in solutions) {
                let solution = solutions[i];

                solution.index = parseInt(i);

                solution.items = sortItemsByGroup(this.$store, solution.items);
            }

            return solutions;
        },

        bestSolution () {
            return this.solutions[0];
        },

        itemsColors () {
            let colors = {};

            const items = this.$store.getters['items/activeItems']

            for (let itemId in items) {
                const item = items[itemId];

                let color = null;

                if (this.bestSolution.items.indexOf(itemId) != -1) {
                    color = 'green lighten-4';
                }

                colors[itemId] = color;
            }

            return colors;
        }
    },

    methods: {

        itemsFilter (solutions, search) {
            const result = [];

            const template = search ? search.toLowerCase() : '';

            for (let i in solutions) {
                const solution = solutions[i];

                for (let j in solution.items) {
                    const itemId = solution.items[j];

                    const item = this.$store.getters['items/activeItems'][itemId];

                    if (item.text.toLowerCase().includes(template)) {
                        result.push(solution);
                        break;
                    }
                }

            }

            return result;
        }

    }
}
</script>
