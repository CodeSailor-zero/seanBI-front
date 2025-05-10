<template>
  <div class="user-prize-view">
    <!-- 顶部导航栏 -->
    <div class="header">
      <span>当前积分: {{ userPoints }}</span>
      <span>VIP状态: {{ vipStatus }}</span>
    </div>

    <!-- 主要内容区 -->
    <div class="content">
      <div class="vip-tier" v-for="tier in vipTiers" :key="tier.level">
        <h3>{{ tier.name }}</h3>
        <p>所需积分: {{ tier.pointsRequired }}</p>
        <button class="exchange-btn" @click="exchangeVip(tier)">兑换</button>
      </div>
    </div>

    <!-- 底部说明 -->
    <div class="footer">
      <p>兑换规则：每2000积分可兑换1个月VIP。</p>
      <p style="color: red">注意事项：兑换后积分将扣除，请勿再次兑换。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {message} from "ant-design-vue";
import {UserControllerService} from "../../../generated";
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";

// 用户积分和VIP状态
const store = useStore();
const userTemplate = store.state.user.loginUser;
let userPoints = userTemplate.score;
let vipStatus = userTemplate.userRole;

// VIP等级信息
const vipTiers = ref([
  { level: 1, name: 'VIP', pointsRequired: 2000 },
]);

// 兑换VIP函数
const exchangeVip = async (tier) => {
  if (userPoints.value < tier.pointsRequired) {
    message.error('积分不足，兑换失败');
    return;
  }
  const res = await UserControllerService.obtainVipUsingGet(tier.pointsRequired)
  if (res.code === 0) {
    message.success('兑换成功');
    console.log("1111",res.data);
    store.commit('user/updateLoginUserScore',res.data);
    store.commit('user/updateLoginUserRole','vip');
    userPoints = userTemplate.score;
    vipStatus = userTemplate.userRole;
  }else {
    message.error('兑换失败');
  }
};
</script>

<style scoped>
.user-prize-view {
  margin-top: 82px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  min-height: 100vh;
}

.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.content {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.vip-tier {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.vip-tier:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.vip-tier h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.vip-tier p {
  font-size: 16px;
  color: #666;
  margin-bottom: 15px;
}

.exchange-btn {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.exchange-btn:hover {
  background-color: #0056b3;
}

.footer {
  margin-top: 30px;
  text-align: center;
  font-size: 14px;
  color: #777;
}
</style>
