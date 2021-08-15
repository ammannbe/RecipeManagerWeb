<template>
  <v-row v-if="!$config.DISABLE_COOKBOOKS">
    <v-col
      :cols="edit ? 12 : 5"
      :sm="edit ? 12 : 4"
      md="3"
      xl="2"
      class="font-weight-bold px-2 py-0 body-1 d-flex align-center"
    >
      {{ $t('Cookbook') + ':' }}
    </v-col>
    <v-col v-if="!edit" class="px-2 py-0 body-1">
      <span>
        {{ recipe.cookbook ? recipe.cookbook.name : $t('Public') }}
        <btn-edit v-if="editMode" @click="edit = true" />
      </span>
    </v-col>
    <v-col v-else>
      <v-row>
        <v-col cols="12" sm="7">
          <v-form ref="form" v-model="valid" @submit.prevent="submit">
            <v-autocomplete
              v-model="newCookbook"
              :items="cookbooks"
              item-text="name"
              item-value="id"
              :clearable="newCookbook !== null"
              :error="errors.cookbook_id.length > 0"
              :error-messages="errors.cookbook_id"
              auto-select-first
              dense
              @change="errors.cookbook_id = []"
            />
          </v-form>
        </v-col>
        <v-col>
          <btn-confirm
            :confirm-disabled="!valid"
            @confirm="submit"
            @decline="cancel"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    recipe: { type: Object, required: true },
    editMode: { type: Boolean, default: false },
  },
  data() {
    return {
      valid: false,
      edit: false,
      newCookbook: this.recipe.cookbook_id,
      errors: {
        cookbook_id: [],
      },
      cookbooks: [],
      isLoading: false,
    }
  },
  async fetch() {
    let cookbooks = { data: [] }
    if (this.$auth.loggedIn) {
      cookbooks = await this.$axios.$get('/api/cookbooks')
    }
    this.cookbooks = [{ name: this.$t('Public'), id: null }, ...cookbooks.data]
  },
  watch: {
    edit() {
      this.newCookbook = this.recipe.cookbook_id
    },
  },
  methods: {
    async submit() {
      this.$refs.form.validate()
      if (!this.valid) {
        return false
      }

      const cookbook = this.cookbooks.find((c) => c.id === this.newCookbook)

      const data = { cookbook_id: cookbook.id }

      try {
        await this.$axios.$patch(`/api/recipes/${this.recipe.id}`, data)
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors = { ...this.errors, ...errors }
        return
      }

      this.$emit('update:recipe', { ...this.recipe, ...data, cookbook })
      this.newCookbook = null
      this.edit = false
    },
    cancel() {
      this.newCookbook = null
      this.edit = false
    },
  },
}
</script>
