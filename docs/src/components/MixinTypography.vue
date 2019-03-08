<template>
  <tr>
    <td>
      <p :style="mixinStyles(prop)">Get outside with REI</p>
    </td>
    <td>{{prop[0].mixin}}</td>
    <td>mixin</td>
  </tr>
</template>

<script>
export default {
  name: 'MixinTypography',
  props: {
    prop: [Array, Object],
  },
  methods: {
    mixinStyles(s) {
      let final = {};
      s.forEach(o => {
        final[o.property]= o.value;
      })
      return final;
    }
  }
}
</script>

<style>

</style>
