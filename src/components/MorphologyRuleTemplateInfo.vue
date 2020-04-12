<template>

<v-sheet>
  <template v-if="template.items.length > 0">
    <morphology-items-set :items="template.items"
                          class="ml-4 flex-grow-1"/>
  </template>

  <span v-else
        class="font-italic">
    no items
  </span>
</v-sheet>

</template>

<script>

import { Fragment } from 'vue-fragment'

import MorphologyItemsSet from "@/components/MorphologyItemsSet";


export default {
    name: "MorphologyRuleTemplateInfo",

    components: {
        Fragment,
        MorphologyItemsSet
    },

    data: () => ({}),

    props: ["template"],

    computed: {
    },

    methods: {
    }
}
</script>
