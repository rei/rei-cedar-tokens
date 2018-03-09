<template>
  <tr>
    <td>{{prop.name}}</td>
    <td>
      <p
        v-for="(v, k) in prop.value"
        :key="k"
        class="typography-values"
      >
        {{k}}: {{v}}
      </p>
    </td>
    <td>
      <p :style="styleObj">Sample text</p>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'TypeTypography',
  props: {
    prop: Object,
  },
  computed: {
    styleObj() {
      return this.prop.value;
    },
  },
};
</script>

<style>
  .typography-values {
    margin-bottom: 0;
  }
</style>
