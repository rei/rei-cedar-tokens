<template>
  <div class="cdr-container ">
    <h2 class="category-title">{{ categoryTitle }}</h2>

    <div
      v-for="(v,k) in typeData"
      :key="k"
    >
      <h3
        v-if="k !== 'undefined'"
        class="type-title"
      >{{k}}</h3>

      <table
        v-if="otherTokens(v).length > 0"
        class="prop-table"
        data-backstop="capture"
      >
        <tbody class="prop-tbody">
          <prop-sorter
            v-for="(v,k) in otherTokens(v)"
            :key="k"
            :prop="v"
            :deprecated="isDeprecated(v)"
          />
        </tbody>
      </table>

      <template v-if="Object.keys(mixinTokens(v)).length > 0">
        <table
          v-for="(v,k) in mixinTokens(v)"
          :key="k"
          class="prop-table mixins"
          data-backstop="capture"
        >
          <tbody class="prop-tbody">
            <mixin-sorter
              :prop="v"
            />
            <type-mixin
              v-for="(v, idx) in v"
              :key="`mixin${v.name}${idx}`"
              :prop="v"
            />
          </tbody>
        </table>
      </template>
    </div>
  </div>
</template>

<script>
import PropSorter from './PropSorter';
import MixinSorter from './MixinSorter';
import TypeMixin from './TypeMixin';
import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';
import has from 'lodash/has';


export default {
  name: 'Category',
  props: {
    categoryData: Array,
    categoryTitle: String,
  },
  components: {
    PropSorter,
    MixinSorter,
    TypeMixin,
  },
  computed: {
    typeData() {
      return groupBy(this.categoryData, 'docs.type');
    }
  },
  methods: {
    mixinTokens(arr) {
      const res = filter(arr, (o) => {
        return has(o, 'mixin');
      });

      return groupBy(res, 'mixin');
    },
    otherTokens(arr) {
      const res = filter(arr, (o) => {
        return !has(o, 'mixin');
      });

      return res;
    },
    isDeprecated(p) {
      return p.attributes.deprecated;
    }
  }
}
</script>

<style lang="scss">
.category-title {
  text-decoration: underline;
  font-size: 24px;
  margin-top: 20px;
  margin-bottom: 20px;
  text-transform: capitalize;
}

.type-title {
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  text-transform: capitalize;
}

.prop-table {
  width: 100%;
  border: 1px solid black;
  border-collapse: collapse;
  table-layout: fixed;

  td, th {
    border: 1px solid black;
  }

  &.mixins + &.mixins {
    margin-top: 20px;
  }
}

.prop-tbody > tr td {
  padding: 10px 5px;
}
</style>
