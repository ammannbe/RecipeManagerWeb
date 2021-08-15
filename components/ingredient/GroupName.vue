<template>
  <div>
    <h2 v-if="!edit" class="mb-4">
      {{ ingredientGroup.name }}
      <btn-edit v-if="editMode" @click="edit = true" />
      <btn-destroy v-if="editMode" :confirm="confirmDestroy" @click="destroy">
        <template #title>{{ $t('Confirm deletion') }}</template>

        {{ $t('Delete the group and all its ingredients?') }}

        <template #cancel>{{ $t('No!') }}</template>
        <template #ok>{{ $t('Yes') }}</template>
      </btn-destroy>
    </h2>

    <v-row v-else>
      <v-col>
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-text-field
            v-model="newName"
            type="text"
            :rules="rules.name"
            :error="errors.name.length > 0"
            :error-messages="errors.name"
            autofocus
            dense
            @input="errors.name = []"
          />
        </v-form>
      </v-col>
      <v-col>
        <btn-confirm
          v-if="ingredientGroup.name"
          :confirm-disabled="!valid"
          @confirm="submit"
          @decline="cancel"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    ingredientGroup: { type: Object, required: true },
    editMode: { type: Boolean, default: false },
    confirmDestroy: { type: Boolean, default: false },
  },

  data() {
    return {
      valid: false,
      edit: false,
      newName: this.ingredientGroup.name,
      rules: {
        name: [(v) => !!v || this.$t('{0} is required', [this.$t('Name')])],
      },
      errors: {
        name: [],
      },
    }
  },

  methods: {
    async submit() {
      this.$refs.form.validate()
      if (!this.valid) {
        return false
      }

      const data = { name: this.newName }

      try {
        await this.$axios.$patch(
          `/api/ingredient-groups/${this.ingredientGroup.id}`,
          data
        )
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors = { ...this.errors, ...errors }
        return
      }

      this.$emit('update:ingredientGroup', {
        ...this.ingredientGroup,
        ...data,
      })
      this.edit = false
    },
    async destroy() {
      try {
        await this.$axios.$delete(
          `/api/ingredient-groups/${this.ingredientGroup.id}`
        )
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors = { ...this.errors, ...errors }
        return
      }

      this.$emit('destroy')
      this.edit = false
    },
    cancel() {
      this.newName = this.ingredientGroup.name
      this.edit = false
    },
  },
}
</script>

<style></style>
