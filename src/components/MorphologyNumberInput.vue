<template>

  <v-text-field dense
                type="number"
                :value="value"
                @change="onChange"
                class="flex-grow-0"
                :label="label"
                :placeholder="placeholder"/>

</template>

<script>

export default {
    name: "MorphologyNumberInput",

    components: {
    },

    data: function () {
        return {};
    },

    props: ['label', 'placeholder', 'value'],

    computed: {
    },

    methods: {
        onChange (value) {
            this.$emit('input', parseInt(value));
        }
    }
}
</script>

<style scoped>

  >>>input{
  width: 3em;
  }
</style>
