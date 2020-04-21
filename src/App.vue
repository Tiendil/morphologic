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

                <v-btn color="success" @click="onExport">Export</v-btn>

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

 //        x() {
 //            let y = {'data': {'expressions': [{'data': {'expressions': [{'data': {'expressions': [{'data': {'itemId': 'XXX'},
 //          'type': 'ITEM',
 //          'uid': 'bfeed36b-45a3-42ec-8d04-2fbde0459f28'}]},
 //       'type': 'SET',
 //       'uid': '66c8f048-494f-40de-a2bd-dd9f76b78e14'},
 //      {'data': {'expressions': [{'data': {'expressions': [{'data': {'expressions': [{'data': {'itemId': 'XXX'},
 //                'type': 'ITEM',
 //                'uid': '4c052e74-d01c-4822-9a9d-6998e138dd36'},
 //               {'data': {'itemId': 'XXX'},
 //                'type': 'ITEM',
 //                'uid': '9b23000e-e504-4bcd-b2e6-048a8f4c337c'},
 //               {'data': {'itemId': 'XXX'},
 //                'type': 'ITEM',
 //                'uid': '742c805e-a5c7-4095-b092-446e31de1a89'}]},
 //             'type': 'SET',
 //             'uid': '370d4608-cf80-4b1f-a846-8e5838ca64ea'},
 //            {'data': {'expressions': [{'data': {'itemId': 'XXX'},
 //                'type': 'ITEM',
 //                'uid': '7d9f9f18-084d-410d-a96c-d4831829b296'}]},
 //             'type': 'SET',
 //             'uid': '3cf84a84-f1f0-407d-ac99-f41466c480e2'},
 //            {'data': {'expressions': [{'data': {'itemId': 'XXX'},
 //                'type': 'ITEM',
 //                'uid': '518b334b-2c0b-4f75-9ed8-a0ebbcd9dc43'},
 //               {'data': {'expressions': [{'data': {'expressions': [{'data': {'itemId': 'XXX'},
 //                      'type': 'ITEM',
 //                      'uid': 'a7c33398-c0cf-4fd0-baf0-fb3ee09fa492'},
 //                     {'data': {'expressions': [{'data': {'expressions': [{'data': {'itemId': 'XXX'},
 //                            'type': 'ITEM',
 //                            'uid': '5086ad25-0b8e-45a5-801f-abac8f1dc36e'}]},
 //                         'type': 'SET',
 //                         'uid': '0447684d-dbd9-4357-a1ac-674a49257cb9'},
 //                        {'data': {'expressions': [{'data': {'itemId': 'XXX'},
 //                            'type': 'ITEM',
 //                            'uid': '57ae0db4-92ee-4137-8a1a-8f8fb551be66'}]},
 //                         'type': 'SET',
 //                         'uid': '92ec4538-3918-458d-ae29-732a5e3ee797'},
 //                        {'data': {'expressions': [{'data': {'itemId': 'XXX'},
 //                            'type': 'ITEM',
 //                            'uid': 'cec341f0-aae2-4238-b74f-7216c09e511c'}]},
 //                         'type': 'SET',
 //                         'uid': '520e9e3a-7181-4e7d-8f9d-a9813b11c997'}]},
 //                      'type': 'ALTERNATIVE',
 //                      'uid': '0d92e51f-96ac-4420-9939-72aeb4b054c9'}]},
 //                   'type': 'SET',
 //                   'uid': '60fd3e5b-609c-46ff-b9d0-890a0304523d'},
 //                  {'data': {'expressions': [{'data': {'expressions': [{'data': {'expressions': [{'data': {'itemId': 'XXX'},
 //                            'type': 'ITEM',
 //                            'uid': '52ca5311-137d-49c1-89df-6fb8e14b7718'}]},
 //                         'type': 'SET',
 //                         'uid': '187fd08b-41eb-4572-9a89-792588d2c17d'},
 //                        {'data': {'expressions': [{'data': {'itemId': 'XXX'},
 //                            'type': 'ITEM',
 //                            'uid': '55ed48d5-2d21-4e43-94c1-4a37ee46da85'}]},
 //                         'type': 'SET',
 //                         'uid': '62c7a377-d33a-466b-97f4-e83d872e8a36'},
 //                        {'data': {'expressions': [{'data': {'itemId': 'XXX'},
 //                            'type': 'ITEM',
 //                            'uid': '188c886f-7592-434f-b899-775e0e7e38f4'}]},
 //                         'type': 'SET',
 //                         'uid': '12398d8c-e85d-48b4-a910-59206f719e62'}]},
 //                      'type': 'ALTERNATIVE',
 //                      'uid': '233cc49e-b220-4b9c-aacf-8104ef62f0ff'}]},
 //                   'type': 'SET',
 //                   'uid': 'a73e9ba0-c405-4f12-8a8f-d6e7107ca28d'}]},
 //                'type': 'ALTERNATIVE',
 //                'uid': '4fd613fa-1c06-4d53-9944-35dca311a7e4'}]},
 //             'type': 'SET',
 //             'uid': '1e7fefdb-695c-4341-bad1-afd304ce76f1'}]},
 //          'type': 'ALTERNATIVE',
 //          'uid': '03dc394a-6338-4c4c-a191-151de41ae082'}]},
 //       'type': 'SET',
 //       'uid': '1be33b2f-05f1-43fa-9e7f-640070504956'},
 //      {'data': {'expressions': [{'data': {'itemId': 'XXX'},
 //          'type': 'ITEM',
 //          'uid': 'b6428bba-4ab3-445d-881b-50bf4db6ca44'}]},
 //       'type': 'SET',
 //       'uid': '466a306d-8a43-4e37-94c7-19a0a52e1038'}]},
 //    'type': 'ALTERNATIVE',
 //    'uid': '91775a59-624c-4e51-afaa-e5ab1cb26b1b'},
 //   {'data': {'itemId': 'XXX'},
 //    'type': 'ITEM',
 //    'uid': 'ab677537-f373-4501-bca4-0d0d470e0a72'}]},
 // 'type': 'SET',
 //                     'uid': '58bfb964-de1c-485a-852e-b8c81607d5c5'};

 //            let yy = JSON.stringify(y);

 //            let itemId = null;

 //            for (itemId in this.$store.getters['items/activeItems']) {
 //                break;
 //            }

 //            const yyy = yy.replace(/XXX/g, itemId);

 //            return JSON.parse(yyy);
 //        }
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

        // temporary

        // const template = templates.exprSet()

        // const templateItem = templates.exprItem({itemId: itemsIds[0]});

        // templates.addExpression({root: template,
        //                          child: templateItem});

        // const rule = rules.rawCreateRule({type: rules.RULE_TYPE.CUSTOM,
        //                                   name: 'test rule',
        //                                   template: this.x()});//template});

        // this.$store.dispatch("setRule", {ruleId: uuid.v4(),
        //                                  rule: rule});


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
