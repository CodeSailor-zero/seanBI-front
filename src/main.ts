import {createApp} from 'vue'
import {createRouter,  createWebHistory} from "vue-router";
import routes from "./configs/router";
import App from "./App.vue";
import { DatePicker } from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import VCharts from 'vue-echarts';
import * as echarts from 'echarts'
import store from "./store";





const app = createApp(App);
export const router = createRouter({
    history: createWebHistory(),
    routes,
});

app.use(DatePicker);
app.use(router);
app.use(store);
app.component('v-charts',VCharts);
app.config.globalProperties.$echarts = echarts;
app.mount('#app');
