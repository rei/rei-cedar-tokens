import Vue from 'vue';
import Router from 'vue-router';
import StyleGuide from 'Components/StyleGuide'; // eslint-disable-line

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'StyleGuide',
      component: StyleGuide,
    },
  ],
});
