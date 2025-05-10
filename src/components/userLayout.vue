<template>
  <a-page-header
      class="page-header"
  >
    <template #title>
      <a-avatar
          shape="square"
          size="large"
          src="https://cdn.analyticsvidhya.com/wp-content/uploads/2023/08/Screenshot_2023-08-28_110621.png"/>
      <span style="font-weight: bold; font-family: 'Poppins', sans-serif;">SeanBi</span>
    </template>
  </a-page-header>
<router-view/>
</template>

<script setup lang="ts">

</script>

<style scoped>
.page-header {
  position: fixed;
  top: 0;
  width: 100%; /* 设置页头宽度为256px */
  z-index: 10; /* 确保页头在最上层 */
  border: 1px solid rgb(235, 237, 240);
  background-color: white; /* 设置背景颜色 */
  padding: 16px; /* 添加内边距 */
  font-family: 'Poppins', sans-serif;
}
</style>