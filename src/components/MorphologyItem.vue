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
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon x-small v-on="on">
            <v-icon>mdi-state-machine</v-icon>
          </v-btn>
        </template>

        <v-list>

          <v-list-item v-for="mode in itemModes"
                       :key="mode"
                       @click="changeMode(mode)">
            <v-list-item-content>
              <v-list-item-title class="text-capitalize">{{mode}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list>

      </v-menu>
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
import {MODE} from '@/store/modules/items.js';

export default {
    name: 'MorphologyItem',

    data: () => ({
        textEditMode: false
    }),

    props: ["itemId"],

    computed: {
        item () {
            return this.$store.getters['items/activeItems'][this.itemId];
        },

        itemModes () {
            let keys = Object.keys(MODE);
            keys.sort();
            return keys;
        },

        itemTextClasses() {
            if (this.item.mode == MODE.OPTIONAL) {
                return '';
            }

            if (this.item.mode == MODE.REQUIRED) {
                return 'success--text font-weight-medium';
            }

            if (this.item.mode == MODE.EXCLUDED) {
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
        },

        changeMode: function(mode) {
            this.$store.dispatch("changeItemMode", {itemId: this.itemId,
                                                    mode: mode});
        }
    }
}
</script>
