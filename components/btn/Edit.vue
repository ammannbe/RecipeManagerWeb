<template>
  <v-btn
    class="mt-n4"
    icon
    :absolute="absolute"
    :top="top"
    :right="right"
    :bottom="bottom"
    :left="left"
    @click.stop="$emit('click', $event)"
  >
    <v-icon>mdi-pencil-circle</v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    absolute: { type: Boolean, default: false },
    top: { type: Boolean, default: false },
    right: { type: Boolean, default: false },
    bottom: { type: Boolean, default: false },
    left: { type: Boolean, default: false },
  },
})
</script>
