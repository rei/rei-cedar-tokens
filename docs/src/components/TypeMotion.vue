<template>
  <tr>
    <td >
      <div class="motion-background">
        <div
          v-if="prop.docs.example === 'duration'"
          class="motion-example duration"
          :style="{
            'animation-play-state': animate ? 'running' : 'paused',
            'animation-duration': prop.value,
          }"
        />
        <div
          v-if="prop.docs.example === 'timing'"
          class="motion-example"
          :style="{
            'animation-play-state': animate ? 'running' : 'paused',
            'animation-timing-function': prop.value,
          }"
        />
      </div>
      <button @click="animate = !animate">Start/Stop</button>
    </td>
    <td>{{prop.name}}</td>
    <td>{{prop.value}}</td>
  </tr>
</template>

<script>
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
};
</script>

<style lang="scss">
@keyframes demo {
  90%, 100% {
    opacity: 0.5;
    transform: translate(200%, 0);
  }
  0% {
    opacity: 1;
  }
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
  border-radius: 50%;
  background-color: #434343;
  animation-name: demo;
  animation-iteration-count: infinite;
  animation-duration: 1500ms;
}
.motion-example.duration {
  background-color: #3278ae;
}
</style>