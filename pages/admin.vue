<template>
  <div>
    <v-container>
      <v-toolbar flat>
        <v-tabs v-model="selectedTab" grow align-with-title>
          <v-tab v-for="(tab, key) in tabs" :key="key">
            {{ tab.name }}
          </v-tab>
        </v-tabs>
      </v-toolbar>

      <v-tabs-items v-model="selectedTab">
        <v-tab-item v-for="(tab, key) in tabs" :key="key">
          <nuxt-dynamic :name="tab.component" />
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>

<script>
export default {
  auth: true,

  asyncData({ $auth, redirect }) {
    if (!$auth.user.admin) {
      redirect('/')
    }
  },

  data() {
    return {
      selectedTab: null,
      tabs: [
        { name: this.$t('Users'), component: 'admin-users' },
        { name: this.$t('Categories'), component: 'admin-categories' },
        { name: this.$t('Units'), component: 'admin-units' },
        {
          name: this.$t('Ingredient attributes'),
          component: 'admin-ingredient-attributes',
        },
        { name: this.$t('Foods'), component: 'admin-foods' },
      ],
    }
  },

  computed: {
    breadcrumbs() {
      return [
        {
          text: this.$t('Home'),
          href: this.localePath({ name: 'index' }),
        },
        {
          text: this.$t('Administration'),
          disabled: true,
        },
      ]
    },
  },

  watch: {},

  methods: {},
}
</script>
