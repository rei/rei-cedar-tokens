import Vue from 'vue'
import App from './App.vue'

// Cedar css
import '@rei/cdr-assets/dist/cdr-core.css';
import '@rei/cdr-assets/dist/cdr-fonts.css';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
