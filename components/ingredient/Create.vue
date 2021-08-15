<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">
          {{ $t('Add ingredient') }}
        </v-card-title>

        <v-divider class="mb-4" />

        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="submit">
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="form.ingredient_id"
                  :items="ingredients"
                  item-text="name"
                  item-value="id"
                  :label="$t('Alternate to...')"
                  :rules="rules.ingredient_id"
                  :error="errors.ingredient_id.length > 0"
                  :error-messages="errors.ingredient_id"
                  auto-select-first
                  clearable
                  dense
                  @change="errors.ingredient_id = []"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.amount"
                  type="number"
                  :min="1"
                  :label="$t('Amount')"
                  :rules="rules.amount"
                  :error="errors.amount.length > 0"
                  :error-messages="errors.amount"
                  autofocus
                  dense
                  @input="
                    errors.amount = []
                    errors.amount_max = []
                  "
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.amount_max"
                  type="number"
                  :min="+form.amount + 1"
                  :label="$t('Amount max')"
                  :rules="rules.amount_max"
                  :error="errors.amount_max.length > 0"
                  :error-messages="errors.amount_max"
                  dense
                  @input="errors.amount_max = []"
                />
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-if="$config.DISABLE_UNIT_CREATION"
                  v-model="form.unit_id"
                  :items="units"
                  item-text="name"
                  item-value="id"
                  :label="$t('Unit')"
                  :rules="rules.unit_id"
                  :error="errors.unit_id.length > 0"
                  :error-messages="errors.unit_id"
                  auto-select-first
                  dense
                  @change="errors.unit_id = []"
                />
                <v-combobox
                  v-else
                  v-model="form.unit"
                  :items="units"
                  item-text="name"
                  item-value="id"
                  :label="$t('Unit')"
                  :rules="rules.unit_id"
                  :error="errors.unit_id.length > 0"
                  :error-messages="errors.unit_id"
                  dense
                  @change="errors.unit_id = []"
                  @input="errors.unit_id = []"
                />
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-if="$config.DISABLE_FOOD_CREATION"
                  v-model="form.food_id"
                  :items="foods"
                  item-text="name"
                  item-value="id"
                  :label="$t('Food')"
                  :rules="rules.food_id"
                  :error="errors.food_id.length > 0"
                  :error-messages="errors.food_id"
                  auto-select-first
                  dense
                  @change="errors.food_id = []"
                />
                <v-combobox
                  v-else
                  v-model="form.food"
                  :items="foods"
                  item-text="name"
                  item-value="id"
                  :label="$t('Food')"
                  :rules="rules.food_id"
                  :error="errors.food_id.length > 0"
                  :error-messages="errors.food_id"
                  dense
                  @change="errors.food_id = []"
                  @input="errors.food_id = []"
                />
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-if="$config.DISABLE_INGREDIENT_ATTRIBUTES_CREATION"
                  v-model="form.ingredient_attributes"
                  :items="ingredientAttributes"
                  item-text="name"
                  item-value="id"
                  :label="$t('Attributes')"
                  :rules="rules.ingredient_attributes"
                  :error="errors.ingredient_attributes.length > 0"
                  :error-messages="errors.ingredient_attributes"
                  clearable
                  multiple
                  chips
                  deletable-chips
                  dense
                  @change="errors.ingredient_attributes = []"
                />
                <v-combobox
                  v-else
                  v-model="form.ingredient_attribute_names"
                  :items="ingredientAttributes"
                  item-text="name"
                  item-value="id"
                  :label="$t('Attributes')"
                  :rules="rules.ingredient_attributes"
                  :error="errors.ingredient_attributes.length > 0"
                  :error-messages="errors.ingredient_attributes"
                  clearable
                  multiple
                  chips
                  deletable-chips
                  dense
                  @change="errors.ingredient_attributes = []"
                />
              </v-col>
              <v-col cols="12">
                <v-combobox
                  v-model="form.ingredient_group"
                  :items="ingredientGroups"
                  item-text="name"
                  item-value="id"
                  :label="$t('Group')"
                  :rules="rules.ingredient_group_id"
                  :error="errors.ingredient_group_id.length > 0"
                  :error-messages="errors.ingredient_group_id"
                  clearable
                  dense
                  @change="errors.ingredient_group_id = []"
                  @input="errors.ingredient_group_id = []"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="cancel">
            {{ $t('Cancel') }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            :disabled="!valid"
            @click.prevent="submit"
          >
            {{ $t('Save') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled="!valid"
            @click.prevent="submit(true)"
          >
            {{ $t('Save and next') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.open" :timeout="snackbar.timeout">
      {{ snackbar.message }}
      <template #action="{ attrs }">
        <v-btn
          :color="snackbar.type"
          text
          v-bind="attrs"
          @click="snackbar.open = false"
        >
          {{ $t('Ok') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  props: {
    recipe: { type: Object, required: true },
    ingredients: { type: Array, required: true },
    units: { type: Array, required: true },
    foods: { type: Array, required: true },
    ingredientAttributes: { type: Array, required: true },
    ingredientGroups: { type: Array, required: true },
    show: { type: Boolean, required: true },
  },

  data() {
    return {
      snackbar: {
        open: false,
        timeout: 5000,
        type: null,
        message: null,
      },
      dialog: this.show,
      valid: false,
      form: {
        ingredient_id: null,
        amount: null,
        amount_max: null,
        unit_id: null,
        unit: null,
        food_id: null,
        food: null,
        ingredient_attributes: [],
        ingredient_attribute_names: [],
        ingredient_group_id: null,
        ingredient_group: null,
      },
      rules: {
        ingredient_id: [],
        amount: [
          (v) =>
            !v ||
            (!isNaN(parseFloat(v)) && !isNaN(v - 0)) ||
            this.$t('{0} must be numeric', [this.$t('Amount')]),
        ],
        amount_max: [
          (v) =>
            !v ||
            (!isNaN(parseFloat(v)) && !isNaN(v - 0)) ||
            this.$t('{0} must be numeric', [this.$t('Amount max')]),
          (v) =>
            !v ||
            v >= this.form.amount ||
            this.$t('{0} must be greater than {1}', [
              this.$t('Amount max'),
              this.form.amount,
            ]),
        ],
        unit_id: [],
        food_id: [(v) => !!v || this.$t('{0} is required', [this.$t('Food')])],
        ingredient_attributes: [
          (v) =>
            !v ||
            v.length <= 5 ||
            this.$t('{0} must be less than or equal 5', [
              this.$t('Ingredient attributes'),
            ]),
        ],
        ingredient_group_id: [],
      },
      errors: {
        ingredient_id: [],
        amount: [],
        amount_max: [],
        unit_id: [],
        food_id: [],
        ingredient_attributes: [],
        ingredient_attribute_names: [],
        ingredient_group_id: [],
      },
    }
  },

  computed: {
    hasAnyError() {
      let hasAnyError = false
      Object.keys(this.errors).forEach((e) => {
        if (e.length) {
          hasAnyError = true
        }
      })
      return hasAnyError
    },
  },

  watch: {
    dialog(v) {
      this.$emit('update:show', v)
    },
  },

  methods: {
    async submit(next = false) {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }

      this.form.ingredient_group_id = await this.createGroup(
        this.form.ingredient_group
      )
      if (this.form.ingredient_group_id === false) {
        return
      }

      if (!this.$config.DISABLE_UNIT_CREATION) {
        this.form.unit_id = await this.createUnit(this.form.unit)
        if (this.form.unit_id === false) {
          return
        }
      }

      if (!this.$config.DISABLE_FOOD_CREATION) {
        this.form.food_id = await this.createFood(this.form.food)
        if (this.form.food_id === false) {
          return
        }
      }

      if (!this.$config.DISABLE_INGREDIENT_ATTRIBUTES_CREATION) {
        this.form.ingredient_attributes = await this.createIngredientAttributes(
          this.form.ingredient_attribute_names
        )
        if (this.form.ingredient_attributes === false) {
          return
        }
      }

      try {
        delete this.form.ingredient_group
        delete this.form.unit
        delete this.form.food
        delete this.form.ingredient_attribute_names

        await this.$axios.$post(
          `/api/recipes/${this.recipe.id}/ingredients`,
          this.form
        )

        this.snackbar.type = 'success'
        this.snackbar.message = this.$t('Successfully created')
        this.snackbar.open = true
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors = { ...this.errors, ...errors }

        if (!this.hasAnyError) {
          this.snackbar.type = 'error'
          this.snackbar.message =
            error.response.data.message ||
            this.$t('An unexpected error occured')
          this.snackbar.open = true
        }
        return
      }

      this.form.ingredient_id = null
      this.form.amount = null
      this.form.amount_max = null
      this.form.unit_id = null
      this.form.unit = null
      this.form.food_id = null
      this.form.food = null
      this.form.ingredient_attributes = []
      this.form.ingredient_group = null
      this.form.ingredient_group_id = null

      Object.keys(this.errors).forEach((_v, i) => (this.errors[i] = []))

      if (next !== true) {
        this.dialog = false
      }

      this.$emit('submit')
    },
    async createGroup(ingredientGroup = null) {
      if (!ingredientGroup) {
        return null
      }

      if (ingredientGroup.id) {
        return ingredientGroup.id
      }

      const name = ingredientGroup.trim()

      const found = this.ingredientGroups.find((g) => g.name === name)
      if (found) {
        return found.id
      }

      try {
        ingredientGroup = await this.$axios.$post(
          `/api/recipes/${this.recipe.id}/ingredient-groups`,
          { name }
        )
        return ingredientGroup.id
      } catch (error) {
        // eslint-disable-next-line camelcase
        const ingredient_group_id = error.response.data.errors.name || null
        this.errors = { ...this.errors, ingredient_group_id }

        if (!this.hasAnyError) {
          this.snackbar.type = 'error'
          this.snackbar.message =
            error.response.data.message ||
            this.$t('An unexpected error occured')
          this.snackbar.open = true
        }

        return false
      }
    },
    async createUnit(unit = null) {
      if (!unit) {
        return null
      }

      if (unit.id) {
        return unit.id
      }

      const name = unit.trim()

      const found = this.units.find((g) => g.name === name)
      if (found) {
        return found.id
      }

      try {
        unit = await this.$axios.$post('/api/units', { name })
        return unit.id
      } catch (error) {
        // eslint-disable-next-line camelcase
        const unit_id = error.response.data.errors.name || null
        this.errors = { ...this.errors, unit_id }

        if (!this.hasAnyError) {
          this.snackbar.type = 'error'
          this.snackbar.message =
            error.response.data.message ||
            this.$t('An unexpected error occured')
          this.snackbar.open = true
        }

        return false
      }
    },
    async createFood(food = null) {
      if (!food) {
        return null
      }

      if (food.id) {
        return food.id
      }

      const name = food.trim()

      const found = this.foods.find((g) => g.name === name)
      if (found) {
        return found.id
      }

      try {
        food = await this.$axios.$post('/api/foods', { name })
        return food.id
      } catch (error) {
        // eslint-disable-next-line camelcase
        const food_id = error.response.data.errors.name || null
        this.errors = { ...this.errors, food_id }

        if (!this.hasAnyError) {
          this.snackbar.type = 'error'
          this.snackbar.message =
            error.response.data.message ||
            this.$t('An unexpected error occured')
          this.snackbar.open = true
        }

        return false
      }
    },
    async createIngredientAttributes(ingredientAttributes = []) {
      if (!ingredientAttributes.length) {
        return null
      }

      const ingredientAttributeIds = ingredientAttributes
        .filter((v) => v.id)
        .map((v) => v.id)

      const toCreate = ingredientAttributes.filter((v) => !v.id)

      toCreate.forEach((name, i) => {
        const found = this.ingredientAttributes.find(
          (g) => g.name === name.trim()
        )
        if (found) {
          delete toCreate[i]
          ingredientAttributeIds.push(found.id)
        }
      })

      try {
        for (let index = 0; index < toCreate.length; index++) {
          const name = toCreate[index]
          const ingredientAttribute = await this.$axios.$post(
            '/api/ingredient-attributes',
            { name }
          )
          ingredientAttributeIds.push(ingredientAttribute.id)
        }

        return ingredientAttributeIds
      } catch (error) {
        // eslint-disable-next-line camelcase
        const ingredient_attributes = error.response.data.errors.name || null
        this.errors = { ...this.errors, ingredient_attributes }

        if (!this.hasAnyError) {
          this.snackbar.type = 'error'
          this.snackbar.message =
            error.response.data.message ||
            this.$t('An unexpected error occured')
          this.snackbar.open = true
        }

        return false
      }
    },
    cancel() {
      this.form.amount = null
      this.form.amount_max = null
      this.form.unit_id = null
      this.form.food_id = null
      this.form.ingredient_attributes = []
      this.form.ingredient_group = null
      this.form.ingredient_group_id = null
      this.dialog = false
      this.$emit('cancel')
    },
  },
}
</script>
