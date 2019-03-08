<template>
  <div class="cdr-container-fluid">
    <div
      v-for="(data, platform) in Tokens"
      :key="platform"
    >
      <h1>Platform: {{platform}}</h1>
      <hr>

      <template v-for="(v, k) in data">
        <Category
          v-if="v.length > 0"
          :key="k"
          :category-title="k"
          :category-data="v"
        />
      </template>
    </div>
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
