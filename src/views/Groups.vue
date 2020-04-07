<template>
<v-row>
  <morphology-group v-for="ruleId in groupRulesIds"
                    :rule-id="ruleId"
                    :key="ruleId"/>

  <v-col cols="1">
    <v-btn block
           color="primary"
           v-on:click="createGroupRule">
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
        groupRulesIds () {
            return this.$store.getters['rules/groupRulesIds'];
        }
    },

    methods: {
        createGroupRule: function () {
            this.$store.dispatch("createGroupRule", {"createFirstItem": true});
        },
    }
}
</script>
