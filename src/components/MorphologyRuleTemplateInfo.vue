<template>

<v-sheet>
  <template v-if="template.items.length > 0">
    <morphology-item-chip v-for="itemId in template.items"
                          :item-id="itemId"
                          :key="itemId"
                          class="mr-1"/>
  </template>

  <span v-else
        class="font-italic">
    no items
  </span>
</v-sheet>

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
