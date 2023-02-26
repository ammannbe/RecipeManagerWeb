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
        :items="ingredientAttributes"
        :items-per-page="15"
        :loading="isLoading"
      >
        <template #top>
          <v-btn icon absolute top right @click="isAdding = true">
            <v-icon>mdi-plus-circle</v-icon>
            <v-dialog v-model="isAdding" width="500">
              <v-card>
                <v-card-title>Add new ingredientAttribute</v-card-title>

                <v-divider class="mb-4" />

                <v-card-text>
                  <v-form
                    ref="form"
                    v-model="validAdd"
                    @submit.prevent="addIngredientAttribute"
                  >
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="ingredientAttributeAdding.name"
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
                            @click.prevent="addIngredientAttribute"
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
                ingredientAttributeUpdating = item
              "
            >
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn v-if="!item.deleted_at" icon>
            <v-icon small color="error" :disabled="!item.can_delete" @click="destroyIngredientAttribute(item)">
              mdi-delete
            </v-icon>
          </v-btn>
          <v-btn v-if="!!item.deleted_at" icon>
            <v-icon small @click="restoreIngredientAttribute(item)">mdi-restore</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <v-dialog v-model="isEditing" width="500">
        <v-card>
          <v-card-title>Edit {{ ingredientAttributeUpdating.name }}</v-card-title>

          <v-divider class="mb-4" />

          <v-card-text>
            <v-form ref="form" v-model="validEdit" @submit.prevent="updateIngredientAttribute">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="ingredientAttributeUpdating.name"
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
                    <v-btn color="red darken-1" text @click="isEditing = false">
                      {{ $t('Cancel') }}
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      type="submit"
                      color="blue darken-1"
                      text
                      :disabled="!validEdit"
                      @click.prevent="updateIngredientAttribute"
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
      ingredientAttributes: [],
      isLoading: false,
      isEditing: false,
      isAdding: false,
      ingredientAttributeUpdating: {},
      ingredientAttributeAdding: {},
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
    this.loadIngredientAttributes()
  },

  methods: {
    parseDate(date) {
      return new Date(date).toLocaleString(
        this.$i18n.locale,
        this.$config.LOCALE_FORMAT
      )
    },
    async loadIngredientAttributes() {
      this.isLoading = true
      this.ingredientAttributes = await this.$axios.$get('/api/ingredient-attributes')
      this.isLoading = false
    },
    async destroyIngredientAttribute(ingredientAttribute) {
      this.isLoading = true
      await this.$axios.$delete(`/api/ingredient-attributes/${ingredientAttribute.id}`)
      const i = this.ingredientAttributes.findIndex((r) => r.id === ingredientAttribute.id)
      this.ingredientAttributes[i].deleted_at = new Date()
      this.isLoading = false
    },
    async restoreIngredientAttribute(ingredientAttribute) {
      this.isLoading = true
      await this.$axios.$post(`/api/ingredient-attributes/${ingredientAttribute.id}/restore`)
      const i = this.ingredientAttributes.findIndex((r) => r.id === ingredientAttribute.id)
      this.ingredientAttributes[i].deleted_at = null
      this.isLoading = false
    },
    async updateIngredientAttribute() {
      this.isLoading = true
      const payload = {
        name: this.ingredientAttributeUpdating.name,
        email: this.ingredientAttributeUpdating.email,
        admin: this.ingredientAttributeUpdating.admin,
      }
      try {
        await this.$axios.$patch(`/api/ingredient-attributes/${this.ingredientAttributeUpdating.id}`, payload)
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors = { ...this.errors, ...errors }
        this.isLoading = false
        return
      }

      const i = this.ingredientAttributes.findIndex((c) => c.id === this.ingredientAttributeUpdating.id)
      this.ingredientAttributes[i] = { ...this.ingredientAttributes[i], ...payload }
      this.isLoading = false
      this.ingredientAttributeUpdating = this.ingredientAttributes[i]
      this.isEditing = false
    },
    async addIngredientAttribute() {
      this.isLoading = true
      const payload = {
        name: this.ingredientAttributeAdding.name,
        email: this.ingredientAttributeAdding.email,
        admin: this.ingredientAttributeAdding.admin,
      }
      try {
        await this.$axios.$post(`/api/ingredient-attributes`, payload)
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors = { ...this.errors, ...errors }
        this.isLoading = false
        return
      }

      this.isLoading = false
      this.ingredientAttributeAdding = {}
      this.isAdding = false
      this.loadIngredientAttributes()
    },
  },
}
</script>
