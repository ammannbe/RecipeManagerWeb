<template>
  <div>
    <v-btn icon elevation="1" :disabled="servings <= 1" @click="increment(-1)">
      <v-icon>mdi-minus</v-icon>
    </v-btn>
    <span class="ma-3">{{ servings }}</span>
    <v-btn icon elevation="1" @click="increment(+1)">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    servings: { type: Number, required: true },
  },
  methods: {
    increment(by = 1) {
      this.$emit('update:servings', this.servings + by)
    },
  },
}
</script>
