<template>
<v-row>
  <v-col>
    <h2>Main Panel</h2>

    <v-btn block
           color="primary"
           v-on:click="createGroup">
      Create group
    </v-btn>

  </v-col>
</v-row>
</template>

<script>
  export default {
    name: 'MorphologyMainPanel',

    data: () => ({
    }),

    methods: {
        createGroup: function () {
            this.$store.commit("groups/createGroup");
        },
    }

  }
</script>
