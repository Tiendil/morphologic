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
      <v-list-item-title>{{item.text}}</v-list-item-title>
    </v-list-item-content>

    <v-list-item-content v-else class="font-weight-light">
      <v-list-item-title>Enter description</v-list-item-title>
    </v-list-item-content>

    <v-list-item-action>
      <v-btn icon v-on:click="turnOnTextEditMode">
        <v-icon>mdi-lead-pencil</v-icon>
      </v-btn>
    </v-list-item-action>

    <v-list-item-action>
      <v-btn icon v-on:click="remove">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-list-item-action>
  </template>

</v-list-item>

</template>

<script>
export default {
    name: 'MorphologyItem',

    data: () => ({
        textEditMode: false
    }),

    props: ["itemId"],

    computed: {
        item () {
            return this.$store.getters['items/activeItems'][this.itemId];
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
