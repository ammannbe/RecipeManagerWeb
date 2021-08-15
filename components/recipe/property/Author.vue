<template>
  <v-row>
    <v-col
      cols="5"
      sm="4"
      md="3"
      xl="2"
      class="font-weight-bold px-2 py-0 body-1 d-flex align-center"
    >
      {{ $t('Author') + ':' }}
    </v-col>
    <v-col class="px-2 py-0 body-1">
      <span>{{ recipe.author.name }}</span>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    recipe: { type: Object, required: true },
    editMode: { type: Boolean, default: false },
  },
}
</script>
