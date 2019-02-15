<template>
  <tr>
    <td>{{name}}</td>
    <td>
      <!-- <p
        v-for="k in prop.value"
        :key="k"
        class="typography-values"
      >
        {{k}}
      </p> -->
      mixin
    </td>
    <td>
      <p :style="styleObj">Sample text</p>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'TypeMixin',
  props: {
    name: String,
    prop: [Array,Object],
  },
  computed: {
    styleObj() {
      let final = {};
      this.prop.forEach(o => {
        final[o.property]= o.value;
      })
      return final;
    },
  },
};
</script>

<style>
  .typography-values {
    margin-bottom: 0;
  }
</style>