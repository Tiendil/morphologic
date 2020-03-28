<template>
<v-container>
  <v-row>
    <v-col cols="12">
      <h2>Work place</h2>
    </v-col>
  </v-row>

  <v-row>
    <morphology-group></morphology-group>
  </v-row>
</v-container>
</template>

<script>
import MorphologyGroup from '@/components/MorphologyGroup';

export default {
  name: 'Groups',
  components: {
    MorphologyGroup
  }
}
</script>
