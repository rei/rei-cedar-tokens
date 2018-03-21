<template>
  <section>
    <div
      v-for="(values, category) in data"
      :key="category"
    >
      <hr>
      <h2 class="category-title">{{category}}</h2>
      <category :tokens="values" />
    </div>
  </section>
</template>

<script>
import Category from './Category';

export default {
  name: 'StyleGuide',
  components: {
    Category,
  },
  data() {
    return {
      data: this.$store.state.theoData,
    };
  },
};
</script>

<style>
  .category-title {
    margin-bottom: 16px;
  }
</style>
