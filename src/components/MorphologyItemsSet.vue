<template>

<v-sheet>
  <morphology-item-chip v-for="itemId in items"
                        :key="itemId"
                        :item-id="itemId"
                        :color="itemsColors[itemId]"
                        class="mr-1"/>
</v-sheet>

</template>

<script>

import MorphologyItemChip from "@/components/MorphologyItemChip";


export default {
    name: 'MorphologyItemsSet',

    components: {
        MorphologyItemChip
    },

    data: () => ({
    }),

    props: {'items': Array,
            'itemsColors': {'default': function(){return {};}}},

    computed: {
    },

    methods: {
    }
}
</script>
