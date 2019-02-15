<template>
  <div class="cdr-container">
    <h2 class="type-title">{{ categoryTitle }}</h2>
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
            v-for="(v,k) in categoryData"
            :key="k"
            :name="k"
            :prop="v"
          />
          <template v-if="categoryTitle === 'text'">
            <p>---------</p>
            <type-mixin
              v-for="(v,k) in mixinTokens"
              :key="k"
              :name="kebab(k)"
              :prop="v"
            />
          </template>
        </tbody>
      </table>
  </div>
</template>

<script>
import PropSorter from './PropSorter';
import TypeMixin from './TypeMixin';
import groupBy from 'lodash/groupBy';
import kebabCase from 'lodash/kebabCase';

export default {
  name: 'Category',
  props: {
    categoryData: Object,
    categoryTitle: String,
  },
  components: {
    PropSorter,
    TypeMixin,
  },
  computed: {
    mixinTokens() {
      return groupBy(this.categoryData, 'mixin');
    }
  },
  methods: {
    kebab(s) {
      return kebabCase(s);
    }
  },
}
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
