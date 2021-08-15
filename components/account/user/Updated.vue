<template>
  <v-list-item dense>
    <v-list-item-content
      class="justify-end px-1 py-0 flex-grow-0 flex-shrink-0"
      style="min-width: 100px"
    >
      {{ $t('Last change') + ':' }}
    </v-list-item-content>
    <v-list-item-content
      class="px-1 flex-grow-1 flex-shrink-0"
      style="min-width: 200px"
    >
      <span>
        {{ updatedAt }}
      </span>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  computed: {
    updatedAt() {
      return new Date(this.$auth.user.updated_at).toLocaleString(
        this.$i18n.locale,
        this.$config.LOCALE_FORMAT
      )
    },
  },
}
</script>
