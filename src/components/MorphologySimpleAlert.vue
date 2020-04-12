<template>

<v-alert class="mb-0"
         icon="mdi-information-outline"
         :type="type"
         outlined
         style="border: 0 !important;"
         dense>
  <slot/>
</v-alert>

</template>

<script>

export default {
    name: "MorphologySimpleAlert",

    components: {
    },

    data: () => ({}),

    props: ["type"],

    computed: {
    },

    methods: {
    }
}
</script>
