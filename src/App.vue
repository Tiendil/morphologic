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
                <v-btn color="primary" outlined to="/restrictions">
                  Restrictions
                  —
                  {{totalRestrictions}}
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
        totalRestrictions () {
            return Object.keys(this.$store.getters['restrictions/allRestrictions']).length;
        }
    },

    created: function() {
        const group1Id = uuid.v4();
        this.$store.dispatch("createGroup", {"groupId": group1Id, "name": "XYZ", "createFirstItem": false});

        const group2Id = uuid.v4();
        this.$store.dispatch("createGroup", {"groupId": group2Id, "name": "P Q R S", "createFirstItem": false});

        const group3Id = uuid.v4();
        this.$store.dispatch("createGroup", {"groupId": group3Id, "name": "third group", "createFirstItem": false});

        this.$store.dispatch("createItem", {groupId: group1Id, text: "item 1"});
        this.$store.dispatch("createItem", {groupId: group1Id, text: "item 2"});

        this.$store.dispatch("createItem", {groupId: group2Id, text: "item 3"});
        this.$store.dispatch("createItem", {groupId: group2Id, text: "item 4"});

        this.$store.dispatch("createItem", {groupId: group1Id, text: "item 5"});

        this.$store.dispatch("createItem", {groupId: group3Id, text: "item 6"});
        this.$store.dispatch("createItem", {groupId: group3Id, text: "item 7"});
        this.$store.dispatch("createItem", {groupId: group3Id, text: "item 8"});
    }
};
</script>
