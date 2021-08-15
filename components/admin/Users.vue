<template>
  <div>
    <v-card>
      <v-data-table
        dense
        disable-sort
        :headers="[
          {
            text: $t('Name'),
            value: 'name',
            class: 'text-h6 pa-4',
          },
          {
            text: $t('E-Mail'),
            value: 'email',
            class: 'text-h6 pa-4',
          },
          {
            text: $t('Created at'),
            value: 'created_at',
            class: 'text-h6 pa-4',
          },
          {
            text: $t('Updated at'),
            value: 'updated_at',
            class: 'text-h6 pa-4',
          },
          {
            value: 'admin',
            class: 'text-h6 pa-4',
          },
          { value: 'actions' },
        ]"
        :items="users"
        :items-per-page="userPagination.limit"
        :page="userPagination.page"
        :server-items-length="userPagination.total"
        :loading="userPagination.isLoading"
        :options.sync="userOptions"
      >
        <template #top>
          <v-btn icon absolute top right @click="isAdding = true">
            <v-icon>mdi-plus-circle</v-icon>
            <v-dialog v-model="isAdding" width="500">
              <v-card>
                <v-card-title>Add new user</v-card-title>

                <v-divider class="mb-4" />

                <v-card-text>
                  <v-form
                    ref="form"
                    v-model="validAdd"
                    @submit.prevent="addUser"
                  >
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="userAdding.name"
                          type="text"
                          :label="$t('Full name')"
                          :rules="rules.name"
                          :error="errors.name.length > 0"
                          :error-messages="errors.name"
                          autofocus
                          dense
                          @input="errors.name = []"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12">
                        <v-text-field
                          v-model="userAdding.email"
                          type="email"
                          :label="$t('E-Mail')"
                          :rules="rules.email"
                          :error="errors.email.length > 0"
                          :error-messages="errors.email"
                          dense
                          @input="errors.email = []"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12">
                        <v-switch
                          v-model="userAdding.admin"
                          :label="$t('Is admin')"
                          :rules="rules.admin"
                          :error="errors.admin.length > 0"
                          :error-messages="errors.admin"
                          @input="errors.admin = []"
                        ></v-switch>
                      </v-col>

                      <v-col cols="12">
                        <v-card-actions>
                          <v-btn
                            color="red darken-1"
                            text
                            @click="isAdding = false"
                          >
                            {{ $t('Cancel') }}
                          </v-btn>
                          <v-spacer></v-spacer>
                          <v-btn
                            type="submit"
                            color="blue darken-1"
                            text
                            :disabled="!validAdd"
                            @click.prevent="addUser"
                          >
                            {{ $t('Save') }}
                          </v-btn>
                        </v-card-actions>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-btn>
        </template>
        <template #item.name="{ item }">
          <span :class="{ 'text-decoration-line-through': !!item.deleted_at }">
            {{ item.name }}
          </span>
        </template>
        <template #item.email="{ item }">
          <span :class="{ 'text-decoration-line-through': !!item.deleted_at }">
            {{ item.email }}
          </span>
        </template>
        <template #item.created_at="{ item }">
          <span
            :class="{ 'text-decoration-line-through': !!item.deleted_at }"
            :title="item.created_at"
          >
            {{ parseDate(item.created_at) }}
          </span>
        </template>
        <template #item.updated_at="{ item }">
          <span
            :class="{ 'text-decoration-line-through': !!item.deleted_at }"
            :title="item.updated_at"
          >
            {{ parseDate(item.updated_at) }}
          </span>
        </template>
        <template #item.admin="{ item }">
          <v-chip v-if="item.admin" small color="primary">
            {{ $t('Admin') }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn v-if="!item.deleted_at" icon>
            <v-icon
              small
              @click="
                isEditing = true
                userUpdating = item
              "
            >
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn v-if="!item.deleted_at" icon>
            <v-icon small color="error" @click="destroyUser(item)">
              mdi-delete
            </v-icon>
          </v-btn>
          <v-btn v-if="!!item.deleted_at" icon>
            <v-icon small @click="restoreUser(item)">mdi-restore</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <v-dialog v-model="isEditing" width="500">
        <v-card>
          <v-card-title>Edit {{ userUpdating.name }}</v-card-title>

          <v-divider class="mb-4" />

          <v-card-text>
            <v-form ref="form" v-model="validEdit" @submit.prevent="updateUser">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="userUpdating.name"
                    type="text"
                    :label="$t('Full name')"
                    :rules="rules.name"
                    :error="errors.name.length > 0"
                    :error-messages="errors.name"
                    autofocus
                    dense
                    @input="errors.name = []"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="userUpdating.email"
                    type="email"
                    :label="$t('E-Mail')"
                    :rules="rules.email"
                    :error="errors.email.length > 0"
                    :error-messages="errors.email"
                    dense
                    @input="errors.email = []"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-switch
                    v-model="userUpdating.admin"
                    :label="$t('Is admin')"
                    :rules="rules.admin"
                    :error="errors.admin.length > 0"
                    :error-messages="errors.admin"
                    :disabled="
                      $auth.user.email === userUpdating.email &&
                      $auth.user.admin
                    "
                    @input="errors.admin = []"
                  ></v-switch>
                </v-col>

                <v-col cols="12">
                  <v-card-actions>
                    <v-btn color="red darken-1" text @click="isEditing = false">
                      {{ $t('Cancel') }}
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      type="submit"
                      color="blue darken-1"
                      text
                      :disabled="!validEdit"
                      @click.prevent="updateUser"
                    >
                      {{ $t('Save') }}
                    </v-btn>
                  </v-card-actions>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      userPagination: {
        page: 1,
        limit: 15,
        total: 0,
        isLoading: false,
      },
      userOptions: {},
      isEditing: false,
      isAdding: false,
      userUpdating: {},
      userAdding: {},
      validAdd: true,
      validEdit: true,
      rules: {
        name: [
          (v) => !!v || this.$t('{0} is required', [this.$t('Name')]),
          (v) =>
            (v && v.length <= 255) ||
            this.$t('Max {0} characters allowed', [255]),
        ],
        email: [
          (v) => !!v || this.$t('{0} is required', [this.$t('E-Mail')]),
          (v) =>
            /.+@.+\..+/.test(v) ||
            this.$t('{0} is invalid', [this.$t('E-Mail')]),
        ],
        admin: [],
      },
      errors: {
        name: [],
        email: [],
        admin: [],
      },
    }
  },

  watch: {
    async userOptions({ page, itemsPerPage }) {
      const p = this.userPagination
      if (p.page === page && p.limit === itemsPerPage) {
        return
      }

      if (itemsPerPage === -1) {
        itemsPerPage = p.limit || 15
      }

      await this.loadUsers({ page, limit: itemsPerPage })
    },
  },

  mounted() {
    this.loadUsers(this.userPagination)
  },

  methods: {
    parseDate(date) {
      return new Date(date).toLocaleString(
        this.$i18n.locale,
        this.$config.LOCALE_FORMAT
      )
    },
    async loadUsers({ page, limit }) {
      this.userPagination.isLoading = true
      const query = new URLSearchParams({ page, limit })
      const response = await this.$axios.$get(`/api/users?${query}`)
      this.users = response.data
      this.userPagination = {
        ...this.userPagination,
        ...{
          total: response.total,
          limit: response.limit,
          page: response.page,
          isLoading: false,
        },
      }
    },
    async destroyUser(user) {
      this.userPagination.isLoading = true
      await this.$axios.$delete(`/api/users/${user.id}`)
      const i = this.users.findIndex((r) => r.id === user.id)
      this.users[i].deleted_at = new Date()
      this.userPagination.isLoading = false
    },
    async restoreUser(user) {
      this.userPagination.isLoading = true
      await this.$axios.$post(`/api/users/${user.id}/restore`)
      const i = this.users.findIndex((r) => r.id === user.id)
      this.users[i].deleted_at = null
      this.userPagination.isLoading = false
    },
    async updateUser() {
      this.userPagination.isLoading = true
      const payload = {
        name: this.userUpdating.name,
        email: this.userUpdating.email,
        admin: this.userUpdating.admin,
      }
      try {
        await this.$axios.$patch(`/api/users/${this.userUpdating.id}`, payload)
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors = { ...this.errors, ...errors }
        this.userPagination.isLoading = false
        return
      }

      const i = this.users.findIndex((c) => c.id === this.userUpdating.id)
      this.users[i] = { ...this.users[i], ...payload }
      this.userPagination.isLoading = false
      this.userUpdating = this.users[i]
      this.isEditing = false
    },
    async addUser() {
      this.userPagination.isLoading = true
      const payload = {
        name: this.userAdding.name,
        email: this.userAdding.email,
        admin: this.userAdding.admin,
      }
      try {
        await this.$axios.$post(`/api/users`, payload)
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors = { ...this.errors, ...errors }
        this.userPagination.isLoading = false
        return
      }

      this.userPagination.isLoading = false
      this.userAdding = {}
      this.isAdding = false
      this.loadUsers({ page: 1, limit: 15 })
    },
  },
}
</script>
