<template>
  <div>
    <span v-if="amount !== null">{{ amount }}</span>
    <span v-if="amountMax"> - {{ amountMax }} </span>
    <span v-if="unit">{{ unit }}</span>
  </div>
</template>

<script>
export default {
  props: {
    recipe: { type: Object, required: true },
    ingredient: { type: Object, required: true },
    servings: { type: Number, default: 1 },
  },
  computed: {
    hasAny() {
      if (this.amount !== null) {
        return true
      }

      if (this.amountMax) {
        return true
      }

      if (this.unit) {
        return true
      }

      return false
    },
    recipeServings() {
      return this.recipe.servings || 1
    },
    amount() {
      let amount = this.ingredient.amount
      if (amount === null || (!amount && !this.amountMax)) {
        return null
      }

      amount = (amount / this.recipeServings) * this.servings

      return Math.round(amount * 100) / 100
    },
    amountMax() {
      let amountMax = this.ingredient.amount_max
      if (!amountMax) {
        return null
      }

      amountMax = (amountMax / this.recipeServings) * this.servings

      return Math.round(amountMax * 100) / 100
    },
    unit() {
      const ingredient = this.ingredient
      let unit = null

      if (ingredient.unit_id && ingredient.amount > 0) {
        unit = ingredient.unit.name_shortcut || ingredient.unit.name
      } else if (ingredient.unit_id) {
        unit =
          ingredient.unit.name_plural_shortcut ||
          ingredient.unit.name_plural ||
          ingredient.unit.name
      }

      return unit
    },
  },
}
</script>

<style></style>
