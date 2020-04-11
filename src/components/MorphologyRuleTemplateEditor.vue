<template>

<v-select v-model="template.items"
          label="Choose subset of items"
          :items="items"
          :menu-props="{ 'offset-y': true }"
          chips
          multiple
          hide-selected>

  <template v-slot:item="{ item }">
    <morphology-item-chip :item-id="item"/>
  </template>

  <template v-slot:selection="{ item }">
    <morphology-item-chip :item-id="item"
                          :on-close="remove"/>
  </template>

</v-select>

</template>

<script>


import MorphologyItemChip from "@/components/MorphologyItemChip";


export default {
    name: "MorphologyRuleTemplateEditor",

    components: {
        MorphologyItemChip
    },

    data: () => ({}),

    props: ["template"],

    computed: {
        items () {
            const itemsIds = [];

            const rulesIds = this.$store.getters['rules/groupRulesIds'];

            for (let i in rulesIds) {
                const rule = this.$store.getters['rules/ruleById'](rulesIds[i]);

                itemsIds.push({'header': rule.name});

                itemsIds.push(...rule.template.items);
            }

            return itemsIds;
        }
    },

    methods: {
        remove (item) {
            this.template.items.splice(this.template.items.indexOf(item), 1);
        },
    }
}
</script>
