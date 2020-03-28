<template>
<v-col cols="3">
  <v-toolbar>

    <template v-if="nameEditMode">
      <v-text-field label="Group name"
                    autofocus
                    dense
                    single-line
                    v-on:blur="turnOffNameEditMode"
                    v-on:change="turnOffNameEditMode"
                    v-model="name"></v-text-field>
    </template>

    <template v-else>
      <v-toolbar-title>
        {{name}}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>

        <v-btn icon v-on:click="turnOnNameEditMode">
          <v-icon>mdi-lead-pencil</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-plus</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-delete</v-icon>
      </v-btn>

    </v-toolbar-items>
    </template>

  </v-toolbar>
</v-col>

</template>

<script>
export default {
    name: 'MorphologyGroup',

    data: () => ({
        name: "XXX 1",
        nameEditMode: false
    }),

    methods: {
        turnOnNameEditMode: function () {
            this.nameEditMode = true;
        },

        turnOffNameEditMode: function () {
            this.nameEditMode = false;
        }
    }
}
</script>
