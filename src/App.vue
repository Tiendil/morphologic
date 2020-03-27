<template>
<v-app>
  <v-app-bar
    app
    color="primary"
    dark
    dense
    flat
    >
    <h1>Morphology</h1>
  </v-app-bar>

  <v-content>
    <v-container>
      <v-row class="text-center">

        <v-col cols="2" >
          2
        </v-col>

        <v-col cols="10" >
          3
          <morphology-group>
          </morphology-group>
          4
        </v-col>

      </v-row>
    </v-container>
  </v-content>
</v-app>
</template>

<script>
import MorphologyGroup from './components/MorphologyGroup';

export default {
  name: 'App',

  components: {
    MorphologyGroup,
  },

  data: () => ({
    //
  }),
};
</script>
