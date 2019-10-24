import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import fastClick from 'fastclick';
import axios from 'axios';
// import router from './router';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';
import 'common/stylus/index.styl';
import App from './App';

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
// Vue.prototype.getConfigJson = function getConfigJson() {
//   // this.$http.get
//   axios.get('serverconfig.json').then((result) => {
//     // 用一个全局字段保存ApiUrl  也可以用sessionStorage存储
//     Vue.prototype.ApiUrl = result.body.ApiUrl;
//   }).catch((error) => { console.log(error); });
// };
fastClick.attach(document.body);
Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [
  { path: '/', redirect: '/goods' },
  { path: '/goods', component: goods },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller },
];
const router = new VueRouter({
  linkActiveClass: 'active',
  routes,
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
