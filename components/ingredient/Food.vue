<template>
  <div>
    <span v-if="ingredient.food_id">
      {{ ingredient.food.name }}
    </span>
    <span
      v-if="attributes"
      class="body-2"
      :class="{
        'd-block': ingredient.ingredient_attributes
          ? ingredient.ingredient_attributes.length > 2
          : false,
      }"
      >({{ attributes }})</span
    >
  </div>
</template>

<script>
export default {
  props: {
    ingredient: { type: Object, required: true },
  },
  computed: {
    attributes() {
      const ingredient = this.ingredient

      if (
        !ingredient.ingredient_attributes ||
        !ingredient.ingredient_attributes.length
      ) {
        return null
      }

      return ingredient.ingredient_attributes
        .map((attribute) => attribute.name)
        .join(', ')
    },
  },
}
</script>

<style></style>
