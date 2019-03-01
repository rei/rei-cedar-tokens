<template>
  <div class="cdr-container">
    <h2 class="type-title">{{ categoryTitle }}</h2>
    <div
      v-for="(v,k) in typeData"
      :key="k"
    >
      <h3 v-if="k !== 'undefined'">---{{k}}---</h3>

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
            v-for="(v,k) in v"
            :key="k"
            :prop="v"
          />
          <!-- <template v-if="categoryTitle === 'text'">
            <p>---------</p>
            <type-mixin
              v-for="(v,k) in mixinTokens"
              :key="k"
              :name="kebab(k)"
              :prop="v"
            />
          </template> -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import PropSorter from './PropSorter';
// import TypeMixin from './TypeMixin';
import groupBy from 'lodash/groupBy';


export default {
  name: 'Category',
  props: {
    categoryData: Object,
    categoryTitle: String,
  },
  components: {
    PropSorter,
    // TypeMixin,
  },
  computed: {
    mixinTokens() {
      return groupBy(this.categoryData, 'mixin');
    },
    typeData() {
      return groupBy(this.categoryData, 'docs.type');
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
