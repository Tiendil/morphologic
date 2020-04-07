<template>

<fragment>
  <morphology-item-chip v-for="itemId in template.items"
                        :item-id="itemId"
                        :key="itemId"/>
</fragment>

</template>

<script>

import { Fragment } from 'vue-fragment'

import MorphologyItemChip from "@/components/MorphologyItemChip";


export default {
    name: "MorphologyRuleTemplateInfo",

    components: {
        Fragment,
        MorphologyItemChip
    },

    data: () => ({}),

    props: ["template"],

    computed: {
    },

    methods: {
    }
}
</script>
