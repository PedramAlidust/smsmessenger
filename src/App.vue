<template>
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <DataUpdater />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import DataUpdater from './components/DataUpdater.vue'

export default {
  name: 'App',
  components: {
    HelloWorld, 
    DataUpdater
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.todo {
  cursor: pointer;
}

.done {
  text-decoration: line-through;
}
</style>
