<template>
  <v-row v-if="!ingredient.ingredient_id" class="mx-auto">
    <v-col
      cols="4"
      sm="5"
      lg="4"
      class="py-0 pr-8 text-right d-flex align-center"
      :class="{
        'text-decoration-line-through': isDeleted,
        'justify-space-between': editMode,
        'justify-end': !editMode,
      }"
    >
      <v-icon
        v-if="editMode"
        class="handle"
        :class="{ 'cursor-pointer': !isDeleted }"
      >
        mdi-arrow-up-down
      </v-icon>
      <ingredient-amount
        :recipe="recipe"
        :servings="servings"
        :ingredient="ingredient"
      />
    </v-col>
    <v-col cols="8" sm="7" lg="8" class="pa-0 d-flex align-center">
      <ingredient-food
        :ingredient="ingredient"
        :class="{ 'text-decoration-line-through': isDeleted }"
      />
      <div>
        <btn-edit v-if="editMode && !isDeleted" @click="edit = true" />
        <btn-destroy v-if="editMode && !isDeleted" @click="destroy" />
        <btn-restore v-if="editMode && isDeleted" @click="restore" />
      </div>
    </v-col>

    <ingredient-edit
      v-if="editMode && edit"
      :edit.sync="edit"
      :recipe="recipe"
      :ingredient="ingredient"
      :ingredients="ingredients"
      :foods="foods"
      :ingredient-attributes="ingredientAttributes"
      @update:ingredient="updateIngredient"
    />

    <v-snackbar v-model="snackbar" :timeout="5000">
      {{ snackbarMessage }}
      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          {{ $t('Close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>

  <v-row v-else-if="ingredient.ingredient_id">
    <v-col
      cols="6"
      sm="5"
      lg="4"
      class="py-0 pr-8 text-right"
      :class="{ 'text-decoration-line-through': isParentDeleted }"
    >
      <span v-if="isFirst">{{ $t('Or:') }}</span>
    </v-col>
    <v-col cols="6" sm="7" lg="8" class="pa-0 pl-2">
      <ingredient-amount
        :recipe="recipe"
        :servings="servings"
        :ingredient="ingredient"
        class="d-inline"
        :class="{ 'text-decoration-line-through': parentOrSelfIsDeleted }"
      />
      <ingredient-food
        :ingredient="ingredient"
        class="d-inline"
        :class="{ 'text-decoration-line-through': parentOrSelfIsDeleted }"
      />
      <btn-edit
        v-if="editMode && !parentOrSelfIsDeleted"
        @click="edit = true"
      />
      <btn-destroy v-if="editMode && !parentOrSelfIsDeleted" @click="destroy" />
      <btn-restore
        v-if="editMode && isDeleted && !isParentDeleted"
        @click="restore"
      />
    </v-col>

    <ingredient-edit
      v-if="editMode && edit"
      :edit.sync="edit"
      :recipe="recipe"
      :ingredient="ingredient"
      :ingredients="ingredients"
      :foods="foods"
      :ingredient-attributes="ingredientAttributes"
      @update:ingredient="updateIngredient"
    />

    <v-snackbar v-model="snackbar" :timeout="5000">
      {{ snackbarMessage }}
      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          {{ $t('Close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script>
export default {
  props: {
    recipe: { type: Object, required: true },
    servings: { type: Number, required: true },
    ingredient: { type: Object, required: true },
    ingredients: { type: Array, required: true },
    foods: { type: Array, required: true },
    ingredientAttributes: { type: Array, required: true },
    editMode: { type: Boolean, default: false },
    isFirst: { type: Boolean, default: false },
  },

  data() {
    return {
      edit: false,
      snackbar: false,
      snackbarMessage: null,
    }
  },

  computed: {
    isDeleted() {
      return !!this.ingredient.deleted_at
    },
    isParentDeleted() {
      return (
        this.ingredient.ingredient_id &&
        this.ingredient.ingredient &&
        !!this.ingredient.ingredient.deleted_at
      )
    },
    parentOrSelfIsDeleted() {
      return this.isDeleted || this.isParentDeleted
    },
  },

  methods: {
    updateIngredient($event) {
      this.$emit('update:ingredient', $event)
      this.edit = false
    },
    async destroy() {
      try {
        await this.$axios.$delete(`/api/ingredients/${this.ingredient.id}`)
      } catch (error) {
        this.snackbarMessage =
          error.response.data.message || this.$t('An unexpected error occured')
        this.snackbar = true
      }

      this.$emit('update:ingredient', {
        ...this.ingredient,
        deleted_at: new Date(),
      })

      this.edit = false
    },
    async restore() {
      try {
        await this.$axios.$post(
          `/api/ingredients/${this.ingredient.id}/restore`
        )
      } catch (error) {
        this.snackbarMessage =
          error.response.data.message || this.$t('An unexpected error occured')
        this.snackbar = true
      }

      this.$emit('update:ingredient', {
        ...this.ingredient,
        deleted_at: null,
      })
      this.edit = false
    },
  },
}
</script>
