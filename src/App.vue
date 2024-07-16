<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Tasks</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: center;
}
</style>
