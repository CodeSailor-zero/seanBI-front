<template>
  <a-layout style="height: 100vh; display: flex; justify-content: center; align-items: center;">
    <a-card title="登录" style="width: 300px;">
      <a-form :model="formState" @finish="onFinish">
        <a-form-item label="用户名" name="userAccount" :rules="[{ required: true, message: '请输入用户名' }]">
          <a-input v-model:value="formState.userAccount"/>
        </a-form-item>
        <a-form-item label="密码" name="userPassword" :rules="[{ required: true, message: '请输入密码' }]">
          <a-input-password v-model:value="formState.userPassword"/>
        </a-form-item>
        <a-form-item label="二次密码" name="checkPassword" :rules="[{ required: true, message: '请再次输入密码' }]">
          <a-input-password v-model:value="formState.checkPassword"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 250px; border-radius: 8px; background: linear-gradient(135deg, rgba(246,138,138,0.8), #cb8f8f); border: none; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" block>注册</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
import { ref} from 'vue';
import {message} from 'ant-design-vue';
import {UserControllerService, UserLoginRequest, UserRegisterRequest} from "../../../generated";
import {useRouter} from "vue-router";

const router = useRouter();
const formState = ref<UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: ''
});

/**
 * 登录
 */
const onFinish = async () => {
  const res = await UserControllerService.userRegisterUsingPost({
    userAccount: formState.value.userAccount,
    userPassword: formState.value.userPassword,
    checkPassword: formState.value.checkPassword
  });
  if (res.code === 0) {
    message.success('注册成功');
   router.replace('/user/login');
  }else {
    message.error('注册失败');
  }
};
</script>

<style scoped>
/* 可以在这里添加一些样式 */
</style>