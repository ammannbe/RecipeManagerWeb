<template>
  <v-list-item dense>
    <v-list-item-content
      class="justify-end px-1 py-0 flex-grow-0 flex-shrink-0"
      style="min-width: 100px"
    >
      {{ $t('Signed up') + ':' }}
    </v-list-item-content>
    <v-list-item-content
      class="px-1 flex-grow-1 flex-shrink-0"
      style="min-width: 200px"
    >
      <span>
        {{ createdAt }}
      </span>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  computed: {
    createdAt() {
      return new Date(this.$auth.user.created_at).toLocaleString(
        this.$i18n.locale,
        this.$config.LOCALE_FORMAT
      )
    },
  },
}
</script>
