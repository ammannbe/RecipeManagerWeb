<template>
  <v-row>
    <v-col
      :cols="edit ? 12 : 5"
      :sm="edit ? 12 : 4"
      md="3"
      xl="2"
      class="font-weight-bold px-2 py-0 body-1 d-flex align-center"
    >
      {{ $t('Servings') + ':' }}
    </v-col>
    <v-col v-if="!edit" class="px-2 py-0 body-1">
      <span>
        {{ recipe.servings || '-' }}
        {{ recipe.serving_type }}
        <btn-edit v-if="editMode" @click="edit = true" />
      </span>
    </v-col>
    <v-col v-else>
      <v-row>
        <v-col cols="12" sm="7">
          <v-form ref="form" v-model="valid" @submit.prevent="submit">
            <v-slider
              v-model="newServings"
              min="0"
              step="0.5"
              :thumb-label="thumbLabel ? 'always' : true"
              :error="errors.servings.length > 0"
              :error-messages="errors.servings"
              dense
              append-icon="mdi-plus"
              prepend-icon="mdi-minus"
              @click:append="increment(0.5)"
              @click:prepend="increment(-0.5)"
              @change="errors.servings = []"
            ></v-slider>

            <v-text-field
              v-model="newServingType"
              type="text"
              :label="$t('Serving type (e.g. pieces)')"
              :rules="rules.serving_type"
              :error="errors.serving_type.length > 0"
              :error-messages="errors.serving_type"
              clearable
              dense
              @input="errors.serving_type = []"
            ></v-text-field>
          </v-form>
        </v-col>
        <v-col class="d-flex align-center">
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
      newServings: this.recipe.servings,
      newServingType: this.recipe.serving_type,
      rules: {
        serving_type: [
          (v) =>
            !v ||
            v.length <= 20 ||
            this.$t('{0} must be lower or equal to 20', [
              this.$t('Serving type'),
            ]),
        ],
      },
      errors: {
        servings: [],
        serving_type: [],
      },
      cookbooks: [],
      isLoading: false,
      thumbLabel: false,
      thumbLabelTimer: null,
    }
  },
  watch: {
    edit() {
      this.newServings = this.recipe.servings
      this.newServingType = this.recipe.serving_type
    },
  },
  methods: {
    async submit() {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }

      const data = {
        servings: this.newServings,
        serving_type: this.newServingType,
      }

      try {
        await this.$axios.$patch(`/api/recipes/${this.recipe.id}`, data)
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors = { ...this.errors, ...errors }
        return
      }

      this.$emit('update:recipe', { ...this.recipe, ...data })
      this.newServings = null
      this.newServingType = null
      this.edit = false
    },
    cancel() {
      this.newServings = null
      this.newServingType = null
      this.edit = false
    },
    increment(step) {
      this.newServings += step

      this.thumbLabel = true
      clearTimeout(this.thumbLabelTimer)
      this.thumbLabelTimer = setTimeout(() => {
        this.thumbLabel = false
      }, 1000)
    },
  },
}
</script>
