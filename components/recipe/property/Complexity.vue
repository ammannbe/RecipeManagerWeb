<template>
  <v-row>
    <v-col
      :cols="edit ? 12 : 5"
      :sm="edit ? 12 : 4"
      md="3"
      xl="2"
      class="font-weight-bold px-2 py-0 body-1 d-flex align-center"
    >
      {{ $t('Complexity') + ':' }}
    </v-col>
    <v-col v-if="!edit" class="px-2 py-0 body-1">
      <span>
        <v-icon>mdi-signal-cellular-{{ recipe.complexity_number + 1 }}</v-icon>
        {{ $tc('complexity', [recipe.complexity_number]) }}
        <btn-edit v-if="editMode" @click="edit = true" />
      </span>
    </v-col>
    <v-col v-else>
      <v-row>
        <v-col cols="12" sm="7">
          <v-form ref="form" v-model="valid" @submit.prevent="submit">
            <v-select
              v-model="newComplexity"
              :items="complexities"
              item-text="name"
              item-value="id"
              :prepend-icon="
                'mdi-signal-cellular-' + (newComplexityObject.number + 1)
              "
              :error="errors.complexity.length > 0"
              :error-messages="errors.complexity"
              dense
              autofocus
              @change="errors.complexity = []"
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
      newComplexity: this.recipe.complexity,
      errors: {
        complexity: [],
      },
      complexities: [
        { id: 'simple', name: this.$tc('complexity', 0), number: 0 },
        { id: 'normal', name: this.$tc('complexity', 1), number: 1 },
        { id: 'difficult', name: this.$tc('complexity', 2), number: 2 },
      ],
      isLoading: false,
    }
  },
  computed: {
    newComplexityObject() {
      return this.complexities.find((c) => c.id === this.newComplexity)
    },
  },
  watch: {
    edit() {
      this.newComplexity = this.recipe.complexity
    },
  },
  methods: {
    async submit() {
      this.$refs.form.validate()
      if (!this.valid) {
        return false
      }

      const complexity = this.newComplexityObject

      const data = { complexity: complexity.id }

      try {
        await this.$axios.$patch(`/api/recipes/${this.recipe.id}`, data)
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors = { ...this.errors, ...errors }
        return
      }

      this.$emit('update:recipe', {
        ...this.recipe,
        ...data,
        complexity,
        complexity_number: complexity.number,
      })
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
