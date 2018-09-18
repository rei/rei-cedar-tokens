<template>
  <tr>
    <td>{{prop.name}}</td>
    <td>{{prop.value}}</td>
    <td v-show="prop.name.split('-')[0] === 'duration'">
      <div
        class="motion-example duration"
        :style="{
          'transition-duration': prop.value,
          'transition-property': 'color',
        }"
      />
    </td>
    <td v-show="prop.name.split('-')[0] === 'timing'">
      <!-- <div
        class="motion-example"
        :style="{
          'left': `${left}px`,
          'transition-timing-function': prop.value,
          'transition-duration': '500ms',
          'transition-property': 'left',
        }"
      /> -->
    </td>
    <td v-show="prop.name.split('-')[0] === 'rotation'">
      <div
        class="motion-example rotation"
        v-on:mouseover="rotate()"
        :style="{
          'transition-duration': '400ms',
          'transition-property': 'transform',
          'transform': rotate(`${deg}deg`),
        }"
      />
    </td>
  </tr>
</template>

<script>
import { setTimeout } from 'core-js';

export default {
  name: 'TypeMotion',
  props: {
    prop: Object,
  },
  data() {
    return {
      left: 0,
      deg: 0,
    };
  },
  methods: {
    slide() {
      this.left = this.left === 0 ? 400 : 0;

      setTimeout(() => {
        this.slide();
      }, 5000);
    },
    rotate() {
      this.deg = this.deg === 0 ? this.prop.value : 0;
    },
  },
  mounted() {
    if (this.prop.name.split('-')[0] === 'timing') {
      this.slide();
    }
  },
};
</script>

<style>
.motion-example {
  width: 100px;
  height: 100px;
  background-color: #b5292b;
  position: relative;
  left: 0;
}

.motion-example.duration:hover {
  background-color: #367c3c;
}

</style>
