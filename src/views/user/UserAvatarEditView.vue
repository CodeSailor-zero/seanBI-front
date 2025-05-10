<template>
  <div class="content">
    <a-form
        :model="formState"
        layout="horizontal"
        style="height: 50%;width: 50%;background: rgba(255, 255, 255, 0.8); padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);"
        @finish="onFinish"
    >
      <a-form-item>
        <h2 style="font-weight: bold;text-align: center">修改头像</h2>
      </a-form-item>
      <a-form-item label="上传头像">
        <a-upload
            style="border-radius: 10px;"
            action="/chart/gen"
            list-type="picture-card"
            max-count="1"
            :before-upload="beforeUpload"
            @remove="handleRemove"
        >
          <div
              style="display: flex; flex-direction: column; align-items: center; justify-content: center; color: rgba(194,30,30,0.55); font-weight: bold;">
            <PlusOutlined style="font-size: 24px;"/>
            <div style="margin-top: 8px;">上传当地图片</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item>
        <span style="font-weight: bold;">请选择图片上传：大小180 * 180像素支持JPG、PNG等格式，图片需小于2M</span>
      </a-form-item>
      <a-form-item>
        <a-button html-type="submit"
                  block
                  style="background: linear-gradient(90deg, #f6d365, #fda085); color: white; border: none; border-radius: 5px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); transition: all 0.3s;"
        >
          修改
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import {PlusOutlined, LoadingOutlined} from "@ant-design/icons-vue"
import {ref} from "vue";
import {message, UploadChangeParam} from "ant-design-vue";
import {FileControllerService} from "../../../generated";
import {useStore} from "vuex";
import {useRouter} from "vue-router";

let fileList = ref<File[]>([]);
const store = useStore();
const router = useRouter();
const loginUser = store.state.user.loginUser;
const formState = ref({
  avatarList: fileList
});

/**
 * 上传文件前的检验
 * @param file
 */
const beforeUpload = (file: File) => {
  //1. 判断文件类型
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    console.log("只能上传 jpg/png 文件");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('请勿超过 2 mb');
    return false;
  }
  formState.value.avatarList.push(file);
  return false;
}

/**
 * 上传图片
 * @param info
 */
const onFinish = async (info: UploadChangeParam) => {
  if (formState.value.avatarList.length <= 0) {
    message.error("请选择图片");
    return;
  }
  const formData = new FormData();
  formData.append('file',  formState.value.avatarList[0]);
  const avatar = formData.get('file') as File | null;
  if (avatar instanceof File) {
    const res = await FileControllerService.uploadFileUsingPost(avatar, "");
    if (res.code === 0) {
      message.success("上传成功");
      store.commit("user/updateLoginUserAvatar", res.data);
      router.replace("/my")
    } else {
      message.error("上传失败");
    }
  } else {
    message.error("文件获取失败")
  }
}

/**
 * 点击移除文件时的回调
 */
const handleRemove = (file: File) => {
  // fileUid 是 文件唯一标识符，用于区分文件
  // 在upload组件未被销毁前，是不变的。
  const fileUid = file.uid;
  fileList.value = fileList.value.filter((item) => item.uid !== fileUid);
  return true;
}
</script>

<style scoped>
.content {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 使内容区域占满整个视口高度 */
}

.avatar-uploader > .ant-upload {
  width: 50px;
  height: 50px;
}

:where(.css-dev-only-do-not-override-1p3hq3p).ant-upload-wrapper.ant-upload-picture-card-wrapper {
  display: inline-block;
}
</style>