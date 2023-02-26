<template>
  <v-app>
    <v-app-bar :clipped-right="true" fixed app @dblclick="fullscreen">
      <nuxt-link to="/" class="pa-4 ml-n4 d-inline-block">
        <v-img
          src="/favicon.ico"
          :alt="$config.APP_NAME + ' Logo'"
          width="40px"
        />
      </nuxt-link>
      <v-toolbar-title>
        <nuxt-link
          to="/"
          class="pa-4 ml-n4 text-decoration-none d-inline-block"
        >
          {{ $config.APP_NAME }}
        </nuxt-link>
      </v-toolbar-title>
      <v-spacer />
      <v-checkbox
        v-model="darkTheme"
        class="mr-2"
        on-icon="mdi-lightbulb"
        off-icon="mdi-lightbulb-outline"
        hide-details
      ></v-checkbox>
      <v-menu>
        <template #activator="{ on, attrs }">
          <v-btn color="primary" icon v-bind="attrs" v-on="on">
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(locale, i) in $i18n.locales"
            :key="i"
            @click="$i18n.locale = locale"
          >
            <v-list-item-title class="text-uppercase">
              {{ locale }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" width="256" clipped right app>
      <v-list>
        <div v-for="(item, i) in items" :key="i">
          <v-list-item v-if="item.to" :to="item.to" router exact>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-else-if="item.click" @click="item.click">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <recipe-add :showDialog="toggleAddRecipe" :cookbooks="cookbooks" :categories="categories" @close="toggleAddRecipe = false"></recipe-add>

      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-footer class="text-center justify-center" :absolute="true" app>
      <p>
        &copy; 2018 - {{ new Date().getFullYear() }}
        <a href="https://github.com/ammannbe/RecipeManager">
          <v-icon>mdi-github</v-icon>
          <strong>{{ $config.APP_NAME }}</strong>
        </a>
        {{ $t('by') }}
        <a href="https://github.com/ammannbe">Benjamin Ammann</a>.

        <br />

        <i18n path="The source code is licensed under the {0}.">
          <a
            href="https://github.com/ammannbe/RecipeManager/blob/master/LICENSE"
            target="_blank"
            >AGPL v3.0</a
          >
        </i18n>

        <i18n path="The website content is licensed under the {0}.">
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            >CC BY NC SA 4.0</a
          >
        </i18n>
      </p>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  mounted() {
    const cookbookPagination = {
      page: 1,
      limit: 100,
      total: 0,
      isLoading: false,
    }
    const cookbookQuery = new URLSearchParams({
      page: cookbookPagination.page,
      limit: cookbookPagination.limit,
      trashed: true,
    })
    const cookbookResponse = this.$axios.$get(
      `/api/cookbooks?${cookbookQuery}`
    ).then(cookbookResponse => {
      this.cookbooks = cookbookResponse.data
      cookbookPagination.total = cookbookResponse.total
    })

    this.$axios.$get('/api/categories').then(categories => this.categories = categories);
  },

  data() {
    return {
      drawer: false,
      toggleAddRecipe: false,
      cookbooks: [],
      categories: [],
    }
  },

  computed: {
    items() {
      if (this.$auth.loggedIn) {
        return [
          {
            icon: 'mdi-account',
            title: this.$t('Account'),
            to: '/account',
          },
          {
            icon: 'mdi-plus',
            title: this.$t('Add recipe'),
            click: () => this.toggleAddRecipe = true,
          },
          {
            icon: this.$auth.user.admin ? 'mdi-cog' : '',
            title: this.$auth.user.admin ? this.$t('Administration') : '',
            to: this.$auth.user.admin ? '/admin' : '',
          },
          {
            icon: 'mdi-logout',
            title: this.$t('Logout'),
            click: this.logout,
          },
        ]
      }

      return [
        {
          icon: 'mdi-login',
          title: this.$t('Login'),
          to: '/login',
        },
      ]
    },
    darkTheme: {
      get() {
        this.$auth.$storage.syncUniversal(
          'dark-theme',
          this.$vuetify.theme.dark
        )
        return this.$auth.$storage.getUniversal('dark-theme')
      },
      set() {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
        this.$auth.$storage.setUniversal('dark-theme', this.$vuetify.theme.dark)
      },
    },
  },

  methods: {
    async logout() {
      await this.$auth.logout()
      this.$auth.redirect('logout')
      location.reload()
    },
    async addRecipe() {
      await this.$auth.logout()
      this.$auth.redirect('logout')
      location.reload()
    },
    fullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
      } else if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    },
  },
}
</script>
