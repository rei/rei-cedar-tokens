<template>
  <div>
    <div
      v-for="group in grouped"
      :key="group[0].type"
    >
      <h3>{{group[0].type}}</h3>

      <table>
        <thead>
          <tr>
            <th>Name:</th>
            <th>Value:</th>
            <th>Example:</th>
          </tr>
        </thead>
        <tbody>
          <prop-sorter
            v-for="prop in group"
            :key="prop.name"
            :type="prop.type"
            :prop="prop"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import groupBy from 'lodash/groupBy';
import PropSorter from './PropSorter';

export default {
  name: 'Types',
  props: {
    tokens: Array,
  },
  components: {
    PropSorter,
  },
  computed: {
    grouped() {
      return groupBy(this.tokens, 'type');
    },
  },
};
</script>

<style>

</style>
