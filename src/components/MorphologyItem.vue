<template>

  <div>
    {{name}}
  </div>

</template>

<script>
export default {
    name: 'MorphologyItem',

    data: () => ({
        name: "Yyyy 2",
        nameEditMode: false
    }),

    methods: {
        turnOnNameEditMode: function () {
            this.nameEditMode = true;
        },

        turnOffNameEditMode: function () {
            this.nameEditMode = false;
        }
    }
}
</script>
