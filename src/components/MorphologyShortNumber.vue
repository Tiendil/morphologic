<template>

<span>
  {{formated.number}}
  <span v-if="formated.exponenta != 0">
    * 10<sup>{{formated.exponenta}}</sup>
  </span>
</span>

</template>

<script>

export default {
    name: "MorphologyShortNumber",

    components: {
    },

    data: () => ({
    }),

    props: ["value", "maxDigits", "precision"],

    computed: {

        formated () {
            const maxExponenta = parseInt(Math.ceil(Math.log10(this.value)));

            if (maxExponenta <= this.maxDigits) {
                return {number: this.value,
                        exponenta: 0};
            }

            const exponenta = maxExponenta - 1;
            const precision = Math.pow(10, this.precision);
            const number = Math.round(this.value / Math.pow(10, exponenta) * precision) / precision;

            return {number: number,
                    exponenta: exponenta};
        }
    },

    methods: {
    }
}
</script>
