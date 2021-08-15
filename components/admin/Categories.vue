<template>
  <div>
    <v-card>
      <v-data-table
        dense
        disable-sort
        :headers="[
          {
            text: $t('Name'),
            value: 'name',
            class: 'text-h6 pa-4',
          },
          {
            text: $t('Slug'),
            value: 'slug',
            class: 'text-h6 pa-4',
          },
          {
            text: $t('Created at'),
            value: 'created_at',
            class: 'text-h6 pa-4',
          },
          {
            text: $t('Updated at'),
            value: 'updated_at',
            class: 'text-h6 pa-4',
          },
          { value: 'actions' },
        ]"
        :items="categories"
        :items-per-page="15"
        :loading="isLoading"
      >
        <template #top>
          <v-btn icon absolute top right @click="isAdding = true">
            <v-icon>mdi-plus-circle</v-icon>
            <v-dialog v-model="isAdding" width="500">
              <v-card>
                <v-card-title>Add new category</v-card-title>

                <v-divider class="mb-4" />

                <v-card-text>
                  <v-form
                    ref="form"
                    v-model="validAdd"
                    @submit.prevent="addCategory"
                  >
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="categoryAdding.name"
                          type="text"
                          :label="$t('Name')"
                          :rules="rules.name"
                          :error="errors.name.length > 0"
                          :error-messages="errors.name"
                          autofocus
                          dense
                          @input="errors.name = []"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12">
                        <v-card-actions>
                          <v-btn
                            color="red darken-1"
                            text
                            @click="isAdding = false"
                          >
                            {{ $t('Cancel') }}
                          </v-btn>
                          <v-spacer></v-spacer>
                          <v-btn
                            type="submit"
                            color="blue darken-1"
                            text
                            :disabled="!validAdd"
                            @click.prevent="addCategory"
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
          <span :class="{ 'text-decoration-line-through': !!item.deleted_at }">
            {{ item.name }}
          </span>
        </template>
        <template #item.slug="{ item }">
          <span :class="{ 'text-decoration-line-through': !!item.deleted_at }">
            {{ item.slug }}
          </span>
        </template>
        <template #item.created_at="{ item }">
          <span
            :class="{ 'text-decoration-line-through': !!item.deleted_at }"
            :title="item.created_at"
          >
            {{ parseDate(item.created_at) }}
          </span>
        </template>
        <template #item.updated_at="{ item }">
          <span
            :class="{ 'text-decoration-line-through': !!item.deleted_at }"
            :title="item.updated_at"
          >
            {{ parseDate(item.updated_at) }}
          </span>
        </template>
        <template #item.actions="{ item }">
          <v-btn v-if="!item.deleted_at" icon>
            <v-icon
              small
              @click="
                isEditing = true
                categoryUpdating = item
              "
            >
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn v-if="!item.deleted_at" icon>
            <v-icon small color="error" @click="destroyCategory(item)">
              mdi-delete
            </v-icon>
          </v-btn>
          <v-btn v-if="!!item.deleted_at" icon>
            <v-icon small @click="restoreCategory(item)">mdi-restore</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <v-dialog v-model="isEditing" width="500">
        <v-card>
          <v-card-title>Edit {{ categoryUpdating.name }}</v-card-title>

          <v-divider class="mb-4" />

          <v-card-text>
            <v-form
              ref="form"
              v-model="validEdit"
              @submit.prevent="updateCategory"
            >
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="categoryUpdating.name"
                    type="text"
                    :label="$t('Full name')"
                    :rules="rules.name"
                    :error="errors.name.length > 0"
                    :error-messages="errors.name"
                    autofocus
                    dense
                    @input="errors.name = []"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-card-actions>
                    <v-btn color="red darken-1" text @click="isEditing = false">
                      {{ $t('Cancel') }}
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      type="submit"
                      color="blue darken-1"
                      text
                      :disabled="!validEdit"
                      @click.prevent="updateCategory"
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
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [],
      isLoading: false,
      isEditing: false,
      isAdding: false,
      categoryUpdating: {},
      categoryAdding: {},
      validAdd: true,
      validEdit: true,
      rules: {
        name: [
          (v) => !!v || this.$t('{0} is required', [this.$t('Name')]),
          (v) =>
            (v && v.length <= 255) ||
            this.$t('Max {0} characters allowed', [50]),
        ],
      },
      errors: {
        name: [],
        email: [],
        admin: [],
      },
    }
  },

  mounted() {
    this.loadCategories()
  },

  methods: {
    parseDate(date) {
      return new Date(date).toLocaleString(
        this.$i18n.locale,
        this.$config.LOCALE_FORMAT
      )
    },
    async loadCategories() {
      this.isLoading = true
      this.categories = await this.$axios.$get('/api/categories')
      this.isLoading = false
    },
    async destroyCategory(category) {
      this.isLoading = true
      await this.$axios.$delete(`/api/categories/${category.id}`)
      const i = this.categories.findIndex((r) => r.id === category.id)
      this.categories[i].deleted_at = new Date()
      this.isLoading = false
    },
    async restoreCategory(category) {
      this.isLoading = true
      await this.$axios.$post(`/api/categories/${category.id}/restore`)
      const i = this.categories.findIndex((r) => r.id === category.id)
      this.categories[i].deleted_at = null
      this.isLoading = false
    },
    async updateCategory() {
      this.isLoading = true
      const payload = {
        name: this.categoryUpdating.name,
        email: this.categoryUpdating.email,
        admin: this.categoryUpdating.admin,
      }
      try {
        await this.$axios.$patch(
          `/api/categories/${this.categoryUpdating.id}`,
          payload
        )
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors = { ...this.errors, ...errors }
        this.isLoading = false
        return
      }

      const i = this.categories.findIndex(
        (c) => c.id === this.categoryUpdating.id
      )
      this.categories[i] = { ...this.categories[i], ...payload }
      this.isLoading = false
      this.categoryUpdating = this.categories[i]
      this.isEditing = false
    },
    async addCategory() {
      this.isLoading = true
      const payload = {
        name: this.categoryAdding.name,
        email: this.categoryAdding.email,
        admin: this.categoryAdding.admin,
      }
      try {
        await this.$axios.$post(`/api/categories`, payload)
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors = { ...this.errors, ...errors }
        this.isLoading = false
        return
      }

      this.isLoading = false
      this.categoryAdding = {}
      this.isAdding = false
      this.loadCategories()
    },
  },
}
</script>
