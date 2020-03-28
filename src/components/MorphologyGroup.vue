<template>
<v-col cols="3">
  <v-sheet elevation="1">
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

        <v-toolbar-items>

          <v-btn icon v-on:click="turnOnNameEditMode">
            <v-icon>mdi-lead-pencil</v-icon>
          </v-btn>

          <v-btn icon v-on:click="createItem">
            <v-icon>mdi-plus</v-icon>
          </v-btn>

          <v-btn icon v-on:click="remove">
            <v-icon>mdi-delete</v-icon>
          </v-btn>

        </v-toolbar-items>
      </template>

    </v-toolbar>

    <morphology-item v-for="itemId in group.items"
                     :key="itemId"
                     :item-id="itemId"/>

  </v-sheet>

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
            this.$store.commit("groups/removeGroup", {groupId: this.groupId});
        },

        createItem: function () {
            this.$store.dispatch("createItem", {groupId: this.groupId});
        },
    }
}
</script>
