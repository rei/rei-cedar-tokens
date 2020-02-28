<template>
  <tr>
    <td>
      <span :style="mixinStyles(prop)">Get outside with REI</span>
    </td>
    <td>
      {{mixinName}}
      <b v-if="isDeprecated">(DEPRECATED)</b>
    </td>
    <td>mixin</td>
  </tr>
</template>

<script>
import kebab from 'lodash/kebabCase';

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
  },
  computed: {
    mixinName() {
      return kebab(this.prop[0].mixin);
    },
    isDeprecated() {
      return this.prop[0].attributes.deprecated;
    }
  }
}
</script>

<style>

</style>
