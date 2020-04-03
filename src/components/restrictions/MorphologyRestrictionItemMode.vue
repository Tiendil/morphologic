<template>

<v-menu offset-y>
  <template v-slot:activator="{ on }">
    <v-btn icon x-small v-on="on">
      <v-icon>mdi-state-machine</v-icon>
    </v-btn>
  </template>

  <v-list>

    <v-list-item v-for="mode in itemModes"
                 :key="mode.key"
                 @click="changeMode(mode)">
      <v-list-item-content>
        <v-list-item-title class="text-capitalize">{{mode}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

  </v-list>

</v-menu>

</template>

<script>

import * as uuid from 'uuid';

import * as ItemMode from '@/logic/restrictions/ItemMode.js';


export default {
    name: 'MorphologyRestrictionItemMode',

    data: () => ({
    }),

    props: ["itemId", "restrictionId"],

    computed: {

        restriction() {
            return this.$store.getters['restrictions/restrictionById'](this.restrictionId);
        },

        itemModes () {
            return ItemMode.ITEM_MODE.enums;
        },
    },

    methods: {
        changeMode: function(mode) {
            const restriction = new ItemMode.Restriction(this.itemId, mode);

            const restrictionId = this.restrictionId || uuid.v4();

            this.$store.dispatch('setRestriction', {'restrictionId': restrictionId,
                                                    'restriction': restriction});
        }
    }
}
</script>
