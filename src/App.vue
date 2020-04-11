<template>
<v-app>

  <v-app-bar app color="primary" dark dense flat>
    <h1>Morphology</h1>
  </v-app-bar>

  <v-content>
    <v-container>

      <v-row>

        <v-col cols="2">
          <morphology-main-panel/>
        </v-col>

        <v-col cols="10">
          <v-row>
            <v-col>
              <v-btn-toggle>
                <v-btn color="primary" outlined to="/">Groups</v-btn>
                <v-btn color="primary" outlined to="/rules">
                  Rules
                  —
                  {{totalRules}}
                </v-btn>
                <v-btn color="primary" outlined to="/solutions">
                  Solutions
                  —
                  {{totalSolutions}}
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>

          <router-view/>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</v-app>
</template>

<script>
import * as uuid from 'uuid';

import * as items from '@/logic/items.js';
import * as rules from '@/logic/rules.js';

import MorphologyGroup from '@/components/MorphologyGroup';
import MorphologyMainPanel from '@/components/MorphologyMainPanel';

export default {
    name: 'App',

    components: {
        MorphologyMainPanel,
        MorphologyGroup,
    },

    data: () => ({
    }),

    computed: {
        totalRules () {
            return this.$store.getters['rules/rulesNumber'];
        },

        totalSolutions () {
            return this.$store.getters['solutions/solutionsNumber'];
        }
    },

    created: function() {
        const itemsIds = [];

        for (let i=0; i<8; i++) {
            const itemId = uuid.v4();
            this.$store.dispatch("createItem", {itemId: itemId, text: `item ${i}`});
            itemsIds.push(itemId);
        }

        this.$store.dispatch("createGroupRule", {name: "XYZ",
                                                 items: [itemsIds[0], itemsIds[1], itemsIds[4]]});

        this.$store.dispatch("createGroupRule", {name: "P Q R S",
                                                 items: [itemsIds[2], itemsIds[3]]});

        this.$store.dispatch("createGroupRule", {name: "third group",
                                                 items: [itemsIds[5], itemsIds[6], itemsIds[7]]});

        const scoreRule1 = rules.rawCreateRule({type: rules.RULE_TYPE.ITEM_SCORE,
                                                name: items.ruleNameForItemScore(this.$store.getters['items/activeItems'][itemsIds[1]])});
        scoreRule1.action.type = rules.ACTION_TYPE.SCORE.key;
        scoreRule1.action.args.score.amount = 10;
        scoreRule1.template.items.push(itemsIds[1]);

        this.$store.dispatch("setRule", {ruleId: uuid.v4(),
                                         rule: scoreRule1});

        const scoreRule2 = rules.rawCreateRule({type: rules.RULE_TYPE.ITEM_SCORE,
                                                name: items.ruleNameForItemScore(this.$store.getters['items/activeItems'][itemsIds[5]])});
        scoreRule2.action.type = rules.ACTION_TYPE.SCORE.key;
        scoreRule2.action.args.score.amount = 3;
        scoreRule2.template.items.push(itemsIds[5]);

        this.$store.dispatch("setRule", {ruleId: uuid.v4(),
                                         rule: scoreRule2});
    }
};
</script>
