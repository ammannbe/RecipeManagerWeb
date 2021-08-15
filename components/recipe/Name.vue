<template>
  <div elevation="0">
    <h1 class="d-flex justify-center">
      <span v-if="!edit">
        {{ recipe.name }}
        <btn-edit v-if="editMode" @click="edit = true" />
      </span>

      <v-row v-if="editMode && edit">
        <v-col></v-col>
        <v-col cols="12" sm="6" md="5" lg="4" xl="3">
          <v-form ref="form" v-model="valid" @submit.prevent="submit">
            <v-text-field
              v-model="newName"
              class="recipe-name"
              type="text"
              :rules="rules"
              :error="errors.name.length > 0"
              :error-messages="errors.name"
              autofocus
              dense
              @input="errors.name = []"
            ></v-text-field>
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
    </h1>
  </div>
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
      newName: this.recipe.name,
      rules: [(v) => !!v || this.$t('{0} is required', [this.$t('Name')])],
      errors: {
        name: [],
      },
    }
  },
  watch: {
    edit() {
      this.newName = this.recipe.name
    },
  },
  methods: {
    async submit() {
      this.$refs.form.validate()
      if (!this.valid) {
        return false
      }

      const name = this.newName
      try {
        await this.$axios.$patch(`/api/recipes/${this.recipe.id}`, { name })
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors = { ...this.errors, ...errors }
        return
      }

      this.$emit('update:recipe', { ...this.recipe, name })
      this.newName = null
      this.edit = false
    },
    cancel() {
      this.newName = null
      this.edit = false
    },
  },
}
</script>

<style>
.recipe-name.v-text-field__slot > input {
  text-align: center;
}
</style>
