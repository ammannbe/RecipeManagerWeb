<template>
  <v-container>
    <recipe-property-cookbook
      :recipe="recipe"
      :edit-mode="editMode"
      @update:recipe="$emit('update:recipe', $event)"
    />

    <recipe-property-author
      :recipe="recipe"
      :edit-mode="editMode"
      @update:recipe="$emit('update:recipe', $event)"
    />

    <recipe-property-servings
      :recipe="recipe"
      :edit-mode="editMode"
      @update:recipe="$emit('update:recipe', $event)"
    />

    <recipe-property-complexity
      :recipe="recipe"
      :edit-mode="editMode"
      @update:recipe="$emit('update:recipe', $event)"
    />

    <recipe-property-preparation-time
      :recipe="recipe"
      :edit-mode="editMode"
      @update:recipe="$emit('update:recipe', $event)"
    />
  </v-container>
</template>

<script>
export default {
  props: {
    editMode: { type: Boolean, default: false },
    recipe: { type: Object, required: true },
  },
}
</script>
