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
      {{prop.value}}
    </td>
    <td>
      part of "{{kebab(prop.mixin)}}" mixin
    </td>
  </tr>
</template>

<script>
import kebabCase from 'lodash/kebabCase';

export default {
  name: 'TypeTypography',
  props: {
    name: String,
    prop: Object,
  },
  methods: {
    kebab(s) {
      return kebabCase(s);
    }
  }
};
</script>

<style>
</style>