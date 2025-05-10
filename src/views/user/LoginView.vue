<template>
  <a-layout style="height: 100vh; display: flex; justify-content: center; align-items: center;">

    <a-card style="width: 300px; text-align: center; border-radius: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
      <template #title>
        <span style="font-size: 20px; font-weight: bold; font-family: 'Poppins', sans-serif;">登录</span>
      </template>
      <a-form :model="formState" @finish="onFinish">
        <a-form-item label="用户名" name="userAccount" :rules="[{ required: true, message: '请输入用户名' }]">
          <a-input v-model:value="formState.userAccount" style="border-radius: 8px;"/>
        </a-form-item>
        <a-form-item label="密码" name="userPassword" :rules="[{ required: true, message: '请输入密码' }]">
          <a-input-password v-model:value="formState.userPassword" style="border-radius: 8px;"/>
        </a-form-item>
        <a-form-item>
          <a-space direction="vertical" size="middle">
            <a-button type="primary" html-type="submit" block :disabled="disabled" style="border-radius: 8px; background: linear-gradient(135deg, #f3d35b, rgba(255,180,180,0.82)); border: none; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">登录</a-button>
            <a-button type="primary" style="width: 250px; border-radius: 8px; background: linear-gradient(135deg, rgba(246,138,138,0.8), #cb8f8f); border: none; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" block @click="router.push('/user/register')">注册</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {message} from 'ant-design-vue';
import {UserControllerService, UserLoginRequest} from "../../../generated";
import {useRouter} from "vue-router";
import {useStore} from "vuex";

const router = useRouter();
const store = useStore();
const formState = ref<UserLoginRequest>({
  userAccount: '',
  userPassword: '',
});
const disabled = computed(() => {
  return !(formState.value.userAccount && formState.value.userPassword);
});
/**
 * 登录
 */
const onFinish = async () => {
  const res = await UserControllerService.userLoginUsingPost({
    userAccount: formState.value.userAccount,
    userPassword: formState.value.userPassword,
  });
  if (res.code === 0) {
    //当登录后，我们将用户的信息存储在Vuex中，这样在需要获取用户信息时，就可以直接从Vuex中获取，而不需要每次都去请求服务器。
    store.commit("user/updateLoginUser", res.data);
    console.log('store.state.loginUser.userAccount', store.state.user.loginUser);
    message.success('登录成功');
    router.replace('/my');
  } else {
    message.error('登录失败');
  }
};
</script>

<style scoped>/* 可以在这里添加一些样式 */
@keyframes buttonScale {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

a-button:hover {
  animation: buttonScale 0.3s ease-in-out;
}
</style>