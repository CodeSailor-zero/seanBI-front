<template>
  <a-page-header
      title="用户信息修改页面"
      @back="router.back();"
  />
  <a-row :gutter="[16, 16]" style="max-width: 1200px; margin: 20px auto;">
    <!-- 左侧：输入框 -->
    <a-col :span="12">
      <a-form
          :model="formState"
          layout="horizontal"
          style="background: rgba(255, 255, 255, 0.8); padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);"
          @finish="onFinish"
      >
        <a-form-item label="用户昵称">
          <a-input v-model:value="formState.userName" placeholder="请输入用户昵称"
                   style="border: 1px solid #ccc; border-radius: 5px; transition: all 0.3s;"/>
        </a-form-item>
        <a-form-item label="用户密码">
          <a-input-password v-model:value="formState.userPassword" placeholder="请输入用户密码"
                            style="border: 1px solid #ccc; border-radius: 5px; transition: all 0.3s;"/>
        </a-form-item>
        <a-form-item label="二次输入">
          <a-input-password v-model:value="formState.checkPassword" placeholder="请再输入用户密码"
                            style="border: 1px solid #ccc; border-radius: 5px; transition: all 0.3s;"/>
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit"
                    style="
                    left: 450px;
                    background: linear-gradient(90deg, rgba(194,30,30,0.55), #fda085);
                    color: white;
                    border: none;
                    border-radius: 5px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                    transition: all 0.3s;"
          >
            提交
          </a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {reactive} from "vue";
import {UserControllerService} from "../../../generated";
import {useStore} from "vuex";
import CryptoJs from "crypto-js"
import {message} from "ant-design-vue";

const router = useRouter();
const store = useStore();
const loginUser = store.state.user.loginUser;
const formState = reactive({
  userName: loginUser?.userName,
  userPassword: '',
  checkPassword: '',
  userAvatar: [], // 添加头像字段
});

const SAIT_KEY = "yupi";
/**
 * 加密密码
 * @param password
 */
const md5Password = (password: string) => {
  return CryptoJs.MD5(SAIT_KEY + password).toString();
}

/***
 * 提交表单，完成修改
 */
const onFinish = async () => {
  //检验两次密码是否一致
  if (formState.userPassword !== formState.checkPassword) {
    alert("两次密码不一致");
    return;
  }

  const formData = new FormData();
  formData.append('file', formState.userAvatar[0]);

  const initialData = {
    id: loginUser?.id,
    userName: formState.userName,
    userPassword: md5Password(formState.userPassword),
  };
  const res = await UserControllerService.updateUserUsingPost({
    id: initialData.id,
    userName: initialData.userName,
    userPassword: initialData.userPassword,
  });
  if (res.code === 0) {
    message.success('修改成功');
    await router.replace('/user/login');
  }
}
</script>

<style scoped>
a-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

/* 输入框悬停效果 */
a-input:hover {
  border-color: #6a11cb;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 上传组件悬停效果 */
a-upload:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

/* 图表展示区域样式 */
.chart-section h3 {
  margin-bottom: 10px;
  color: #333;
}

.chart-description {
  background: rgba(240, 240, 240, 0.8);
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.chart-description h4 {
  margin-bottom: 5px;
  color: #333;
}
</style>