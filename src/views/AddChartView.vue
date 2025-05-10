<template>
  <a-page-header>
    <template #title>
      <h1>生成图表</h1>
    </template>
    <template #subTitle>
      <h2>同步</h2>
    </template>
  </a-page-header>

  <a-alert message="如果发现部分东西无法使用，请升级为vip用户，另外请不要输入奇怪的数据（不然会难受的）" type="warning"
           show-icon/>

  <a-row :gutter="[16, 16]" style="max-width: 1200px; margin: 20px auto;">
    <!-- 左侧：输入框 -->
    <a-col :span="12">
      <a-form
          :model="formState"
          layout="horizontal"
          style="background: rgba(255, 255, 255, 0.8); padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);"
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
                    style="width: 300px;border: 1px solid #ccc; border-radius: 5px; transition: all 0.3s;">
            <a-select-option value="折线图">折线图</a-select-option>
            <a-select-option value="饼图">饼图</a-select-option>
            <a-select-option value="柱状图">柱状图</a-select-option>
            <a-select-option value="雷达图" :disabled="disabled">雷达图</a-select-option>
            <a-select-option value="散点图" :disabled="disabled">散点图</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="上传资料">
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
                    style="background: linear-gradient(90deg, #f6d365, #fda085); color: white; border: none; border-radius: 5px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); transition: all 0.3s;"
                    :loading="loading"
          >
            一键生成
          </a-button>
        </a-form-item>
      </a-form>
    </a-col>

    <!-- 右侧：图表展示区域 -->
    <a-col :span="12">
      <div v-if="generatedChart" class="chart-section"
           style="background: rgba(255, 255, 255, 0.8); padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);width: 100%;height: 400px">
        <h3>生成的图表</h3>
        <v-charts v-if="generatedChart"
                  :options="JSON.parse(generatedChart)"
                  autoresize
        />
        <!-- 图表描述区域 -->
        <div v-if="chartDescription" class="chart-description" style="margin-top: 20px;">
          <h4>图表描述</h4>
          <p>{{ chartDescription }}</p>
        </div>
      </div>
    </a-col>
  </a-row>
</template>


<script setup lang="ts">
import {useRouter} from "vue-router";
import {nextTick, reactive, ref} from "vue";
import {ChartControllerService} from "../../generated";
import {message} from "ant-design-vue";
import {PlusOutlined} from '@ant-design/icons-vue';
import VCharts from "vue-echarts";
import {useStore} from "vuex";

const router = useRouter();
const store = useStore();
const userTemplate = store.state.user.loginUser;
const disabled = userTemplate.userRole !== "vip";

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

const generatedChart = ref<string | null>(null);
const chartDescription = ref<string | null>(null);

/**
 * 文件上传前处理，拦截文件上传，将文件添加到 formState.csvData 中。
 * @param file
 */
const beforeUpload = (file: File) => {
  // console.log("上传文件11", file);
  formState.csvData.push(file);
  return false; // 阻止默认上传行为
};

const loading = ref(false);
const chartRef = ref<InstanceType<typeof VCharts> | null>(null);
/**
 * 表单提交处理
 * @param values
 */
const onFinish = async (values: any) => {
  if (!formState.csvData || !formState.csvData.length) {
    alert("请先选择要上传的文件");
    return;
  }

  const formData = new FormData();
  formData.append('file', formState.csvData[0]);

  const initialData = {
    chartType: formState.chartType,
    goal: formState.goal,
    name: formState.name,
    aiType: formState.aiType,
  };
  loading.value = true;// 显示加载动画
  const res = await ChartControllerService.geChartByAiUsingPost(
      formData.get('file'),
      initialData.aiType,
      initialData.chartType,
      initialData.goal,
      initialData.name,
  )
  if (res.code === 0) {
    message.success("生成成功");
    // 假设生成的图表是一个图片链接和描述文本
    await nextTick(() => {
      generatedChart.value = res.data.genChart;
      chartDescription.value = res.data.genResult;
      console.log("生成的图表数据 setTimeout", generatedChart.value);

      // 强制刷新图表
      if (chartRef.value) {
        chartRef.value.resize();
      }
    })
    loading.value = false;
    console.log("生成的图表数据", generatedChart.value)
  } else {
    loading.value = false;
    message.error("生成失败");
  }
}

/**
 * 文件删除处理
 * @param file
 */
const handleRemove = (file: File) => {
  const fileUid = file.uid;
  formState.csvData = formState.csvData.filter((item) => item.uid !== fileUid);
}
</script>

<style scoped>/* 添加按钮悬停效果 */
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
