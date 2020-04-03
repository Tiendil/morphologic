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

    created: function() {
        const group1Id = uuid.v4();
        this.$store.dispatch("createGroup", {"groupId": group1Id, "name": "XYZ", "createFirstItem": false});

        const group2Id = uuid.v4();
        this.$store.dispatch("createGroup", {"groupId": group2Id, "name": "P Q R S", "createFirstItem": false});

        this.$store.dispatch("createItem", {groupId: group1Id, text: "item 1"});
        this.$store.dispatch("createItem", {groupId: group1Id, text: "item 2"});
        this.$store.dispatch("createItem", {groupId: group2Id, text: "item 3"});
        this.$store.dispatch("createItem", {groupId: group2Id, text: "item 4"});
        this.$store.dispatch("createItem", {groupId: group1Id, text: "item 5"});
    }
};
</script>
