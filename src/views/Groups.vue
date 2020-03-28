<template>
<v-container>
  <v-row>
    <morphology-group v-for="(_, groupId) in activeGroups"
                      :group-id="groupId"
                      :key="groupId"/>
  </v-row>
</v-container>
</template>

<script>
import MorphologyGroup from '@/components/MorphologyGroup';

export default {
    name: 'Groups',

    components: {
        MorphologyGroup
    },

    computed: {
        activeGroups () {
            return this.$store.getters['groups/activeGroups'];
        }
  }
}
</script>
