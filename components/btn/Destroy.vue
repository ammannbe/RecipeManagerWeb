<template>
  <v-btn
    v-if="!confirm"
    :class="displace && 'mt-n4'"
    color="error"
    icon
    :absolute="absolute"
    :top="top"
    :right="right"
    :bottom="bottom"
    :left="left"
    @click.stop="submit"
  >
    <v-icon>mdi-delete-circle</v-icon>
  </v-btn>

  <v-dialog v-else v-model="dialog" width="500">
    <template #activator="{ on, attrs }">
      <v-btn
        :class="displace && 'mt-n4'"
        color="error"
        icon
        :absolute="absolute"
        :top="top"
        :right="right"
        :bottom="bottom"
        :left="left"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-delete-circle</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline">
        <slot name="title">{{ $t('Please confirm') }}</slot>
      </v-card-title>

      <v-divider />

      <v-card-text class="py-4">
        <slot>{{ $t('Do you want to proceed with this action?') }}</slot>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="cancel">
          <slot name="cancel">
            {{ $t('Cancel') }}
          </slot>
        </v-btn>
        <v-btn color="primary" text @click="submit">
          <slot name="ok">
            {{ $t('Ok') }}
          </slot>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    confirm: { type: Boolean, default: false },
    absolute: { type: Boolean, default: false },
    top: { type: Boolean, default: false },
    right: { type: Boolean, default: false },
    bottom: { type: Boolean, default: false },
    left: { type: Boolean, default: false },
    displace: { type: Boolean, default: true },
  },

  data() {
    return {
      dialog: false,
    }
  },

  methods: {
    submit($event) {
      this.$emit('click', $event)
      this.dialog = false
    },
    cancel($event) {
      this.$emit('cancel', $event)
      this.dialog = false
    },
  },
}
</script>
