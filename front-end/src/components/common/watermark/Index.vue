<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import useWatermarkBg from './useWatermarkBg.js'
const props = defineProps({
  text: { type: String, required: true, default: 'watermark' },
  fontSize: { type: Number, default: 40 },
  gap: { type: Number, default: 20 } // 间隔
})
// 生成水印图片
const bg = useWatermarkBg(props)
const parent = ref(null)

let div
// 重置水印
function resetWatermark() {
  if (!parent.value) {
    return
  }
  if (div) {
    div.remove()
  }
  const { base64, size } = bg.value
  div = document.createElement('div')
  div.style.position = 'absolute'
  div.style.backgroundImage = `url(${base64})`
  div.style.backgroundSize = `${size}px ${size}px`
  div.style.backgroundRepeat = 'repeat'
  div.style.zIndex = '9999'
  div.style.inset = '0'
  div.style.pointerEvents = 'none' // 点击事件穿透
  parent.value.appendChild(div)
}

const ob = new MutationObserver((entries) => {
  console.log('变化了 。。。。')
  for (const entry of entries) {
    console.log(entry)
    // 处理删除情况
    for (const node of entry.removedNodes) {
      if (node === div) {
        resetWatermark()
      }
    }
    // 处理修改情况
    if (entry.target === div) {
      resetWatermark()
    }
  }
})

onMounted(() => {
  resetWatermark()
  ob.observe(parent.value, {
    childList: true,
    attributes: true,
    subtree: true
  })
})

onUnmounted(() => {
  ob.disconnect()
})
</script>

<template>
  <div class="watermark-container" ref="parent">
    <slot></slot>
  </div>
</template>

<style scoped>
.watermark-container {
  position: relative;
}
</style>
