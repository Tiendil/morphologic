<template>
<v-row>
  <morphology-group v-for="(_, groupId) in activeGroups"
                    :group-id="groupId"
                    :key="groupId"/>

  <v-col cols="1">
    <v-btn block
           color="primary"
           v-on:click="createGroup">
      Create group
    </v-btn>
  </v-col>
</v-row>
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
    },

    methods: {
        createGroup: function () {
            this.$store.dispatch("createGroup", {"createFirstItem": true});
        },
    }
}
</script>
