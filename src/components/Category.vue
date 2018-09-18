<template>
  <div>
    <div
      v-for="group in grouped"
      :key="group[0].type"
    >
      <h3>
        <span class="type-title">{{group[0].type}}</span>
      </h3>

      <table>
        <thead>
          <tr>
            <th>Name:</th>
            <th>Value:</th>
            <th>Example:</th>
          </tr>
        </thead>
        <tbody class="category-tbody">
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
      const grouped = groupBy(this.tokens, 'type');

      if (grouped.motion) {
        grouped.motion = this.reorderMotionTokens(grouped.motion);
      }

      return grouped;
    },
  },
  methods: {
    reorderMotionTokens(tokens) {
      const duration = [];
      const timing = [];
      const rotation = [];

      tokens.forEach((token) => {
        const name = token.name.split('-')[0];
        if (name === 'duration') {
          duration.push(token);
        } else if (name === 'timing') {
          timing.push(token);
        } else {
          rotation.push(token);
        }
      });

      return duration.concat(timing, rotation);
    },
  },
};
</script>

<style>
  .type-title {
    display: inline-block;
    margin-bottom: 10px;
    border-bottom: 1px solid black;
  }

  .category-tbody > tr td {
    padding: 10px 5px;
  }
</style>
