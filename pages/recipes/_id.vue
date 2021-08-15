<template>
  <v-card>
    <v-breadcrumbs :light="!$vuetify.theme.dark" :items="breadcrumbs">
      <template #divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-dialog
      v-if="recipe.photos.length"
      v-model="dialog"
      fullscreen
      width="100vw"
      @keydown="diashowKeyboardRewind"
    >
      <v-toolbar height="64">
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-carousel
        v-model="selectedPhoto"
        hide-delimiters
        height="calc(100vh - 64px)"
        :show-arrows="recipe.photos.length > 1"
      >
        <v-carousel-item v-for="(photo, i) in recipe.photos" :key="i">
          <v-card>
            <recipe-image
              :recipe="recipe"
              :photo="photo"
              conversion="webp"
              height="100vh"
            />
          </v-card>
        </v-carousel-item>
      </v-carousel>
    </v-dialog>

    <v-container>
      <v-row>
        <v-col>
          <recipe-name :recipe.sync="recipe" :edit-mode="editMode" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="0" sm="1"></v-col>
        <v-col cols="12" sm="4">
          <v-card
            class="ma-0 ma-xs-4"
            width="100%"
            elevation="0"
            @click.prevent="dialog = true"
          >
            <v-carousel
              v-if="recipe.photos.length"
              v-model="selectedPhoto"
              height="250"
              hide-delimiters
              :show-arrows="recipe.photos.length > 1"
            >
              <v-carousel-item v-for="(photo, i) in recipe.photos" :key="i">
                <recipe-image
                  :recipe="recipe"
                  :photo="photo"
                  conversion="thumbnail"
                  height="250"
                  :edit-mode="editMode"
                  @destroy="
                    diashowRewind()
                    recipe.photos = recipe.photos.filter(
                      (p) => p.id !== photo.id
                    )
                  "
                />
              </v-carousel-item>
            </v-carousel>

            <v-dialog v-if="editMode" v-model="showPhotoAdd" width="500">
              <template #activator="{ on, attrs }">
                <v-btn
                  icon
                  absolute
                  top
                  right
                  class="mt-4"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-plus-circle</v-icon>
                </v-btn>
              </template>

              <v-card v-if="showPhotoAdd">
                <v-card-title class="headline">
                  {{ $t('Add photos') }}
                </v-card-title>

                <v-divider class="mb-4" />

                <v-card-text>
                  <v-form
                    ref="form"
                    v-model="valid"
                    @submit.prevent="submitAddPhoto"
                  >
                    <v-file-input
                      v-model="newPhotos"
                      :rules="rules.photos"
                      :error="errors.photos.length > 0"
                      :error-messages="errors.photos"
                      :label="$t('Upload images')"
                      prepend-icon="mdi-camera"
                      filled
                      multiple
                      chips
                      accept="image/*"
                    ></v-file-input>
                  </v-form>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="red darken-1" text @click="cancelAddPhoto">
                    {{ $t('Cancel') }}
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    :disabled="!valid"
                    @click.prevent="submitAddPhoto"
                  >
                    {{ $t('Upload') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card>
        </v-col>
        <v-col cols="12" sm="7">
          <div class="my-2 mx-5">
            <recipe-servings-calculator :servings.sync="servings" />
          </div>
          <div class="my-2 mx-5">
            <recipe-property-list :recipe.sync="recipe" :edit-mode="editMode" />
          </div>
        </v-col>
        <v-col cols="0" sm="1"></v-col>
      </v-row>

      <v-row v-if="$auth.loggedIn">
        <ingredient-create
          v-if="createIngredient"
          :show.sync="createIngredient"
          :recipe="recipe"
          :ingredients="ingredients"
          :foods="foods"
          :ingredient-attributes="ingredientAttributes"
          :ingredient-groups="ingredientGroups"
          @submit="ingredientAdded"
        />
      </v-row>

      <v-row>
        <v-col cols="0" sm="1" md="1" lg="0"></v-col>
        <v-col cols="12" sm="5" md="4" lg="4" class="mb-6">
          <ingredient-list
            :recipe="recipe"
            :servings="servings"
            :ingredients.sync="ingredients"
            :ingredient-groups.sync="ingredientGroups"
            :edit-mode="editMode"
          />
        </v-col>
        <v-col cols="12" sm="5" md="6" lg="7">
          <recipe-instructions
            :recipe.sync="recipe"
            :edit-mode="editMode"
          ></recipe-instructions>
        </v-col>
        <v-col cols="0" sm="1" md="1" lg="0"></v-col>
      </v-row>

      <div
        v-if="$auth.loggedIn"
        class="ma-5 d-flex flex-column align-end"
        style="position: fixed; right: 0; bottom: 40px; z-index: 4"
      >
        <v-btn
          class="mb-2"
          :title="$t('Delete recipe')"
          large
          rounded
          color="error"
          @click="destroyRecipe()"
        >
          <v-icon>mdi-delete</v-icon>
          {{ $t('Delete') }}
        </v-btn>
        <v-btn
          class="mb-2"
          :title="$t('Add ingredient')"
          large
          rounded
          @click="createIngredient = true"
        >
          <v-icon>mdi-plus</v-icon>
          {{ $t('Ingredient') }}
        </v-btn>
        <v-btn
          :title="$t('Toggle edit mode')"
          large
          fab
          @click.prevent="toggleEditMode"
        >
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </div>
    </v-container>
  </v-card>
</template>

<script>
export default {
  async asyncData({ $axios, params }) {
    const recipe = await $axios.$get(`/api/recipes/${params.id}`)
    const ingredients = await $axios.$get(
      `/api/recipes/${params.id}/ingredients`
    )
    const ingredientGroups = await $axios.$get(
      `/api/recipes/${params.id}/ingredient-groups`
    )
    const foods = await $axios.$get('/api/foods')
    const ingredientAttributes = await $axios.$get('/api/ingredient-attributes')

    const servings = +recipe.servings || 1

    return {
      recipe,
      ingredients,
      ingredientGroups,
      foods,
      ingredientAttributes,
      servings,
    }
  },

  data() {
    return {
      servings: 1,
      dialog: false,
      selectedPhoto: 0,
      editMode: false,
      createIngredient: false,

      showPhotoAdd: false,
      valid: false,
      edit: false,
      newPhotos: null,
      rules: {
        photos: [(v) => !!v || this.$t('{0} is required', [this.$t('E-Mail')])],
      },
      errors: {
        photos: [],
      },
      isLoading: false,
    }
  },

  computed: {
    breadcrumbs() {
      return [
        {
          text: this.$t('Home'),
          href: this.localePath({ name: 'index' }),
        },
        {
          text: this.recipe.category.name,
          href: this.localePath({
            name: 'index',
            query: { category: this.recipe.category.name },
          }),
        },
        {
          text: this.recipe.name,
          disabled: true,
        },
      ]
    },
  },

  watch: {
    recipe(value) {
      this.servings = +value.servings
    },
    servings(value) {
      if (value <= 0) {
        this.servings = 1
      }
    },
  },

  mounted() {
    let isEditing = this.$route.query.edit
    isEditing = isEditing === 'true' || isEditing === !!Number(isEditing)
    if (isEditing) {
      this.editMode = true
    }
  },

  methods: {
    updateRecipe($event) {
      this.recipe = { ...this.recipe, $event }
    },
    async destroyRecipe() {
      await this.$axios.$delete(`/api/recipes/${this.recipe.id}`)
      this.$router.push({ path: this.localePath({ name: 'index' }) })
    },
    toggleEditMode() {
      if (!this.$auth.loggedIn) {
        this.editMode = false
        return
      }

      this.editMode = !this.editMode
    },
    async ingredientAdded() {
      this.ingredients = await this.$axios.$get(
        `/api/recipes/${this.recipe.id}/ingredients`
      )
      this.ingredientGroups = await this.$axios.$get(
        `/api/recipes/${this.recipe.id}/ingredient-groups`
      )
      this.ingredientAttributes = await this.$axios.$get(
        `/api/ingredient-attributes`
      )
      this.foods = await this.$axios.$get('/api/foods')
    },
    diashowRewind(increment = 1) {
      if (!this.recipe.photos.length) {
        return
      }

      let position = this.selectedPhoto + increment
      if (position < 0) {
        position = this.recipe.photos.length - 1
      }
      this.selectedPhoto = position % this.recipe.photos.length
    },
    diashowKeyboardRewind($event) {
      if ($event.which === 39 || $event.keyCode === 39) {
        return this.diashowRewind()
      }

      if ($event.which === 37 || $event.keyCode === 37) {
        return this.diashowRewind(-1)
      }
    },
    async submitAddPhoto() {
      this.$refs.form.validate()
      if (!this.valid) {
        return false
      }

      try {
        const formData = new FormData()
        this.newPhotos.forEach((file) => formData.append('photos[]', file))
        await this.$axios.$post(
          `/api/recipes/${this.recipe.id}/photos`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        this.recipe = await this.$axios.$get(`/api/recipes/${this.recipe.id}`)
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors = { ...this.errors, ...errors }
        return
      }

      this.newPhotos = null
      this.showPhotoAdd = false
    },
    cancelAddPhoto() {
      this.newPhotos = null
      this.showPhotoAdd = false
    },
  },
}
</script>

<style lang="scss">
.v-menu__content {
  box-shadow: none;
}
</style>

<style lang="scss" scoped>
.ingredients {
  list-style-type: none;
}
</style>
