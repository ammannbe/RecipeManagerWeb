<template>
  <v-row>
    <v-col
      :cols="edit ? 12 : 5"
      :sm="edit ? 12 : 4"
      md="3"
      xl="2"
      class="font-weight-bold px-2 py-0 body-1 d-flex align-center"
    >
      {{ $t('Preparation time') + ':' }}
    </v-col>
    <v-col v-if="!edit" class="px-2 py-0 body-1">
      <span>
        {{ readablePreparationTime || '-' }}
        <btn-edit v-if="editMode" @click="edit = true" />
      </span>
    </v-col>
    <v-col v-else>
      <v-row>
        <v-col cols="12" sm="7">
          <v-form ref="form" v-model="valid" @submit.prevent="submit">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="newPreparationTime"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="newPreparationTime"
                  prepend-icon="mdi-clock-time-four-outline"
                  :rules="rules.preparation_time"
                  :error="errors.preparation_time.length > 0"
                  :error-messages="errors.preparation_time"
                  clearable
                  autofocus
                  dense
                  v-bind="attrs"
                  v-on="on"
                  @input="errors.preparation_time = []"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menu"
                v-model="newPreparationTime"
                format="24hr"
                scrollable
                @change="errors.preparation_time = []"
                @click:minute="$refs.menu.save(newPreparationTime)"
              ></v-time-picker>
            </v-menu>
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
      newPreparationTime: this.recipe.preparation_time || '00:00',
      rules: {
        preparation_time: [
          (v) =>
            !v ||
            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v) ||
            this.$t('{0} is not a valid time', [this.$t('Preparation time')]),
        ],
      },
      errors: {
        preparation_time: [],
      },
      isLoading: false,
      menu: false,
    }
  },
  computed: {
    readablePreparationTime() {
      let time = this.recipe.preparation_time

      if (!time) {
        return ''
      }

      time = time.split(':')
      let string = ''

      if (+time[0]) {
        string = `${+time[0]}h`
      }

      if (+time[1]) {
        string += ` ${+time[1]}min`
      }

      if (+time[2]) {
        string += ` ${+time[2]}s`
      }

      return string
    },
  },
  watch: {
    edit() {
      this.newPreparationTime = this.recipe.preparation_time || '00:00'
    },
  },
  methods: {
    async submit() {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }

      if (this.newPreparationTime === '00:00') {
        this.newPreparationTime = null
      }
      const data = { preparation_time: this.newPreparationTime }

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
      })
      this.newPreparationTime = null
      this.edit = false
    },
    cancel() {
      this.newPreparationTime = null
      this.edit = false
    },
  },
}
</script>
