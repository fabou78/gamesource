<script setup>
  import { ref } from 'vue'

  // Article store
  import { useArticleStore } from '@/stores/articles'
  const articleStore = useArticleStore()

  const loading = ref(false)
  const btnLoad = ref(false)

  /// Load more article

  /// Get first article
  loading.value = true
  articleStore.adminViewAticles(3).finally(() => {
    loading.value = false
  })
</script>

<template>View article</template>
