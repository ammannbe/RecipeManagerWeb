<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <recipe-filter
      :search-term.sync="searchTerm"
      :category.sync="category"
      :fetch-recipes-timeout="fetchRecipesTimeout"
      :categories="categories"
      @input="fetchRecipesDebounced(...$event)"
    />

    <div
      class="d-flex flex-wrap flex-row justify-space-between mb-6"
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'"
      flat
      tile
    >
      <v-card
        v-for="recipe in recipes"
        :key="recipe.id"
        class="mx-auto my-6"
        width="300"
        @click.stop="openRecipe(recipe.id)"
      >
        <recipe-image
          :recipe="recipe"
          :photo="recipe.photos[0] || { url: $config.PLACEHOLDER_IMAGE }"
          conversion="thumbnail"
          height="250"
        />

        <v-card-title>{{ recipe.name }}</v-card-title>
        <v-card-text>
          <v-row align="center" class="mx-0">
            <v-rating
              :value="recipe.stars_average"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>

            <div class="grey--text ml-4">
              {{ recipe.stars_average }} ({{ recipe.ratings_count }})
            </div>
          </v-row>

          <div class="my-4 subtitle-1">
            <v-icon>
              mdi-signal-cellular-{{ recipe.complexity_number + 1 }}
            </v-icon>
            {{ $tc('complexity', [recipe.complexity_number]) }} •
            {{ recipe.category.name || '' }}
          </div>

          <div v-html="md.render(trimInstructions(recipe))"></div>
        </v-card-text>
      </v-card>

      <v-card v-intersect="intersectRecipes"></v-card>
    </div>
  </div>
</template>

<script>
import { Remarkable } from 'remarkable'

export default {
  async asyncData({ $axios, query }) {
    let recipesQueryUrl = '/api/recipes'
    const recipesQuery = new URLSearchParams({ page: 1, limit: 16 })

    const categories = await $axios.$get('/api/categories')
    let category = null
    if (query.category) {
      category = categories.find((c) => c.name === query.category)
      recipesQuery.append('filter[category_id]', category.id)
    }
    if (query.search) {
      recipesQueryUrl = '/api/recipes/search'
      recipesQuery.append('search', query.search)
    }

    let recipes = await $axios.$get(
      recipesQueryUrl + '?' + recipesQuery.toString()
    )

    const lastPage = recipes.last_page

    recipes = recipes.data.map((recipe) => {
      recipe.category = categories.find((c) => c.id === recipe.category_id)
      return recipe
    })

    return { recipes, category, categories, lastPage, searchTerm: query.search }
  },

  data() {
    return {
      page: 1,
      md: new Remarkable(),
      fetchRecipesTimeout: null,
    }
  },

  methods: {
    async intersectRecipes() {
      // We fetch new recipes because v-intersect makes some trouble by a direct call
      await this.fetchRecipes()
    },
    fetchRecipesDebounced(page = null, categoryId = null, append = true) {
      if (this.fetchRecipesTimeout) {
        clearTimeout(this.fetchRecipesTimeout)
        this.fetchRecipesTimeout = null
      }
      this.fetchRecipesTimeout = setTimeout(async () => {
        await this.fetchRecipes(page, categoryId, append)
        clearTimeout(this.fetchRecipesTimeout)
        this.fetchRecipesTimeout = null
      }, 700)
    },
    async fetchRecipes(page = null, categoryId = null, append = true) {
      let recipesQueryUrl = '/api/recipes'

      if (append) {
        page = this.page
        categoryId = this.category ? this.category.id : null
      }

      const oldPage = this.page
      this.page++
      if (page && !append) {
        this.page = page
      }

      if (this.page > this.lastPage) {
        this.page = oldPage
        return false
      }

      const recipesQuery = new URLSearchParams({
        page: this.page,
        limit: 16,
      })

      const routerQuery = {}

      this.category = null
      if (categoryId) {
        this.category = this.categories.find((c) => categoryId === c.id)
        recipesQuery.append('filter[category_id]', this.category.id)
        routerQuery.category = this.category.name
      }

      if (this.searchTerm) {
        recipesQueryUrl = '/api/recipes/search'
        recipesQuery.append('search', this.searchTerm)
        routerQuery.search = this.searchTerm
      } else {
        this.searchTerm = null
      }

      this.$router.push({
        path: this.localePath({ name: 'index' }),
        query: routerQuery,
      })

      let recipes = await this.$axios.$get(
        recipesQueryUrl + '?' + recipesQuery.toString()
      )

      recipes = recipes.data.map((recipe) => {
        recipe.category = this.categories.find((c) => {
          return c.id === recipe.category_id
        })
        return recipe
      })

      if (append) {
        this.recipes.push(...recipes)
      } else {
        this.recipes = recipes
      }
    },
    openRecipe(id) {
      const path = this.localePath({
        name: 'recipes-id',
        params: { id },
      })
      this.$nuxt.$router.push(path)
    },
    trimInstructions(recipe) {
      if (!recipe.instructions) {
        return ''
      }

      if (!recipe.photos.length) {
        return recipe.instructions.substr(0, 500)
      }

      return recipe.instructions.substr(0, 100)
    },
  },
}
</script>

<style lang="scss" scoped>
.search-btn,
.search-card {
  margin-left: calc(((100% - 900px) / 6)) !important;
  margin-right: calc(((100% - 900px) / 6)) !important;
  padding: 0;

  @media only screen and (max-width: 923px) {
    margin-left: calc(((100% - 600px) / 6)) !important;
    margin-right: calc(((100% - 600px) / 6)) !important;
  }

  @media only screen and (max-width: 623px) {
    margin-left: calc(((100% - 300px) / 6)) !important;
    margin-right: calc(((100% - 300px) / 6)) !important;
  }
}
</style>
