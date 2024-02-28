<script setup lang="ts">
import Watermark from '../components/Watermark.vue'
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="container">
    <Watermark><div class="content"></div></Watermark>
    <Watermark text="禁止转载" style="background: #28c840">
      <div class="content"></div>
    </Watermark>
  </div>

</template>

<style scoped>
.container {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.content {
  width: 500px;
  height: 500px;
}
</style>
