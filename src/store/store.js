import Vue from 'vue';
import Vuex from 'vuex';
import theoData from '../../static/data.json';

Vue.use(Vuex);

const state = {
  theoData,
};

export default new Vuex.Store({
  state,
});
