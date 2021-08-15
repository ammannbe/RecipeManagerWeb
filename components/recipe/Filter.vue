<template>
  <div class="d-flex flex-wrap flex-column mb-3">
    <div class="d-inline-block mt-5">
      <v-dialog v-model="showFilter">
        <template #activator="{ on, attrs }">
          <v-btn fab v-bind="attrs" v-on="on">
            <v-badge v-if="searchTerm || category" dot>
              <v-icon>mdi-filter</v-icon>
            </v-badge>
            <span v-else>
              <v-icon>mdi-filter</v-icon>
            </span>
          </v-btn>
        </template>

        <v-card v-if="showFilter">
          <v-container>
            <v-row class="px-4 py-2">
              <v-col
                cols="12"
                sm="2"
                class="font-weight-bold px-2 py-0 body-1 d-flex align-center"
              >
                {{ $t('Search term:') }}
              </v-col>
              <v-col>
                <v-text-field
                  :value="searchTerm"
                  dense
                  clearable
                  :loading="!!fetchRecipesTimeout"
                  @input="
                    $emit('update:searchTerm', $event)
                    $emit('input', [1, category ? category.id : null, false])
                  "
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="px-4 py-2">
              <v-col
                cols="12"
                sm="2"
                class="font-weight-bold px-2 py-0 body-1 d-flex align-center"
              >
                {{ $t('Category:') }}
              </v-col>
              <v-col>
                <v-select
                  :value="category"
                  :items="categories"
                  item-text="name"
                  item-value="id"
                  dense
                  clearable
                  @input="$emit('input', [1, $event, false])"
                ></v-select>
              </v-col>
            </v-row>
            <v-row class="px-4 py-2">
              <v-col class="d-flex justify-space-between">
                <v-btn
                  color="primary"
                  @click="
                    $emit('update:searchTerm', null)
                    $emit('update:category', null)
                    $emit('input', [1, null, false])
                    showFilter = false
                  "
                >
                  {{ $t('Reset') }}
                </v-btn>
                <v-btn @click="showFilter = false">
                  {{ $t('Ok') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    searchTerm: { type: String, default: null },
    fetchRecipesTimeout: { type: Number, default: null },
    category: { type: Object, default: null },
    categories: { type: Array, required: true },
  },

  data() {
    return {
      showFilter: false,
    }
  },
}
</script>
