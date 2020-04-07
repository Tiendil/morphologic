<template>

<fragment>

  <template v-for="mode in modes">

    <slot :name="mode"
          v-if="currentMode == mode"/>

  </template>

</fragment>

</template>

<script>
import { Fragment } from 'vue-fragment'


export default {
    name: 'MorphologySwitch',

    components: {
        Fragment
    },

    data: () => ({}),

    model: {
        prop: 'currentMode',
        event: 'changeCurrentMode'
    },

    props: ["modes", "currentMode"],

    computed: {
    },

    methods: {
    }
}
</script>
