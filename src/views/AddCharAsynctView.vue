<template>
  <a-page-header>
    <template #title>
      <h1>生成图表</h1>
    </template>
    <template #subTitle>
      <h2>异步</h2>
    </template>
  </a-page-header>

  <a-alert message="如果发现部分东西无法使用，请升级为vip用户，另外请不要输入奇怪的数据（不然会难受的）" type="warning"
           show-icon/>

  <a-form
      :model="formState"
      layout="horizontal"
      style="max-width: 600px; margin: 20px auto; background: rgba(255, 255, 255, 0.8); padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);"
      @finish="onFinish"
  >
    <a-form-item label="用户需求">
      <a-input v-model:value="formState.goal" placeholder="请输入用户需求"
               style="border: 1px solid #ccc; border-radius: 5px; transition: all 0.3s;"/>
    </a-form-item>
    <a-form-item label="图表名字">
      <a-input v-model:value="formState.name" placeholder="请输入图表名字"
               style="border: 1px solid #ccc; border-radius: 5px; transition: all 0.3s;"/>
    </a-form-item>
    <a-form-item label="图像类型">
      <a-select v-model:value="formState.chartType"
                style="border: 1px solid #ccc; border-radius: 5px; transition: all 0.3s;">
        <a-select-option value="折线图">折线图</a-select-option>
        <a-select-option value="饼图">饼图</a-select-option>
        <a-select-option value="树状图">树状图</a-select-option>
        <a-select-option value="雷达图" :disabled="disabled">雷达图</a-select-option>
        <a-select-option value="散点图" :disabled="disabled">散点图</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="上传资料">
      <a-upload
          style=" border-radius: 10px;"
          action="/chart/gen"
          list-type="picture-card"
          :before-upload="beforeUpload"
          @remove="handleRemove"
      >
        <div style="display: flex; flex-direction: column; align-items: center;
              justify-content: center; color: rgba(194,30,30,0.55);
              font-weight: bold;">
          <PlusOutlined style="font-size: 24px;"/>
          <div style="margin-top: 8px;">Upload</div>
        </div>
      </a-upload>
    </a-form-item>
    <a-form-item label="AI模型">
      <a-select
          v-model:value="formState.aiType"
          style="
                width: 300px;
                border: 1px solid #ccc;
                border-radius: 5px;
                transition: all 0.3s;"
      >
        <a-select-option value="星火AI">星火AI</a-select-option>
        <a-select-option value="智普AI" :disabled="disabled">智普AI</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Button">
      <a-button html-type="submit"
                style="background: linear-gradient(90deg, #f6d365, #fda085); color: white; border: none; border-radius: 5px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); transition: all 0.3s;">
        一键生成
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {reactive, ref} from "vue";
import {ChartControllerService} from "../../generated";
import {message} from "ant-design-vue";
import PlusOutlined from "ant-design-vue";
import {useStore} from "vuex";

const router = useRouter();
const store = useStore();
const userTemplate = store.state.user.loginUser;
const disabled = userTemplate.userRole !== 'vip';

interface FormState {
  name: string;
  chartType: string;
  goal: string;
  csvData: string[];
  aiType: string;
}

const formState = reactive<FormState>({
  name: "",
  chartType: "",
  goal: "",
  csvData: [],
  aiType: "星火AI",
});
/**
 * 阻止默认上传行为
 * @param file
 */
const beforeUpload = (file: File) => {
  console.log("上传文件11", file);
  formState.csvData.push(file);
  // console.log("上传文件22 formState.csvData", formState.csvData);
  // console.log("上传文件10 formState.csvData", formState.csvData[0]);
  return false; // 阻止默认上传行为
};


/**
 * 提交表单
 * @param values
 */
const onFinish = async (values: any) => {
  // console.log('Success:', values);
  if (!formState.csvData || !formState.csvData.length) {
    alert("请先选择要上传的文件");
    return;
  }

  const formData = new FormData();
  formData.append('file', formState.csvData[0]);
  // console.log('formState.csvData[0]:', formState.csvData[0]);
  // console.log('formData.get(\'file\'):', formData.get('file'));

  const initialData = {
    chartType: formState.chartType,
    goal: formState.goal,
    name: formState.name,
    aiType: formState.aiType,
  };

  const res = await ChartControllerService.geChartByAiAsyncMqUsingPost(
      formData.get('file'),
      initialData.aiType,
      initialData.chartType,
      initialData.goal,
      initialData.name,
  );
  if (res.code === 0) {
    message.success("生成成功");
  } else {
    message.error("生成失败");
  }
};

/**
 * 文件删除处理
 * @param file
 */
const handleRemove = (file: File) => {
  const fileUid = file.uid;
  formState.csvData = formState.csvData.filter((item) => item.uid !== fileUid);
}
</script>

<style scoped>
/* 添加按钮悬停效果 */
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
</style>

