<template>
  <div>
    <div
      v-for="ingredientGroup in [{ id: null, name: null }, ...ingredientGroups]"
      :key="ingredientGroup.id"
      class="ma-0 mb-6 ma-xs-4"
    >
      <ingredient-group-name
        v-if="ingredientGroup.id"
        :ingredient-group="ingredientGroup"
        :edit-mode="editMode"
        :confirm-destroy="getIngredientsByGroup(ingredientGroup.id).length > 0"
        @update:ingredientGroup="updateGroup"
        @destroy="destroyGroup(ingredientGroup.id)"
      />

      <draggable
        handle=".handle"
        :list="getIngredientsByGroup(ingredientGroup.id)"
        group="ingredients"
        :data-group="ingredientGroup.id"
        @end="dragAndDrop($event)"
      >
        <div
          v-for="ingredient in getIngredientsByGroup(ingredientGroup.id)"
          :key="ingredient.position"
          class="mb-5"
        >
          <ingredient-entry
            :recipe="recipe"
            :servings="servings"
            :ingredient="ingredient"
            :ingredients="ingredients"
            :edit-mode="editMode"
            :foods="foods"
            :ingredient-attributes="ingredientAttributes"
            @update:ingredient="updateIngredient"
          />

          <ingredient-entry
            v-for="(alternate, i) in ingredient.ingredients"
            :key="alternate.id"
            :recipe="recipe"
            :servings="servings"
            :ingredient="{ ...alternate, ingredient }"
            :ingredients="ingredients"
            :edit-mode="editMode"
            :foods="foods"
            :ingredient-attributes="ingredientAttributes"
            :is-first="i === 0"
            @update:ingredient="updateIngredientAlternate"
          />
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },

  props: {
    recipe: { type: Object, required: true },
    servings: { type: Number, required: true },
    ingredients: { type: Array, required: true },
    ingredientGroups: { type: Array, required: true },
    editMode: { type: Boolean, default: false },
  },

  data() {
    return {
      foods: [],
      ingredientAttributes: [],
    }
  },

  async fetch() {
    this.foods = await this.$axios.$get('/api/foods')
    this.ingredientAttributes = await this.$axios.$get(
      '/api/ingredient-attributes'
    )
  },

  methods: {
    getIngredientsByGroup(ingredientGroupId = null) {
      return this.ingredients.filter(
        (ingredient) => ingredient.ingredient_group_id === ingredientGroupId
      )
    },
    async updateIngredient(ingredient) {
      let newIngredient = ingredient
      try {
        newIngredient = await this.$axios.$get(
          `/api/ingredients/${ingredient.id}`
        )
      } catch (err) {}
      const ingredients = this.ingredients.map((i) =>
        i.id === ingredient.id ? newIngredient : i
      )

      this.$emit('update:ingredients', ingredients)
    },
    updateIngredientAlternate(ingredient) {
      const ingredients = this.ingredients

      const index = this.ingredients.findIndex(
        (i) => i.id === ingredient.ingredient_id
      )

      ingredients[index].ingredients = ingredients[index].ingredients.map((i) =>
        i.id === ingredient.id ? ingredient : i
      )

      this.$emit('update:ingredients', ingredients)
    },
    updateGroup(ingredientGroup) {
      const ingredientGroups = this.ingredientGroups.map((i) =>
        i.id === ingredientGroup.id ? ingredientGroup : i
      )
      this.$emit('update:ingredientGroups', ingredientGroups)
    },
    destroyGroup(ingredientGroupId) {
      const ingredientGroups = this.ingredientGroups.filter(
        (i) => i.id !== ingredientGroupId
      )
      this.$emit('update:ingredientGroups', ingredientGroups)
    },
    async dragAndDrop($event) {
      const data = { id: null, name: null }
      const fromId = +$event.from.dataset.group
      const toId = +$event.to.dataset.group

      const from = this.ingredientGroups.find((g) => g.id === fromId) || data
      const to = this.ingredientGroups.find((g) => g.id === toId) || data
      const inSameGroup = from.id === to.id

      if ($event.newIndex === $event.oldIndex && inSameGroup) {
        return
      }

      const fromIngredients = this.getIngredientsByGroup(from.id)
      const fromIngredient = fromIngredients[$event.oldIndex]
      const toIngredients = this.getIngredientsByGroup(to.id)
      const toIngredient = toIngredients[$event.newIndex]

      if (fromIngredient && !!fromIngredient.deleted_at) {
        return
      }

      if (toIngredient && !!toIngredient.deleted_at) {
        return
      }

      const position = toIngredient ? toIngredient.position : null

      await this.$axios.$patch(`/api/ingredients/${fromIngredient.id}`, {
        ingredient_group_id: to.id,
        position,
      })

      const ingredients = await this.$axios.$get(
        `/api/recipes/${fromIngredient.recipe_id}/ingredients`
      )

      this.$emit('update:ingredients', ingredients)
    },
  },
}
</script>
