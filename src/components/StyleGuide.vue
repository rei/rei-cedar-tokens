<template>
  <section>
    <div
      v-for="(values, category) in data"
      :key="category"
    >
      <h2>{{category}}</h2>
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

</style>
