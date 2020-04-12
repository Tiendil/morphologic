
<template>

<v-card-actions>

  <v-btn v-if="!isHidden"
         @click="hide"
         text>Hide</v-btn>

  <v-btn v-if="isHidden"
         @click="show"
         text>Show</v-btn>

</v-card-actions>

</template>

<script>

export default {
    name: 'MorphologyAdviceActions',

    components: {
    },

    data: () => ({}),

    props: ['advice'],

    computed: {
        isHidden() {
            return this.$store.getters['advices/isAdviceHidden'](this.advice.uid);
        }
    },

    methods: {
        hide: function() {
            this.$store.commit('advices/hideAdvice', {'adviceUid': this.advice.uid});
        },

        show: function() {
            this.$store.commit('advices/showAdvice', {'adviceUid': this.advice.uid});
        },
    }
}
</script>
