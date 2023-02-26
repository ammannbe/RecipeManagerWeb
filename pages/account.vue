<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="12" lg="4">
          <v-card>
            <v-card-title>{{ $t('Details') }}</v-card-title>

            <v-list dense>
              <account-user-name :edit-mode="editMode" />
              <account-user-email :edit-mode="editMode" />
              <account-user-created />
              <account-user-updated />
              <v-list-item dense>
                <v-list-item-content
                  v-if="$auth.user.admin"
                  class="px-1 py-0"
                  style="min-width: 100px"
                >
                  <v-chip color="primary">
                    {{ $t('You are admin') }}
                  </v-chip>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" lg="4">
          <v-card>
            <v-data-table
              dense
              disable-sort
              :headers="[
                {
                  text: $auth.user.admin
                    ? $t('All recipes')
                    : $t('Your recipes'),
                  value: 'name',
                  class: 'text-h6 pa-4',
                },
                { value: 'actions' },
              ]"
              :items="recipes"
              :items-per-page="recipePagination.limit"
              :page="recipePagination.page"
              :server-items-length="recipePagination.total"
              :loading="recipePagination.isLoading"
              :options.sync="recipeOptions"
            >
              <template #top>
                <v-btn icon absolute top right @click="toggleAddRecipe = true">
                  <v-icon>mdi-plus-circle</v-icon>
                  <recipe-add :showDialog="toggleAddRecipe" :cookbooks="cookbooks" :categories="categories" @loading="recipePagination.isLoading = $event" @close="toggleAddRecipe = $event"></recipe-add>
                </v-btn>
              </template>
              <template #item.name="{ item }">
                <span
                  :class="{ 'text-decoration-line-through': !!item.deleted_at }"
                >
                  {{ item.name }}
                </span>
              </template>
              <template #item.actions="{ item }">
                <v-btn v-if="!item.deleted_at" icon>
                  <nuxt-link :to="'recipes/' + item.id">
                    <v-icon
                      small
                      :color="$vuetify.theme.dark ? 'white' : 'black'"
                      >mdi-arrow-right</v-icon
                    >
                  </nuxt-link>
                </v-btn>
                <v-btn v-if="!item.deleted_at" icon>
                  <nuxt-link :to="'recipes/' + item.id + '?edit=true'">
                    <v-icon small>mdi-pencil</v-icon>
                  </nuxt-link>
                </v-btn>
                <v-btn v-if="!item.deleted_at" icon>
                  <v-icon small color="error" @click="destroyRecipe(item)">
                    mdi-delete
                  </v-icon>
                </v-btn>
                <v-btn v-if="!!item.deleted_at" icon>
                  <v-icon small @click="restoreRecipe(item)">
                    mdi-restore
                  </v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" lg="4">
          <v-card>
            <v-data-table
              dense
              disable-sort
              :headers="[
                {
                  text: $auth.user.admin
                    ? $t('All cookbooks')
                    : $t('Your cookbooks'),
                  value: 'name',
                  class: 'text-h6 pa-4',
                },
                { value: 'actions' },
              ]"
              :items="cookbooks"
              :items-per-page="cookbookPagination.limit"
              :page="cookbookPagination.page"
              :server-items-length="cookbookPagination.total"
              :loading="cookbookPagination.isLoading"
              :options.sync="cookbookOptions"
            >
              <template #top>
                <v-btn
                  icon
                  absolute
                  top
                  right
                  @click="toggleAddCookbook = true"
                >
                  <v-icon>mdi-plus-circle</v-icon>
                  <v-dialog v-model="toggleAddCookbook" width="500">
                    <v-card>
                      <v-card-title>{{ $t('Add new cookbook') }}</v-card-title>

                      <v-divider class="mb-4" />

                      <v-card-text>
                        <v-form
                          ref="form"
                          v-model="validAddCookbook"
                          @submit.prevent="addCookbook"
                        >
                          <v-row>
                            <v-col cols="12">
                              <v-text-field
                                v-model="newCookbookName"
                                type="text"
                                :label="$t('Name')"
                                :rules="rules.cookbook.name"
                                :error="errors.cookbook.name.length > 0"
                                :error-messages="errors.cookbook.name"
                                autofocus
                                dense
                                @input="errors.cookbook.name = []"
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12">
                              <v-card-actions>
                                <v-btn
                                  color="red darken-1"
                                  text
                                  @click="toggleAddCookbook = false"
                                >
                                  {{ $t('Cancel') }}
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn
                                  type="submit"
                                  color="blue darken-1"
                                  text
                                  :disabled="!validAddCookbook"
                                  @click.prevent="addCookbook"
                                >
                                  {{ $t('Save') }}
                                </v-btn>
                              </v-card-actions>
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </v-btn>
              </template>
              <template #item.name="{ item }">
                <span
                  v-if="item.id !== cookbookRenaming"
                  :class="{ 'text-decoration-line-through': !!item.deleted_at }"
                >
                  {{ item.name }}
                </span>
                <v-row v-else>
                  <v-col cols="6">
                    <v-form
                      ref="form"
                      v-model="valid"
                      @submit.prevent="renameCookbook"
                    >
                      <v-text-field
                        v-model="newCookbookName"
                        type="text"
                        :rules="rules.cookbook.name"
                        :error="errors.cookbook.name.length > 0"
                        :error-messages="errors.cookbook.name"
                        autofocus
                        dense
                        @input="errors.cookbook.name = []"
                      ></v-text-field>
                    </v-form>
                  </v-col>
                  <v-col>
                    <btn-confirm
                      :confirm-disabled="!valid"
                      @confirm="renameCookbook"
                      @decline="cookbookRenaming = null"
                    />
                  </v-col>
                </v-row>
              </template>
              <template #item.actions="{ item }">
                <v-btn
                  v-if="!item.deleted_at && item.id !== cookbookRenaming"
                  icon
                >
                  <v-icon
                    small
                    color="primary"
                    @click="
                      cookbookRenaming = item.id
                      newCookbookName = item.name
                    "
                  >
                    mdi-pencil
                  </v-icon>
                </v-btn>
                <v-btn
                  v-if="!item.deleted_at && item.id !== cookbookRenaming"
                  icon
                >
                  <v-icon small color="error" @click="destroyCookbook(item)">
                    mdi-delete
                  </v-icon>
                </v-btn>
                <v-btn
                  v-if="!!item.deleted_at && item.id !== cookbookRenaming"
                  icon
                >
                  <v-icon small @click="restoreCookbook(item)">
                    mdi-restore
                  </v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>

      <div
        v-if="$auth.loggedIn"
        class="ma-5 d-flex flex-column align-end edit-button"
      >
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
  </div>
</template>

<script>
export default {
  auth: true,

  async asyncData({ $axios, $auth }) {
    const recipePagination = {
      page: 1,
      limit: 15,
      total: 0,
      isLoading: false,
    }
    const recipeQuery = new URLSearchParams({
      page: recipePagination.page,
      limit: recipePagination.limit,
      trashed: true,
    })
    if (!$auth.user.admin) {
      recipeQuery.append('filter[user_id]', $auth.user.id)
    }
    const recipeResponse = await $axios.$get(`/api/recipes?${recipeQuery}`)
    const recipes = recipeResponse.data
    recipePagination.total = recipeResponse.total

    const cookbookPagination = {
      page: 1,
      limit: 15,
      total: 0,
      isLoading: false,
    }
    const cookbookQuery = new URLSearchParams({
      page: cookbookPagination.page,
      limit: cookbookPagination.limit,
      trashed: true,
    })
    const cookbookResponse = await $axios.$get(
      `/api/cookbooks?${cookbookQuery}`
    )
    const cookbooks = cookbookResponse.data
    cookbookPagination.total = cookbookResponse.total

    const categories = await $axios.$get('/api/categories')

    return {
      recipePagination,
      cookbookPagination,
      recipes,
      cookbooks,
      categories,
    }
  },

  data() {
    return {
      editMode: false,
      recipeOptions: {},
      cookbookOptions: {},
      cookbookRenaming: null,
      newCookbookName: null,
      toggleAddCookbook: false,
      validAddCookbook: true,
      toggleAddRecipe: false,
      rules: {
        cookbook: {
          name: [
            (v) => !!v || this.$t('{0} is required', [this.$t('Name')]),
            (v) =>
              (!!v && v.length <= 20) ||
              this.$t('Max {0} characters allowed', [20]),
          ],
        },
      },
      errors: {
        cookbook: { name: [] },
      },
      valid: true,
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
          text: this.$t('Account'),
          disabled: true,
        },
      ]
    },
  },

  watch: {
    async recipeOptions({ page, itemsPerPage }) {
      const p = this.recipePagination
      if (p.page === page && p.limit === itemsPerPage) {
        return
      }

      if (itemsPerPage === -1) {
        itemsPerPage = p.limit || 15
      }

      await this.loadRecipes({ page, limit: itemsPerPage })
    },
    async cookbookOptions({ page, itemsPerPage }) {
      const p = this.cookbookPagination
      if (p.page === page && p.limit === itemsPerPage) {
        return
      }

      if (itemsPerPage === -1) {
        itemsPerPage = p.limit || 15
      }

      await this.loadCookbooks({ page, limit: itemsPerPage })
    },
  },

  methods: {
    toggleEditMode() {
      if (!this.$auth.loggedIn) {
        this.editMode = false
        return
      }

      this.editMode = !this.editMode
    },
    async loadRecipes({ page, limit }) {
      this.recipePagination.isLoading = true
      const query = new URLSearchParams({ page, limit, trashed: true })
      if (!this.$auth.user.admin) {
        query.append('filter[user_id]', this.$auth.user.id)
      }
      const response = await this.$axios.$get(`/api/recipes?${query}`)
      this.recipes = response.data
      this.recipePagination = {
        ...this.recipePagination,
        ...{
          total: response.total,
          limit: response.limit,
          page: response.page,
          isLoading: false,
        },
      }
    },
    async loadCookbooks({ page, limit }) {
      this.cookbookPagination.isLoading = true
      const query = new URLSearchParams({ page, limit, trashed: true })
      const response = await this.$axios.$get(`/api/cookbooks?${query}`)
      this.cookbooks = response.data
      this.cookbookPagination = {
        ...this.cookbookPagination,
        ...{
          total: response.total,
          limit: response.limit,
          page: response.page,
          isLoading: false,
        },
      }
    },
    async addCookbook() {
      this.cookbookPagination.isLoading = true
      const name = this.newCookbookName
      try {
        const newCookbook = await this.$axios.$post('/api/cookbooks', { name })
        this.cookbooks.push(newCookbook)
        this.toggleAddCookbook = false
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors.cookbook = { ...this.errors.cookbook, ...errors }
      }

      this.cookbookPagination.isLoading = false
    },
    async renameCookbook() {
      this.cookbookPagination.isLoading = true
      const name = this.newCookbookName
      try {
        await this.$axios.$patch(`/api/cookbooks/${this.cookbookRenaming}`, {
          name,
        })
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors.cookbook = { ...this.errors.cookbook, ...errors }
        this.cookbookPagination.isLoading = false
        return
      }

      const i = this.cookbooks.findIndex((c) => c.id === this.cookbookRenaming)
      this.cookbooks[i].name = name
      this.cookbookPagination.isLoading = false
      this.cookbookRenaming = null
    },
    async destroyRecipe(recipe) {
      this.recipePagination.isLoading = true
      await this.$axios.$delete(`/api/recipes/${recipe.id}`)
      const i = this.recipes.findIndex((r) => r.id === recipe.id)
      this.recipes[i].deleted_at = new Date()
      this.recipePagination.isLoading = false
    },
    async restoreRecipe(recipe) {
      this.recipePagination.isLoading = true
      await this.$axios.$post(`/api/recipes/${recipe.id}/restore`)
      const i = this.recipes.findIndex((r) => r.id === recipe.id)
      this.recipes[i].deleted_at = null
      this.recipePagination.isLoading = false
    },
    async destroyCookbook(cookbook) {
      this.cookbookPagination.isLoading = true
      await this.$axios.$delete(`/api/cookbooks/${cookbook.id}`)
      const i = this.cookbooks.findIndex((r) => r.id === cookbook.id)
      const deletedDate = new Date()
      this.cookbooks[i].deleted_at = deletedDate
      this.recipes.forEach((recipe, i) => {
        if (recipe.cookbook_id === cookbook.id) {
          this.recipes[i].deleted_at = deletedDate
        }
      })
      this.cookbookPagination.isLoading = false
    },
    async restoreCookbook(cookbook) {
      this.cookbookPagination.isLoading = true
      await this.$axios.$post(`/api/cookbooks/${cookbook.id}/restore`)
      const i = this.cookbooks.findIndex((r) => r.id === cookbook.id)
      this.cookbooks[i].deleted_at = null
      this.recipes.forEach((recipe, i) => {
        if (recipe.cookbook_id === cookbook.id) {
          this.recipes[i].deleted_at = null
        }
      })
      this.cookbookPagination.isLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.edit-button {
  position: fixed;
  right: 256px;
  bottom: 80px;
  z-index: 4;
}

@media only screen and (max-width: 1263px) {
  .edit-button {
    right: 50px;
  }
}
</style>
