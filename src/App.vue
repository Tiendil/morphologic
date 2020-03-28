<template>
<v-app>

  <v-app-bar app color="primary" dark dense flat>
    <h1>Morphology</h1>
  </v-app-bar>

  <v-content>
    <v-container>

      <v-row>

        <v-col cols="1">
          <morphology-main-panel/>
        </v-col>

        <v-col cols="11">
          <router-view/>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</v-app>
</template>

<script>

import MorphologyGroup from '@/components/MorphologyGroup';
import MorphologyMainPanel from '@/components/MorphologyMainPanel';

export default {
    name: 'App',

    components: {
        MorphologyMainPanel,
        MorphologyGroup,
    },

    data: () => ({
    //
  }),
};
</script>
