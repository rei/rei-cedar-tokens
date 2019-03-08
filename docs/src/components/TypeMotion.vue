<template>
  <tr>
    <td >
      <div class="motion-background">
        <div
          v-if="prop.docs.example === 'duration'"
          class="motion-example duration"
          :style="{
            'animation-name': animate ? 'demo' : '',
            'animation-duration': prop.value,
          }"
        />
        <div
          v-if="prop.docs.example === 'timing'"
          class="motion-example"
          :style="{
            'animation-name': animate ? 'demo' : '',
            'animation-timing-function': prop.value,
          }"
        />
      </div>
      <button @click="animate = !animate">Start/Stop</button>
    </td>
    <td>{{name}}</td>
    <td>{{prop.value}}</td>
  </tr>
</template>

<script>
import kebabCase from 'lodash/kebabCase';

export default {
  name: 'TypeMotion',
  props: {
    prop: Object,
  },
  data() {
    return {
      animate: false
    }
  },
  computed: {
    name() {
      return kebabCase(this.prop.name);
    }
  },
};
</script>

<style lang="scss">
@keyframes demo {
  0% { transform: translate(0) }
  50% { transform: translate(200%) }
  0% { transform: translate(0) }
}

.motion-background {
  position: relative;
  padding: 10px;
  height: 70px;
  width: 180px;
  background-color: lightgray;
}

.motion-example {
  width: 33%;
  padding-bottom: 33%;
  // height: 100%;
  border-radius: 50%;
  background-color: #434343;
  animation-iteration-count: infinite;
  animation-duration: 1000ms;
}
.motion-example.duration {
  background-color: #3278ae;
}
</style>