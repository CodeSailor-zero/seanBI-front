<template>
  <a-input-search
      v-model:value="searchConfig.name"
      placeholder="请输入搜索内容，默认搜索所有"
      enter-button
      @search="onSearch"
  />
  <a-page-header>
    <template #title>
      用户图表展示
    </template>
  </a-page-header>
  <a-list item-layout="horizontal"
          :data-source="chartList"
          :pagination="{
              total: total,
              pageSize: searchConfig.pageSize,
              current: searchConfig.current,
              onChange: change
          }"
  >
    <template #renderItem="{item, index}">
      <a-list-item>
        <a-list-item-meta>
          <template #title>
            <h2 style="font-weight: bold;color: #fda085">图表名称：{{ item?.name }}</h2>
          </template>
          <template #description>
            <div class="chart-container">
              <!-- 将 ref 绑定到外层 div -->
              <div
                  v-if="item?.genChart"
                  :ref="(el) => { if (el) chartRefs[item.id] = el }">
                <v-charts :options="JSON.parse(item?.genChart)"/>
              </div>
              <div v-else class="chart-empty">
                <FileExclamationTwoTone  class="chart-empty-icon"/>
                <div class="chart-empty-text">暂无图表数据</div>
              </div>
            </div>
            <!-- 添加图表评论区域 -->
            <h4 style="font-weight: bold;color: #d94b4b">结论</h4>
            <div class="chart-comments">
              <ul>
                <li v-if="item?.genResult && item?.genResult.length > 0">
                  <span style="font-weight: bold;color: dodgerblue">{{ item?.genResult }}</span>
                </li>
                <li v-else class="chart-empty">
                  <ContainerTwoTone  class="chart-empty-icon"/>
                  <div class="chart-empty-text">暂无图表评论</div>
                </li>
              </ul>
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ChartControllerService} from "../../generated";
import {nextTick, onMounted, ref, watchEffect} from "vue";
import * as echarts from 'echarts';
import {FileExclamationTwoTone,ContainerTwoTone} from "@ant-design/icons-vue";

const router = useRouter();
const route = useRoute();
const id = route.query.id// 获取从管理页面传递的id
const total = ref(10);
const searchConfig = ref({
  pageSize: 4,
  current: 1,
  name: '',
});
const chartList = ref([]);

/**
 * 初始化数据
 */
const initData = async () => {
  const res = await ChartControllerService.listMyChartByPageUsingPost(searchConfig.value);
  if (res.code === 0) {
    console.log("res.data.records", res.data?.records)
    chartList.value = res.data?.records;
    total.value = res.data?.total;
    console.log("chartList.value", chartList.value)
  } else {
    console.log("失败", res.data?.records);
  }
}

const chartRefs = ref<{ [key: string]: HTMLElement }>({}); // 修改为对象，使用 item.id 作为键

/**
 * 初始化图表
 */
const initCharts = () => {
  nextTick(() => {
    setTimeout(() => {
      chartList.value.forEach((item) => {
        const chartRef = chartRefs.value[item.id];
        if (chartRef) {
          const chartInstance = echarts.init(chartRef);
          const options = JSON.parse(item?.genChart || '{}');
          if (Object.keys(options).length > 0) {
            chartInstance.setOption(options);
            chartInstance.resize(); // 强制图表自适应
          }
        }
      });
    }, 300);
  });
};

/**
 * 监听 pageConfig.current 变化，重新加载数据
 */
watchEffect(() => {
  void initData().then(initCharts); // 确保先加载数据再初始化图表
});

/**
 * 切换分页
 * @param page
 */
const change = (page: number) => {
  searchConfig.value = {
    ...searchConfig.value,
    current: page
  }
}

/**
 * 搜索图表
 */
const onSearch = (searchText: string) => {
  searchConfig.value = {
    ...searchConfig.value,
    name: searchText
  }
}

onMounted(() => {
  void initData().then(initCharts); // 同样确保先加载数据再初始化图表
});
</script>

<style scoped>
.chart-container {
  margin-bottom: 20px;
  width: 100%;
  height: 400px; /* 外层容器高度 */
  overflow-x: hidden; /* 隐藏横向滚动条 */
  overflow-y: auto; /* 保留纵向滚动条 */
  border: 1px solid #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* 内部图表容器 */
.chart-container > div {
  height: 100%; /* 继承外层容器高度 */
  min-height: 400px; /* 防止内容不足时高度塌陷 */
  padding: 0; /* 清除内边距 */
  margin: 0; /* 清除外边距 */
}


.chart-comments {
  margin-top: 10px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.chart-comments h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #d94b4b;
}

.chart-comments ul {
  list-style-type: none;
  padding: 0;
}

.chart-comments li {
  margin-bottom: 5px;
  padding-left: 10px; /* 缩进 */
  position: relative;
}

.chart-comments li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: dodgerblue;
}

.chart-empty {
  display: flex; /* 默认隐藏 */
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fafafa; /* 更柔和的背景色 */
  border-radius: 8px; /* 与容器保持一致 */
  z-index: 10; /* 确保覆盖图表内容 */
}

/* 当没有图表时显示 */
.chart-container:not(:has(.v-charts)) .chart-empty {
  display: flex;
}

.chart-empty-icon {
  font-size: 48px;
  color: #ccc;
  margin-bottom: 10px;
}

.chart-empty-text {
  font-size: 14px;
  color: #999;
}


/*全局样式优化*/
@media (max-width: 768px) {
  .chart-container {
    min-height: 200px;
    max-height: 400px;
  }

  .chart-comments {
    padding: 10px;
  }

  .chart-comments h4 {
    font-size: 14px;
  }

  .chart-comments li {
    font-size: 12px;
  }
}

/* 全局样式 */
.ant-list-item {
  min-width: auto !important;
}
</style>