<template>
  <div id="app">
    <h1>Design Tokens</h1>
    <Category 
      v-for="(v, k) in Tokens"
      :key="k"
      :category-title="k"
      :category-data="v"
    />
  </div>
</template>

<script>
import Tokens from './assets/cdr-tokens.json';
import Category from './components/Category';

export default {
  name: 'app',
  components: {
    Category,
  },
  data() {
    return {
      Tokens,
    };
  },
}
</script>

<style>
</style>
