import Vue from 'vue'
import App from './App.vue'

// Cedar css
import '@rei/cedar/dist/cedar.css';
import '@rei/cedar/dist/cdr-fonts.css';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
