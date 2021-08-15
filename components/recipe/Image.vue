<template>
  <div>
    <v-img
      v-if="hasPhoto"
      :src="url"
      :lazy-src="placeholder"
      :height="height"
      contain
    >
      <template v-if="hasPhoto" #placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>

    <btn-destroy
      v-if="editMode"
      :confirm="true"
      absolute
      top
      right
      @click="destroy"
    >
      {{ $t('Do you want to delete this image?') }}
    </btn-destroy>
  </div>
</template>

<script>
export default {
  props: {
    recipe: { type: Object, required: true },
    photo: { type: Object, required: true },
    conversion: { type: String, default: null },
    height: { type: String, default: '' },
    editMode: { type: Boolean, default: false },
  },

  computed: {
    hasPhoto() {
      return this.photo.url || this.placeholder
    },
    url() {
      if (this.conversion && this.photo.conversions[this.conversion]) {
        return `${this.photo.url}?${this.conversion}`
      }

      return this.photo.url || this.placeholder
    },
    placeholder() {
      return this.$config.PLACEHOLDER_IMAGE || null
    },
  },

  methods: {
    async destroy() {
      await this.$axios.$delete(`/api/photos/${this.photo.id}`)
      this.$emit('destroy')
    },
  },
}
</script>
