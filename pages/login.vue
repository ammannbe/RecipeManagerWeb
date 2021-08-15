<template>
  <v-form
    ref="form"
    v-model="valid"
    :lazy-validation="true"
    @submit.prevent="submit"
  >
    <v-card>
      <v-container>
        <v-row>
          <v-col cols="0" sm="2" md="3" lg="4"></v-col>
          <v-col>
            <v-card-title>{{ $t('Login') }}</v-card-title>
          </v-col>
          <v-col cols="0" sm="2" md="3" lg="4"></v-col>
        </v-row>
        <v-row>
          <v-col cols="0" sm="2" md="3" lg="4"></v-col>
          <v-col>
            <v-text-field
              v-model="data.email"
              type="email"
              :label="$t('E-Mail')"
              :rules="rules.email"
              prepend-inner-icon="mdi-email"
              :error="errors.email.length > 0"
              :error-messages="errors.email"
              autofocus
              required
              @keypress="
                errors.email = []
                errors.password = []
              "
            ></v-text-field>
          </v-col>
          <v-col cols="0" sm="2" md="3" lg="4"></v-col>
        </v-row>
        <v-row>
          <v-col cols="0" sm="2" md="3" lg="4"></v-col>
          <v-col>
            <v-text-field
              v-model="data.password"
              :type="showPassword ? 'text' : 'password'"
              :label="$t('Password')"
              :rules="rules.password"
              prepend-inner-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :error="errors.password.length > 0"
              :error-messages="errors.password"
              required
              @keypress="
                errors.email = []
                errors.password = []
              "
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-col>
          <v-col cols="0" sm="2" md="3" lg="4"></v-col>
        </v-row>

        <v-row>
          <v-col cols="0" sm="2" md="3" lg="4"></v-col>
          <v-col>
            <v-btn
              class="mr-4"
              :disabled="!valid"
              type="submit"
              @click="submit"
            >
              {{ $t('Login') }}
            </v-btn>
          </v-col>
          <v-col cols="0" sm="2" md="3" lg="4"></v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-form>
</template>

<script>
export default {
  middleware: 'auth',
  auth: 'guest',

  data() {
    return {
      valid: true,
      data: {
        email: null,
        password: null,
      },
      errors: {
        email: [],
        password: [],
      },
      showPassword: false,
      rules: {
        email: [
          (v) => !!v || this.$t('{0} is required', [this.$t('E-Mail')]),
          (v) =>
            /.+@.+\..+/.test(v) ||
            this.$t('{0} is invalid', [this.$t('E-Mail')]),
        ],
        password: [
          (v) => !!v || this.$t('{0} is required', [this.$t('Password')]),
        ],
      },
    }
  },

  methods: {
    async submit() {
      this.$refs.form.validate()
      if (!this.valid) {
        return false
      }

      try {
        await this.$auth.loginWith('laravelSanctum', { data: this.data })
        this.$auth.redirect('home')
      } catch (error) {
        const errors = error.response.data.errors || null
        this.errors = { ...this.errors, ...errors }
      }
    },
  },
}
</script>
