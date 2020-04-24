<template>
<v-app>

  <v-app-bar app color="primary" dark dense flat>
    <v-toolbar-title>
      Morphology
    </v-toolbar-title>

    <v-toolbar-title class="ml-8">
      Телеграм: <a class="white--text" href="https://t.me/joinchat/HA7ACB09k1-CXOuSSog4Vg">@Morphology</a>
    </v-toolbar-title>

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
              <v-toolbar flat>
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

                  <v-btn color="primary" outlined to="/advices">
                    Advices
                    —
                    {{visibleAdvices}}
                    /
                    {{totalAdvices}}
                  </v-btn>
                </v-btn-toggle>

                <v-spacer/>

                <morphology-help class="ml-1"/>

                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn color="warning"
                           v-on="on"
                           class="ml-1">
                      Examples
                      <v-icon right>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item v-for="(example, index) in examples"
                                 :key="index"
                                 @click="loadExample(example)">
                      <v-list-item-title>{{ example.name }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>

                <v-btn color="success" @click="onExport" class="ml-1">Export</v-btn>

                <input type="file"
                       id="morphology-import-file"
                       class="d-none"
                       @change="onImportFileSelect"/>

                <v-btn color="primary" @click="onImport" class="ml-1">Import</v-btn>

                <v-btn color="error" @click="onClear" class="ml-1">Clear</v-btn>

              </v-toolbar>

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

import * as FileSaver from 'file-saver';

import * as items from '@/logic/items.js';
import * as rules from '@/logic/rules.js';
import * as templates from '@/logic/templates.js';

import MorphologyGroup from '@/components/MorphologyGroup';
import MorphologyMainPanel from '@/components/MorphologyMainPanel';
import MorphologyHelp from '@/components/MorphologyHelp';

import exampleDress from '@/../examples/dress/dress_5.json'
import exampleSnowmobile from '@/../examples/snowmobile/snowmobile_1.json'

export default {
    name: 'App',

    components: {
        MorphologyMainPanel,
        MorphologyGroup,
        MorphologyHelp
    },

    data: () => ({
        examples: [{name: 'Выбор одежды', data: exampleDress},
                   {name: 'Снегоход (из википедии)', data: exampleSnowmobile}]
    }),

    computed: {
        totalRules () {
            return this.$store.getters['rules/rulesNumber'];
        },

        totalSolutions () {
            return this.$store.getters['solutions/solutionsNumber'];
        },

        visibleAdvices () {
            return this.$store.getters['advices/visibleAdvicesNumber'];
        },

        totalAdvices () {
            return this.$store.getters['advices/advicesNumber'];
        }
    },

    methods: {
        onClear() {
            this.$store.dispatch('clearAll');
        },

        onImport() {
            const file = document.getElementById('morphology-import-file');

            file.click();
        },

        onExport() {

            const data = JSON.stringify(this.$store.getters['serialize'], null, 2);

            var file = new File([data], "morphology.json", {type: "application/json;charset=utf-8"});

            FileSaver.saveAs(file);
        },

        onImportFileSelect(event) {

            const file = event.target.files[0];

            var reader = new FileReader();

            const store = this.$store;

            reader.onload = function (e) {
                store.dispatch('importAll', {data: JSON.parse(e.target.result)})
            };

            reader.readAsText(file);
        },

        loadExample(example) {
            this.$gtag.event('load_example', { event_category: example.name });
            this.$store.dispatch('importAll', {data: example.data});
        },

    },

    created: function() {

        const itemsIds = [];

        for (let i=0; i<8; i++) {
            const itemId = uuid.v4();
            this.$store.dispatch("createItem", {itemId: itemId, text: `property ${i}`});
            itemsIds.push(itemId);
        }

        this.$store.dispatch("createGroupRule", {name: "Group A",
                                                 items: [itemsIds[0], itemsIds[1], itemsIds[4]]});

        this.$store.dispatch("createGroupRule", {name: "Group B",
                                                 items: [itemsIds[2], itemsIds[3]]});

        this.$store.dispatch("createGroupRule", {name: "Group C",
                                                 items: [itemsIds[5], itemsIds[6], itemsIds[7]]});

        const scoreRule1 = rules.rawCreateRule({type: rules.RULE_TYPE.ITEM_SCORE,
                                                template: templates.createItemsSet({items: [itemsIds[1]]}),
                                                action: {type: rules.ACTION_TYPE.SCORE.key,
                                                         args: {score: {amount: 10}}},
                                                name: items.ruleNameForItemScore(this.$store.getters['items/activeItems'][itemsIds[1]])});

        this.$store.dispatch("setRule", {ruleId: uuid.v4(),
                                         rule: scoreRule1});

        const scoreRule2 = rules.rawCreateRule({type: rules.RULE_TYPE.ITEM_SCORE,
                                                template: templates.createItemsSet({items: [itemsIds[5]]}),
                                                action: {type: rules.ACTION_TYPE.SCORE.key,
                                                         args: {score: {amount: 3}}},
                                                name: items.ruleNameForItemScore(this.$store.getters['items/activeItems'][itemsIds[5]])});

        this.$store.dispatch("setRule", {ruleId: uuid.v4(),
                                         rule: scoreRule2});
    }
};
</script>
