<template>
  <a-page-header title="图表管理页面(管理员)"/>
  <a-table
      :columns="columns"
      :data-source="data"
      :pagination="{
        current: formData.current,
        pageSize: formData.pageSize,
        total: total,
        onChange: change
      }"
  >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'id'">
        {{ column.title }}
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        {{ record.name }}
      </template>
      <template v-if="column.key === 'goal'">
        {{ record.goal }}
      </template>
      <template v-if="column.key === 'status'">
        <span>
          <a-tag
              :color="record.status === 'succeed' ? 'blue' : 'red'"
              :bordered="false">
            {{ record.status }}
          </a-tag>
        </span>
      </template>
      <template v-if="column.key === 'genChart'">
        {{ record.genChart }}
      </template>
      <template v-if="column.key === 'genResult'">
        {{ record.genResult }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-space>
          <a-button type="link" @click="showModal(record)">更新</a-button>
          <a-divider type="vertical"/>
          <a-button type="link" style="color: red" @click="isDelete(record?.id)">删除</a-button>
        </a-space>
      </template>
    </template>
  </a-table>

  <!--  修改弹出框的内容-->
  <a-modal v-model:open="open" width="1000px" title="图表内容" ok-text="提交" cancel-text="取消" @ok="handleOk">
    <a-form
        :model="formData"
        ref="formRef"
        :rules="rules"
        :confirm-loading="confirmLoading"
    >
      <a-form-item label="分析目标">
        <a-input
            v-model:value="formState.chartGoal" placeholder="请输入分析目标"/>
      </a-form-item>
      <a-form-item label="图表名称">
        <a-input v-model:value="formState.ChartName" placeholder="请输入图表名称"/>
      </a-form-item>
      <a-form-item label="分析的数据">
        <a-textarea v-model:value="formState.ChartData"
                    :maxlength="500"
                    :row="30"
                    :showCount="true"
                    placeholder="请输入要分析的数据（500字以内）"/>
      </a-form-item>
      <a-form-item label="图表类型">
        <a-select v-model:value="formState.ChartType">
          <a-select-option value="折线图">折线图</a-select-option>
          <a-select-option value="饼图">饼图</a-select-option>
          <a-select-option value="树状图">树状图</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
  <!--  是否确认删除-->
  <a-modal
      v-model:open="deleteOpen"
      ok-text="确认删除"
      cancel-text="取消删除"
      :closable="false"
      :cancel-button-props="{
        style: {
          backgroundColor: '#87CEFA'
        }
      }"
      :ok-button-props="{
        style: {
          backgroundColor: 'red'
        }
      }"
      @ok="deleteChart"
  >
    <template #title>
      是否删除
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import {onMounted, ref, watchEffect} from "vue";
import {Chart, ChartControllerService} from "../../../generated";
import {message} from "ant-design-vue";

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '目标',
    dataIndex: 'goal',
    key: 'goal',
  },
  {
    title: '类型',
    dataIndex: 'chartType',
    key: 'chartType',
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
  },
  {
    title: '图表配置',
    dataIndex: 'genChart',
    key: 'genChart',
  },
  {
    title: '生成结果',
    dataIndex: 'genResult',
    key: 'genResult',
  },
  {
    title: '创作者',
    dataIndex: 'userId',
    key: 'userId',
  },
  {
    title: '操作',
    key: 'action',
  },
];

const data = ref<Chart[]>([]);
const formData = ref({
  pageSize: 5,
  current: 1,
});
const total = ref(3);

/***
 * 初始化数据
 */
const initData = async () => {
  const res = await ChartControllerService.listChartByPageUsingPost({
    sortField: "updateTime",
    sortOrder: "desc",
    ...formData.value
  });
  if (res.code === 0) {
    data.value = res.data.records;
    total.value = res.data.total;
  }
};

/**
 * 分页
 * @param current
 * @param pageSize
 */
const change = (current: number, pageSize: number) => {
  console.log(current, pageSize)
  formData.value = {
    ...formData.value,
    current
  }
};

/**
 * 监听 initData 数据
 */
watchEffect(() => {
  initData();
})

const chartId = ref(0);
/**
 * 显示删除框架，防止误删
 */
const deleteOpen = ref(false);
const isDelete = (id: number) => {
  deleteOpen.value = true;
  chartId.value = id;
}

/**
 * 删除图表
 */
const deleteChart = async () => {
  const res = await ChartControllerService.deleteChartUsingPost({
    id: chartId.value
  });
  if (res.code === 0) {
    deleteOpen.value = false;
    message.success('删除成功');
    await initData();
  } else {
    deleteOpen.value = false;
    message.error('删除失败');
  }
}

const formRef = ref();
const formState = ref({
  chartGoal: '',
  ChartName: '',
  ChartData: '',
  ChartType: ''
});

//修改表单校验规则
const rules = {
  chartGoal: [
    {required: true, message: '请输入分析目标', trigger: 'blur'},
  ],
  ChartName: [
    {required: true, message: '请输入图表名称', trigger: 'blur'},
  ],
  ChartData: [
    {required: true, message: '请输入要分析的数据', trigger: 'blur'},
  ],
  ChartType: [
    {required: true, message: '请选择图表类型', trigger: 'change'},
  ],
};

/**
 * 显示修改框
 */
const open = ref<boolean>(false);
const showModal = (record: Chart) => {
  open.value = true;
  chartId.value = record.id;
  formState.value = {
    chartGoal: record.goal || '',
    ChartName: record.name || '',
    ChartData: record.chartData || '',
    ChartType: record.chartType || ''
  }
};

const confirmLoading = ref<boolean>(false); //控制确认框的加载状态，配合异步关闭
/**
 * 确认修改
 */
const handleOk = async () => {
  await formRef.value.validate();
  // 异步关闭 不管请求是否成功，两秒内关闭窗口
  confirmLoading.value = true;
  setTimeout(() => {
    open.value = false;
    confirmLoading.value = false;
  }, 2000);
  const res = await ChartControllerService.retryChartUsingPost({
    id: chartId.value,
    goal: formState.value.chartGoal,
    name: formState.value.ChartName,
    chartData: formState.value.ChartData,
    chartType: formState.value.ChartType
  });

  if (res.code === 0) {
    await initData();
    message.success('修改成功');
  } else {
    open.value = false;
    message.error('修改失败');
  }
};

/**
 * 页面加载时调用 initData
 */
onMounted(() => {
  initData();
});
</script>

<style scoped>
</style>