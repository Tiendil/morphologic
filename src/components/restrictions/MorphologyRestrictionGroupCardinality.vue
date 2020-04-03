<template>

<v-menu offset-y>
  <template v-slot:activator="{ on }">
    <v-btn text v-on="on">
      {{restriction.minCardinality}} … {{restriction.maxCardinality}}
    </v-btn>
  </template>

  <v-list class="overflow-y-auto"
          style="max-height: 21em;">
    <v-list-item v-for="borders in possibleSolutionCardinalities"
                 :key="borders.min + '-' + borders.max"
                 @click="setCardinality(borders)">
      <v-list-item-title>{{ borders.min }} … {{ borders.max }}</v-list-item-title>
    </v-list-item>
  </v-list>

</v-menu>

</template>

<script>

import * as uuid from 'uuid';

import * as GroupCardinality from '@/logic/restrictions/GroupCardinality.js';


export default {
    name: 'MorphologyRestrictionGroupCardinality',

    data: () => ({
    }),

    props: ["groupId", "restrictionId"],

    computed: {

        restriction() {
            return this.$store.getters['restrictions/restrictionById'](this.restrictionId);
        },

        group () {
            return this.$store.getters['groups/activeGroups'][this.groupId];
        },

        itemModes () {
            return ItemMode.ITEM_MODE.enums;
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
        },
    },

    methods: {
        setCardinality: function (borders) {
            const restriction = new GroupCardinality.Restriction(this.groupId,
                                                                 borders.min,
                                                                 borders.max);

            const restrictionId = this.restrictionId || uuid.v4();

            this.$store.dispatch('setRestriction', {'restrictionId': restrictionId,
                                                    'restriction': restriction});
        }
    }
}
</script>
