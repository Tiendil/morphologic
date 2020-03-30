<template>
<v-col cols="3">
  <v-card elevation="1">
    <v-toolbar>

      <template v-if="nameEditMode">
        <v-text-field label="Group name"
                      autofocus
                      dense
                      single-line
                      :value="group.name"
                      v-on:blur="turnOffNameEditMode"
                      v-on:change="confirmNameChange"/>
      </template>

      <template v-else>
        <v-toolbar-title v-if="group.name">
          {{group.name}}
        </v-toolbar-title>

        <v-toolbar-title v-else class="font-weight-light">
          Enter name
        </v-toolbar-title>

        <v-spacer/>

        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on">
              {{group.solutionCardinality.min}} … {{group.solutionCardinality.max}}
            </v-btn>
          </template>

          <v-list class="overflow-y-auto"
                  style="max-height: 21em;">
            <v-list-item v-for="borders in possibleSolutionCardinalities"
                         :key="borders.min + '-' + borders.max"
                         @click="setSolutionCardinality(borders)">
              <v-list-item-title>{{ borders.min }} … {{ borders.max }}</v-list-item-title>
            </v-list-item>
          </v-list>

        </v-menu>

        <v-btn icon v-on:click="turnOnNameEditMode">
          <v-icon>mdi-lead-pencil</v-icon>
        </v-btn>

        <v-btn icon v-on:click="remove">
          <v-icon>mdi-delete</v-icon>
        </v-btn>

      </template>

    </v-toolbar>

    <morphology-item v-for="itemId in group.items"
                     :key="itemId"
                     :item-id="itemId"/>

    <v-card-actions>
      <v-btn block
             small
             color="primary"
             v-on:click="createItem">Add item</v-btn>
    </v-card-actions>

  </v-card>

</v-col>

</template>

<script>
import MorphologyItem from "@/components/MorphologyItem";

export default {
    name: "MorphologyGroup",

    components: {
        MorphologyItem
    },

    data: () => ({
        nameEditMode: false
    }),

    props: ["groupId"],

    computed: {
        group () {
            return this.$store.getters['groups/activeGroups'][this.groupId];
        },

        possibleSolutionCardinalities() {
            const minCardinality = 0;
            const maxCardinality = this.group.items.length;

            const cardinalities = [];

            for (let i=minCardinality; i <= maxCardinality; i++) {
                for (let j=i; j <= maxCardinality; j++) {
                    cardinalities.push({'min': i, 'max': j});
                }
            }

            return cardinalities;
        }
    },

    methods: {
        turnOnNameEditMode: function () {
            this.nameEditMode = true;
        },

        turnOffNameEditMode: function () {
            this.nameEditMode = false;
        },

        confirmNameChange: function (value) {
            this.$store.commit("groups/changeGroupName", {groupId: this.groupId,
                                                          name: value});

            this.turnOffNameEditMode();
        },

        remove: function() {
            this.$store.dispatch("removeGroup", {groupId: this.groupId});
        },

        createItem: function () {
            this.$store.dispatch("createItem", {groupId: this.groupId});
        },

        setSolutionCardinality: function (borders) {
            this.$store.dispatch("setSolutionCardinality", {groupId: this.groupId,
                                                            solutionCardinality: borders});
        },
    }
}
</script>
