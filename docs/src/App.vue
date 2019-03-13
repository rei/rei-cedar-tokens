<template>
  <div class="cdr-container-fluid">
    <div
      v-for="(data, platform) in Tokens"
      :key="platform"
    >
      <h1 class="platform-title">Platform: {{platform}}</h1>

      <div v-if="platform === 'global'">
        <p>Global token names are converted to platform specific variable naming but only shown here for SCSS/LESS:</p>
        <ul>
          <li>SCSS/LESS: kebab-case</li>
          <li>JS (commonjs): camelCase</li>
          <li>JS (esm): PascalCase</li>
          <li>Android: snake_case</li>
          <li>iOS: PascalCase</li>
        </ul>
        <p>Global token values are converted to platform specific units in the platform's package but only shown here for web</p>
      </div>

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
.platform-title {
  font-size: 32px;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
