<template>
  <div class="sticky top-0 z-40 bg-white border-b shadow-sm p-3 flex gap-2 flex-wrap">

    <!-- Catégorie -->
    <select v-model="localFilters.category" class="filt">
      <option value="">🐟 Catégorie</option>
      <option value="Sardine">Sardine</option>
      <option value="Thon">Thon</option>
      <option value="Dorade">Dorade</option>
    </select>

    <!-- Prix -->
    <select v-model="localFilters.priceMax" class="filt">
      <option value="">💰 Prix max</option>
      <option :value="50">50 DH</option>
      <option :value="100">100 DH</option>
      <option :value="200">200 DH</option>
    </select>

    <!-- Reset -->
    <button @click="reset" class="text-red-500 text-sm">
      ❌ Reset
    </button>

  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

// props reçus du parent
const props = defineProps({
  modelValue: Object
})

// emit vers parent
const emit = defineEmits(['update:modelValue'])

// copie locale
const localFilters = reactive({
  category: '',
  priceMax: ''
})

// envoyer changements au parent
watch(localFilters, () => {
  emit('update:modelValue', localFilters)
}, { deep: true })

// reset
const reset = () => {
  localFilters.category = ''
  localFilters.priceMax = ''
}
</script>

<style scoped>
.filt {
  @apply border rounded-xl px-3 py-2 text-sm;
}
</style>