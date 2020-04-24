<template>

<v-toolbar flat
           dense
           :color="backgroundColor">

  <morphology-switch :modes="['edit', 'show']"
                     v-model="captionMode">
    <template v-slot:edit>
      <v-text-field autofocus
                    dense
                    single-line
                    :value="caption"
                    v-on:blur="captionMode = 'show'"
                    v-on:change="confirmCaptionChange"/>
    </template>

    <template v-slot:show>

      <slot name="before_title"/>

      <v-toolbar-title v-if="caption">
        {{caption}}
      </v-toolbar-title>

      <v-toolbar-title v-else class="font-weight-light">
        {{emptyFiller}}
      </v-toolbar-title>

      <v-spacer/>

      <slot name="before_edit_button"/>

      <v-btn icon
             v-if="allowEdit"
             v-on:click="captionMode = 'edit'">
        <v-icon>mdi-lead-pencil</v-icon>
      </v-btn>

      <slot name="after_edit_button"/>

    </template>

  </morphology-switch>

</v-toolbar>

</template>

<script>

import MorphologySwitch from "@/components/MorphologySwitch";


export default {
    name: "MorphologyEditableToolbar",

    components: {
        MorphologySwitch
    },

    data: () => ({
        captionMode: "show"
    }),

    props: {"emptyFiller": String,
            "caption": String,
            "changeCaption": Function,
            "allowEdit": {"type": Boolean,
                          "default": true}},

    computed: {
        backgroundColor() {
            if (this.allowEdit) {
                return "light-blue lighten-4";
            }

            return 'grey lighten-4';
        }
    },

    methods: {
        confirmCaptionChange: function (value) {
            if (!this.allowEdit) {
                return;
            }

            this.changeCaption(value)
            this.captionMode = "show";

            this.$gtag.event('change_caption', {event_label: value});
        }
    }
}
</script>
