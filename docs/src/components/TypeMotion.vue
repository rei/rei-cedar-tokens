<template>
  <tr>
    <td>{{name}}</td>
    <td>{{prop.value}}</td>
    <td v-if="prop.docExample === 'duration'">
      <div
        class="motion-example duration"
        :style="{
          'animation-duration': prop.value,
        }"
      />
    </td>
    <td v-if="prop.docExample === 'timing'">
      <div
        class="motion-example"
        :style="{
          'animation-timing-function': prop.value,
        }"
      />
    </td>
  </tr>
</template>

<script>
import kebabCase from 'lodash/kebabCase';

export default {
  name: 'TypeMotion',
  props: {
    prop: Object,
  },
  computed: {
    name() {
      return kebabCase(this.prop.name);
    }
  },
};
</script>

<style>
@keyframes demo {
  0% { transform: translate(0) }
  50% { transform: translate(100%) }
  0% { transform: translate(0) }
}

.motion-example {
  width: 32px;
  height: 32px;
  background-color: #434343;
  animation-name: demo;
  animation-iteration-count: infinite;
  animation-duration: 1000ms;
}
.motion-example.duration {
  background-color: #3278ae;
}
</style>