<template>
  <div class="social-sharing" :class="{ hidden: !isHidden }">
    <!-- Telegram -->
    <a :href="telegram" target="_blank" :title="$t('Share via Telegram')">
      <i class="fab fa-telegram"></i>
    </a>

    <!-- Email -->
    <a :href="email" :title="$t('Share via email')">
      <i class="fas fa-envelope"></i>
    </a>

    <!-- PDF Download -->
    <a :title="$t('Download as PDF')" @click="downloadPdf()">
      <i class="fas fa-print"></i>
    </a>

    <a class="delete" @click="hideSocialSharing()"></a>
  </div>
</template>

<script>
export default {
  props: {
    recipe: { type: Object, required: true },
    author: { type: Object, required: true },
    category: { type: Object, required: true },
  },

  computed: {
    url() {
      return this.localePath({
        name: 'recipes-id',
        params: { id: this.recipe.id },
      })
    },
    telegram() {
      return `//telegram.me/share/url?url=${this.url}&text=${this.recipe.name}`
    },
    email() {
      return (
        `mailto:?Subject=${this.recipe.name}&amp;Body=` +
        `${this.recipe.name}%0D%0A${this.author.name}%0D%0A${this.category.name}%0D%0A${this.url}`
      )
    },
    isHidden() {
      return !this.$auth.$storage.getUniversal('social-sharing')
    },
  },

  methods: {
    downloadPdf() {
      this.$axios.get(`/api/recipes/${this.recipe.id}/pdf`).then((pdf) => {
        const link = document.createElement('a')
        link.href = pdf
        link.setAttribute('download', `${this.recipe.name}.pdf`)
        document.body.appendChild(link)
        link.click()
      })
    },
    hideSocialSharing() {
      this.$auth.setUniversal('social-sharing', false)
    },
  },
}
</script>

<style lang="scss" scoped>
div.hidden {
  visibility: hidden;
}

div.social-sharing {
  position: relative;

  > a > i {
    font-size: 2.5em;
    margin-right: 10px;

    &.fa-telegram {
      color: #2da5e1;
    }

    &.fa-envelope {
      color: #769e5d;
    }

    &.fa-print {
      color: #4d4d4d;
    }
  }
}
</style>
