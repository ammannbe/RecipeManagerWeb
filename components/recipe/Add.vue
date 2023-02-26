<template>
  <v-dialog v-model="showDialog" width="500">
    <v-card>
      <v-card-title>{{ $t('Add new recipe') }}</v-card-title>

      <v-divider class="mb-4" />

      <v-card-text>
        <v-form
          ref="form"
          v-model="validAddRecipe"
          @submit.prevent="addRecipe"
        >
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="newRecipe.cookbook_id"
                :label="$t('Cookbook')"
                :items="[
                  { name: $t('Public'), id: null },
                  ...cookbooks,
                ]"
                item-text="name"
                item-value="id"
                :clearable="newRecipe.cookbook_id !== null"
                :rules="rules.recipe.cookbook_id"
                :error="errors.recipe.cookbook_id.length > 0"
                :error-messages="errors.recipe.cookbook_id"
                auto-select-first
                dense
                @change="errors.recipe.cookbook_id = []"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newRecipe.name"
                type="text"
                :label="$t('Name')"
                :rules="rules.recipe.name"
                :error="errors.recipe.name.length > 0"
                :error-messages="errors.recipe.name"
                autofocus
                dense
                @input="errors.recipe.name = []"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="newRecipe.category_id"
                :label="$t('Category')"
                :items="categories"
                item-text="name"
                item-value="id"
                :clearable="newRecipe.category_id !== null"
                :rules="rules.recipe.category_id"
                :error="errors.recipe.category_id.length > 0"
                :error-messages="errors.recipe.category_id"
                auto-select-first
                dense
                @change="errors.recipe.category_id = []"
              />
            </v-col>

            <v-col cols="12">
              <v-card-actions>
                <v-btn
                  color="red darken-1"
                  text
                  @click="showDialog = false"
                >
                  {{ $t('Cancel') }}
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  type="submit"
                  color="blue darken-1"
                  text
                  :disabled="!validAddRecipe"
                  @click.prevent="addRecipe"
                >
                  {{ $t('Save & Edit') }}
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    cookbooks: { type: Array, required: true, default: [] },
    categories: { type: Array, required: true, default: [] },
    showDialog: { type: Boolean, required: true },
  },

  watch: {
    showDialog(show) {
      if (!show) {
        this.$emit('close');
      }
    }
  },

  data() {
    return {
      validAddRecipe: true,
      newRecipe: {
        cookbook_id: null,
        name: null,
        category_id: null,
      },
      rules: {
        recipe: {
          name: [
            (v) => !!v || this.$t('{0} is required', [this.$t('Name')]),
            (v) =>
              (!!v && v.length <= 100) ||
              this.$t('Max {0} characters allowed', [100]),
          ],
          category_id: [
            (v) => !!v || this.$t('{0} is required', [this.$t('Category')]),
          ],
        },
      },
      errors: {
        recipe: {
          name: [],
          category_id: [],
          cookbook_id: [],
        },
      },
    }
  },

  methods: {
    async addRecipe() {
      this.$emit('loading', true);

      try {
        const newRecipe = await this.$axios.$post('/api/recipes', {
          ...this.newRecipe,
          servings: 4,
          serving_type: null,
          complexity: 'normal',
          instructions: this.$t('Add here some instructions to your recipe'),
        })

        const path = this.localePath({
          name: 'recipes-id',
          params: { id: newRecipe.id },
          query: { edit: true },
        })
        this.$nuxt.$router.push(path)
        this.showDialog = false
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors.recipe = { ...this.errors.recipe, ...errors }
      }

      this.$emit('loading', false);
    },
  },
}
</script>
