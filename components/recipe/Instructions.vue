<!-- eslint-disable vue/no-v-html -->
<template>
  <div elevation="0">
    <h2 class="mb-2">
      {{ $t('Instructions') }}

      <v-tooltip v-if="edit" top>
        <template #activator="{ on, attrs }">
          <v-icon class="ml-1" v-bind="attrs" v-on="on">
            mdi-information-outline
          </v-icon>
        </template>
        <span>
          {{ $t('Use markdown to format the instructions.') }}
        </span>
      </v-tooltip>

      <btn-edit v-if="editMode && !edit" @click="edit = true" />
    </h2>
    <div
      v-if="!edit"
      class="body-1"
      v-html="md.render(recipe.instructions)"
    ></div>
    <div v-if="edit">
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <v-textarea
          v-model="newInstructions"
          :error="errors.instructions.length > 0"
          :error-messages="errors.instructions"
          :rules="rules.instructions"
          rows="8"
          dense
          counter="100000"
          auto-grow
          autofocus
          @input="errors.instructions = []"
        ></v-textarea>
      </v-form>

      <btn-confirm
        :confirm-disabled="!valid"
        @confirm="submit"
        @decline="cancel"
      />
    </div>
  </div>
</template>

<script>
import { Remarkable } from 'remarkable'

export default {
  props: {
    recipe: { type: Object, required: true },
    editMode: { type: Boolean, default: false },
  },
  data() {
    return {
      valid: false,
      edit: false,
      newInstructions: this.recipe.instructions,
      rules: {
        instructions: [
          (v) =>
            v.length <= 10000 || this.$t('Max {0} characters allowed', [10000]),
        ],
      },
      errors: {
        instructions: [],
      },
      isLoading: false,
      md: new Remarkable(),
    }
  },
  watch: {
    edit() {
      this.newInstructions = this.recipe.instructions
    },
  },
  methods: {
    async submit() {
      this.$refs.form.validate()
      if (!this.valid) {
        return false
      }

      const data = { instructions: this.newInstructions }

      try {
        await this.$axios.$patch(`/api/recipes/${this.recipe.id}`, data)
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors = { ...this.errors, ...errors }
        return
      }

      this.$emit('update:recipe', { ...this.recipe, ...data })
      this.newComplexity = null
      this.edit = false
    },
    cancel() {
      this.newComplexity = null
      this.edit = false
    },
  },
}
</script>
