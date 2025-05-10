<template>
  <template v-if="route.path.startsWith('/user')">
    <router-view/>
  </template>
  <template v-else>
    <HomeView />
  </template>
</template>

<script setup lang="ts">
import HomeView from "./components/HomeView.vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import accessEnum from "./access/accessEnum";

const route = useRoute();
const router = useRouter();
const store = useStore();
// 拦截器
router.beforeEach(async (to, from, next) => {
  let loginUser = store.state.user.loginUser;
  const userRole = loginUser?.userRole ?? accessEnum.NOT_LOGIN;
  const needAccess = to.meta?.access ?? accessEnum.NOT_LOGIN;
  // 如果目标路由是登录页面，直接放行
  if (to.name === 'login' || to.name === 'register') {
    next();
    return;
  }
  //拦截用户未登录的情况
  if (needAccess === accessEnum.NOT_LOGIN && userRole === accessEnum.NOT_LOGIN) {
    //如果没有登录，则跳转到登录页面
      next({name: 'login'});
      return;
  } else {
    //如果页面需要管理员权限，但是用户没有权限，就跳转到一个其他页面
    if (needAccess === accessEnum.ADMIN && userRole !== accessEnum.ADMIN) {
      next("/noAuth")
    }
  }
  next();
});
</script>

<style scoped>

</style>
