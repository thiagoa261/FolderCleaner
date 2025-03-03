<script setup lang="ts">
import Versions from './components/Versions.vue'

const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
</script>

<template>

  <button @click="ipcHandle">Ping</button>

  <p class="w-full bg-red-700 ">teste</p>

  <Versions />
</template>
