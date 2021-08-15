<template>
  <v-list-item dense>
    <v-list-item-content
      class="justify-end px-1 py-0 flex-grow-0 flex-shrink-0"
      style="min-width: 100px"
    >
      {{ $t('E-Mail') + ':' }}
    </v-list-item-content>
    <v-list-item-content
      v-if="!edit"
      class="px-1 flex-grow-1 flex-shrink-0"
      style="min-width: 200px"
    >
      <span>
        {{ $auth.user.email }}
        <btn-edit v-if="editMode" @click="edit = true" />
      </span>
    </v-list-item-content>
    <v-list-item-content
      v-else
      class="px-1 flex-grow-1 flex-shrink-0"
      style="min-width: 200px"
    >
      <v-row>
        <v-col cols="12" sm="7" class="py-0">
          <v-form ref="form" v-model="valid" @submit.prevent="submit">
            <v-text-field
              v-model="newEmail"
              :rules="rules.email"
              :error="errors.email.length > 0"
              :error-messages="errors.email"
              clearable
              autofocus
              dense
              v-bind="attrs"
              v-on="on"
              @input="errors.email = []"
            ></v-text-field>
          </v-form>
        </v-col>
        <v-col class="py-0">
          <btn-confirm
            :confirm-disabled="!valid"
            @confirm="submit"
            @decline="cancel"
          />
        </v-col>
      </v-row>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  props: {
    editMode: { type: Boolean, default: false },
  },
  data() {
    return {
      valid: false,
      edit: false,
      newEmail: this.$auth.user.email,
      rules: {
        email: [
          (v) => !!v || this.$t('{0} is required', [this.$t('E-Mail')]),
          (v) =>
            /.+@.+\..+/.test(v) ||
            this.$t('{0} is invalid', [this.$t('E-Mail')]),
        ],
      },
      errors: {
        email: [],
      },
      isLoading: false,
    }
  },
  watch: {
    edit() {
      this.newEmail = this.$auth.user.email
    },
  },
  methods: {
    async submit() {
      this.$refs.form.validate()
      if (!this.valid) {
        return false
      }

      try {
        await this.$axios.$patch('/api/user', { email: this.newEmail })
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors = { ...this.errors, ...errors }
        return
      }

      this.$auth.user.email = this.newEmail
      this.newEmail = null
      this.edit = false
    },
    cancel() {
      this.newEmail = null
      this.edit = false
    },
  },
}
</script>
