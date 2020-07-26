<template>

  <v-avatar icon left :color="avatar.color" size="28">
    <span class="white--text">{{avatar.uid}}</span>
  </v-avatar>

</template>

<script>
import { Fragment } from 'vue-fragment'


export default {
    name: 'MorphologyGroupAvatar',

    components: {
    },

    data: () => ({}),

    props: ["avatar"],

    computed: {
    },

    methods: {
    }
}
</script>
