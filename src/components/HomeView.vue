<template>
  <div class="layout">
    <a-page-header
        class="page-header"
    >
      <template #title>
        <a-avatar shape="square" size="large"
                  src="https://cdn.analyticsvidhya.com/wp-content/uploads/2023/08/Screenshot_2023-08-28_110621.png"/>
        <span style="font-weight: bold">SeanBi</span>
      </template>
    </a-page-header>
    <a-layout style="height: 100vh; width: 100%;">
      <a-layout-sider width="256px" style="position: fixed; top: 80px; bottom: 0;">
        <a-menu mode="inline" style="height: 100%; display: flex; flex-direction: column;">
          <div style="flex: 1;">
            <a-menu-item key="AddMyChartByPage">
              <router-link to="/add/chart">
                <PieChartTwoTone style="width: 20px;height: 20px"/>
                <span>生成图表（同步）</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="AddMyChartByPageAscy">
              <router-link to="/add/async/chart">
                <FileAddTwoTone style="width: 20px;height: 20px"/>
                <span>生成图表（MQ）</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="MyChartByPage">
              <router-link to="/my/chart">
                <FileAddTwoTone style="width: 20px;height: 20px"/>
                <span>列表我的图表</span>
              </router-link>
            </a-menu-item>

            <a-sub-menu key="ManageChartView">
              <template #title>
                <ProfileTwoTone style="width: 20px;height: 20px;color: blue"/>
                <span>管理页面</span>
              </template>
              <a-menu-item key="ManageView">
                <router-link to="/manage/my/chart">
                  <FundTwoTone style="width: 20px;height: 20px"/>
                  <span>管理我的图表</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="AdminManageView" v-if="loginUser.userRole === accessEnum.ADMIN">
                <router-link to="/admin/manage/chart">
                  <FundTwoTone style="width: 20px;height: 20px"/>
                  <span>管理图表（管理员）</span>
                </router-link>
              </a-menu-item>
            </a-sub-menu>

            <a-menu-item key="MyView">
              <router-link to="/my">
                <SmileTwoTone style="width: 20px;height: 20px"/>
                <span>我的</span>
              </router-link>
            </a-menu-item>
          </div>
          <div class="menu-footer">
            <a-popover placement="top">
              <template #content>
                <a-button type="link" @click="userLoginOut">退出</a-button>
              </template>
              <a-menu-item key="footerItem">
                <a-avatar :src="loginUser?.userAvatar"/>
                <span style="margin-left: 8px">{{ loginUser?.userName }}</span>
              </a-menu-item>
            </a-popover>
          </div>
        </a-menu>
      </a-layout-sider>
      <a-layout-content style="margin-left: 276px; flex: 1; height: calc(100vh - 64px); padding: 20px;">
        <router-view/>
      </a-layout-content>
    </a-layout>
  </div>
</template>
<script setup lang="ts">
import {SmileTwoTone, PieChartTwoTone, FileAddTwoTone, FundTwoTone, ProfileTwoTone} from '@ant-design/icons-vue'
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {UserControllerService} from "../../generated";
import {message} from "ant-design-vue";
import accessEnum from "../access/accessEnum";
import {computed, onMounted} from "vue";
import routes from "../configs/router";

const router = useRouter();
const store = useStore();
const loginUser = store.state.user.loginUser;


/**
 * 用户退出
 */
const userLoginOut = async () => {
  const res = await UserControllerService.userLogoutUsingPost();
  if (res?.code === 0) {
    router.replace('/user/login');
    message.success('退出成功');
  }else {
    message.error('退出失败');
  }
}
</script>

<style scoped>
/* 添加菜单样式以提升层次感 */
a-menu {
  border: 1px solid #e8e8e8; /* 添加边框 */
  border-radius: 4px; /* 添加圆角 */
  padding: 10px; /* 添加内边距 */
  margin-top: 20px; /* 添加顶部间距 */
}

a-menu-item {
  margin-bottom: 5px; /* 添加菜单项之间的间距 */
  padding: 10px; /* 添加内边距 */
  border-radius: 4px; /* 添加圆角 */
  transition: background-color 0.3s; /* 添加过渡效果 */
  background-color: #f0f9ff; /* 设置默认背景颜色为浅蓝色 */
}

a-menu-item:hover {
  background-color: #e6f7ff; /* 鼠标悬停时的背景颜色 */
}

.layout {
  position: relative;
  height: 100vh; /* 设置布局高度为视口高度 */
}

.page-header {
  position: fixed;
  top: 0;
  width: 256px; /* 设置页头宽度为256px */
  z-index: 10; /* 确保页头在最上层 */
  border: 1px solid rgb(235, 237, 240);
  padding: 16px; /* 添加内边距 */
}

a-layout {
  display: flex; /* 使布局成为弹性盒子容器 */
  height: 100vh; /* 设置高度为视口高度 */
  width: 100%; /* 设置宽度为100% */
}

a-layout-content {
  margin-left: 276px; /* 与侧边栏宽度一致 */
  flex: 1; /* 占满剩余空间 */
  height: calc(100vh - 64px); /* 设置高度为视口高度减去页头高度 */
  padding: 20px; /* 添加内边距 */
}

a-layout-sider {
  z-index: 1; /* 确保侧边栏在内容之上 */
}

.menu-footer {
  margin-top: auto; /* 将底部内容推到菜单底部 */
  padding: 10px 0; /* 添加内边距 */
  border-top: 1px solid #e8e8e8; /* 添加顶部边框 */
}
</style>
