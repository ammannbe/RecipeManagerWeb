<template>
  <v-list-item dense>
    <v-list-item-content
      class="justify-end px-1 py-0 flex-grow-0 flex-shrink-0"
      style="min-width: 100px"
    >
      {{ $t('Name') + ':' }}
    </v-list-item-content>
    <v-list-item-content
      v-if="!edit"
      class="px-1 flex-grow-1 flex-shrink-0"
      style="min-width: 200px"
    >
      <span>
        {{ $auth.user.name }}
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
              v-model="newName"
              :rules="rules.name"
              :error="errors.name.length > 0"
              :error-messages="errors.name"
              clearable
              autofocus
              dense
              v-bind="attrs"
              v-on="on"
              @input="errors.name = []"
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
      newName: this.$auth.user.name,
      rules: {
        name: [(v) => !!v || this.$t('{0} is required', [this.$t('Name')])],
      },
      errors: {
        name: [],
      },
      isLoading: false,
    }
  },
  watch: {
    edit() {
      this.newName = this.$auth.user.name
    },
  },
  methods: {
    async submit() {
      this.$refs.form.validate()
      if (!this.valid) {
        return false
      }

      try {
        await this.$axios.$patch('/api/user', { name: this.newName })
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors = { ...this.errors, ...errors }
        return
      }

      this.$auth.user.name = this.newName
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
