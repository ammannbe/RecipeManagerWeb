<template>
  <div class="d-flex">
    <v-btn
      icon
      :disabled="confirmDisabled"
      type="submit"
      @click.stop="$emit('confirm')"
    >
      <v-icon>mdi-check-circle</v-icon>
    </v-btn>
    <v-btn
      icon
      :disabled="declineDisabled"
      color="accent"
      @click.stop="$emit('decline')"
    >
      <v-icon>mdi-close-circle</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    confirmDisabled: { type: Boolean, default: false },
    declineDisabled: { type: Boolean, default: false },
  },
}
</script>
