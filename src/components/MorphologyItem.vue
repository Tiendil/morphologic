<template>

<v-list-item>

  <template v-if="textEditMode">
    <v-list-item-content>
      <v-text-field label="item text"
                    autofocus
                    dense
                    single-line
                    :value="item.text"
                    v-on:blur="turnOffTextEditMode"
                    v-on:change="confirmTextChange"/>
    </v-list-item-content>
  </template>

  <template v-else>
    <v-list-item-content v-if="item.text">
      <v-list-item-title :class="itemTextClasses">{{item.text}}</v-list-item-title>
    </v-list-item-content>

    <v-list-item-content v-else class="font-weight-light">
      <v-list-item-title>Enter description</v-list-item-title>
    </v-list-item-content>

    <v-list-item-action>
      <morphology-restriction-item-mode :item-id="itemId"
                                        :restriction-id="itemModeRestrictionId"/>
    </v-list-item-action>

    <v-list-item-action>
      <v-btn icon x-small v-on:click="turnOnTextEditMode">
        <v-icon>mdi-lead-pencil</v-icon>
      </v-btn>
    </v-list-item-action>

    <v-list-item-action class="ml-0">
      <v-btn icon x-small v-on:click="remove">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-list-item-action>
  </template>

</v-list-item>

</template>

<script>

import * as ItemMode from '@/logic/restrictions/ItemMode.js';

import MorphologyRestrictionItemMode from "@/components/restrictions/MorphologyRestrictionItemMode";


export default {
    name: 'MorphologyItem',

    components: {
        MorphologyRestrictionItemMode
    },

    data: () => ({
        textEditMode: false
    }),

    props: ["itemId"],

    computed: {
        item () {
            return this.$store.getters['items/activeItems'][this.itemId];
        },

        itemModeRestrictionId() {
            return this.$store.getters['restrictions/restrictionIdForItem'](ItemMode.TYPE,
                                                                            this.itemId);
        },

        itemTextClasses() {
            if (this.itemModeRestrictionId == null) {
                return '';
            }

            const restriction = this.$store.getters['restrictions/restrictionById'](this.itemModeRestrictionId);

            if (ItemMode.ITEM_MODE.OPTIONAL.is(restriction.mode)) {
                return '';
            }

            if (ItemMode.ITEM_MODE.REQUIRED.is(restriction.mode)) {
                return 'success--text font-weight-medium';
            }

            if (ItemMode.ITEM_MODE.EXCLUDED.is(restriction.mode)) {
                return 'warning--text font-weight-medium';
            }
        }
    },

    methods: {
        turnOnTextEditMode: function () {
            this.textEditMode = true;
        },

        turnOffTextEditMode: function () {
            this.textEditMode = false;
        },

        confirmTextChange: function (value) {
            this.$store.commit("items/changeItemText", {itemId: this.itemId,
                                                        text: value});
            this.turnOffTextEditMode();
        },

        remove: function() {
            this.$store.dispatch("removeItem", {itemId: this.itemId});
        }
    }
}
</script>
