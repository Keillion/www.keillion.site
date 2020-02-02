import Vue from 'vue';
//import Antd from 'ant-design-vue';
import App from './App.vue';
//import 'ant-design-vue/dist/antd.css'
import './registerServiceWorker';
import router from './router';
import store from './store';
import { Button } from 'ant-design-vue';
import { Icon } from 'ant-design-vue';
import { Layout } from 'ant-design-vue';
import { Avatar } from 'ant-design-vue';
import { Input } from 'ant-design-vue';
import { Drawer } from 'ant-design-vue';
import { Menu } from 'ant-design-vue';
import { Calendar } from 'ant-design-vue';
//import 'ant-design-vue/lib/button/style';

Vue.component(Button.name, Button);
Vue.component(Icon.name, Icon);
Vue.component(Layout.name, Layout);
Vue.component(Layout.Header.name, Layout.Header);
Vue.component(Layout.Content.name, Layout.Content);
Vue.component(Layout.Footer.name, Layout.Footer);
Vue.component(Avatar.name, Avatar);
Vue.component(Input.Search.name, Input.Search);
Vue.component(Drawer.name, Drawer);
Vue.component(Menu.name, Menu);
Vue.component(Menu.Item.name, Menu.Item);
Vue.component(Calendar.name, Calendar);
Vue.config.productionTip = false;

//Vue.use(Antd);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
