<template>

<v-menu offset-y
        offset-x
        max-height="400px">

  <template v-slot:activator="{ on }">
    <v-btn icon outlined x-small :color="plusColor" v-on="on">
      <v-icon>{{icon}}</v-icon>
    </v-btn>
  </template>

  <v-list subheader>
    <template v-for="group in groups">
      <v-subheader>{{group.name}}</v-subheader>

      <v-list-item v-for="itemId in group.items"
                   :key="itemId"
                   @click="onSelect(itemId, onSelectArguments)">
        <morphology-item-chip :item-id="itemId"/>
      </v-list-item>
    </template>
  </v-list>

</v-menu>

</template>

<script>

import * as templates from '@/logic/templates.js';

import MorphologyItemChip from "@/components/MorphologyItemChip";


export default {
    name: "MorphologyItemSelector",

    components: {
        MorphologyItemChip
    },

    data: () => ({}),

    props: ['onSelect', 'plusColor', 'onSelectArguments', 'icon'],

    computed: {
        groups () {
            const groups = [];

            const rulesIds = this.$store.getters['rules/groupRulesIds'];

            for (let i in rulesIds) {
                const rule = this.$store.getters['rules/ruleById'](rulesIds[i]);

                const group = {'name': rule.name,
                               'items': templates.getItems({expression: rule.template})};

                groups.push(group);
            }

            return groups;
        }
    }
}
</script>
