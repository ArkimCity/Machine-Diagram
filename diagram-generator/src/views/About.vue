<template>
  <div class="about">
    <h1>This is an about page</h1>
      <div id="threeCanvas1">
  </div>
    <Canvas></Canvas>
  </div>
</template>

<script>
import Canvas from '@/components/Canvas.vue'

export default {
  name: 'App',
  components: {
    Canvas
  }
};
</script>