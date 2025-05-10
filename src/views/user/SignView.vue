<template>
  <a-page-header
      title="返回主页"
      sub-title="签到"
      @back="router.push('/')"
  />
  <a-card
      hoverable
      :style="{
      width: '380px',
      margin: '0 auto',
      borderRadius: '12px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden'
    }"
  >
    <!-- 顶部装饰线 -->
    <img src="https://tse4-mm.cn.bing.net/th/id/OIP-C.niyZlA-T6k2IKMgtTcrXZwHaEK?rs=1&pid=ImgDetMain"
         style=" width: 100%;">


    <div style="padding: 20px; position: relative; z-index: 2">
      <!-- 日历容器 -->
      <div style="
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 8px;
        padding: 16px;
        position: relative;
      ">
        <a-calendar
            v-model:value="value"
            :fullscreen="false"
            :disabledDate="disabledDate"
            @select="onSelect"
            :headerStyle="{
              //隐藏头部操作栏
              border: 'none',
              padding: '0',
              minHeight: 'auto'
            }"
            :panelStyle="{
            fontSize: '14px',
            background: 'transparent',
            //隐藏单元格切换按钮
            'th': {display: 'none'}
          }"
        >
          <!-- 自定义空头部 -->
          <template #headerRender>
            <div style="padding: 10px">
              <div style="margin-bottom: 10px; text-align: center">
                <span style="font-weight: bold">签到表</span>
              </div>
            </div>
          </template>
          <template #dateCellRender="{ current }">
            <div v-for="item in dateCellRender(current)" :key="item.content">
              <component v-if="item.icon" :is="item.icon"/>
            </div>
          </template>
        </a-calendar>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import {Dayjs} from 'dayjs';
import dayjs from 'dayjs';
import {ref, computed, watch, onMounted} from "vue";
import {CheckCircleFilled, CloseCircleFilled, CloseCircleOutlined} from "@ant-design/icons-vue";
import {message} from "ant-design-vue";
import {UserControllerService} from "../../../generated";
import {useRouter} from "vue-router";
import {useStore} from "vuex";

const value = ref<Dayjs>();
const store = useStore();
const userSignRecords = ref([]);
const router = useRouter();

/**
 * 禁用签到前的日期
 * @param current
 */
const disabledDate = (current: Dayjs) => {
  // 不可以选择签到前的日期
  return (current < dayjs().startOf('day'));
};

/**
 * 签到功能
 * @param date
 */
const onSelect = async (date: Dayjs) => {
  const today = dayjs();
  const selectDay = date.format('YYYY-MM-DD');//当前日期
  if (date.isAfter(today)) {
    message.warn('无法超前签到');
    return;
  }
  if (!userSignRecords.value.includes(selectDay)) {
    //还没有签到
    const res = await UserControllerService.signUsingPost();
    if (res.code === 0) {
      message.success('签到成功');
      store.commit('user/updateLoginUserScore',res.data);
    }else {
      message.error('签到失败');
    }
  } else {
    // console.log(`今天已经签到过了: ${formattedDate}`)
    message.warn('今天已经签到过了');
  }
};
/**
 * 渲染日期表格
 * @param current
 */
const dateCellRender = (current: Dayjs) => {
  const day = current.format('YYYY-MM-DD');
  let listData;
  // 是否完成签到
  if (!userSignRecords.value.includes(day)) {
    listData = [{
      type: 'fail',
      content: '失败',
      icon: CloseCircleFilled
    }];
  } else {
    listData = [{
      type: 'success',
      content: '成功',
      icon: CheckCircleFilled
    }];
  }
  return listData || [];
};

/**
 * 初始化签到记录
 */
const initSignRecords = async () => {
  const res = await UserControllerService.getSignRecordsUsingGet();
  if (res.code === 0) {
    userSignRecords.value = res.data;
    // console.log(userSignRecords.value);
  }
}
onMounted(() => {
  initSignRecords();
});
</script>

<style scoped>

</style>