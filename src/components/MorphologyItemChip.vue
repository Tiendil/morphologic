<template>

<v-chip :close="canBeClosed"
        :color="color"
        @click:close="onCloseEvent(itemId)">
  <morphology-rule-avatar :avatar="avatar"/>
  {{ item.text }}
</v-chip>

</template>

<script>


import * as avatars from "@/logic/avatars";
import MorphologyRuleAvatar from "@/components/MorphologyRuleAvatar";


export default {
    name: 'MorphologyItemChip',

    components: {
        MorphologyRuleAvatar
    },

    data: () => ({
    }),

    props: ["itemId", "onClose", "color"],

    computed: {

        canBeClosed() {
            return !!this.onClose;
        },

        item () {
            return this.$store.getters['items/activeItems'][this.itemId];
        },

        avatar () {
            const ruleId = this.$store.getters['rules/groupRuleIdForItem'](this.itemId);
            const rule = this.$store.getters['rules/ruleById'](ruleId);

            return avatars.constructAvatar(rule.avatarIndex);
        }
    },

    methods: {
        onCloseEvent(itemId) {
            if (this.canBeClosed) {
                this.onClose(itemId);
            }
        }
    }
}
</script>
