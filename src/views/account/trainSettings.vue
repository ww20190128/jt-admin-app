<template>
  <div class="trainSettings-wrap">
    <div class="head-warper">
      <div class="left" @click="$router.go(-1)">
        <img src="@/assets/images/icon/back.png" alt="返回" />
      </div>
    </div>

    <div class="train-type-list">
      <div v-for="catItem in cats" :key="catItem.value" class="train-type-item">
        <div class="train-type-header" @click="toggleExpand(catItem.value)">
          <span class="train-type-name">{{ catItem.label }}</span>
          <van-icon
            :name="
              expandedTypeIds.includes(catItem.value)
                ? 'arrow-up'
                : 'arrow-down'
            "
            class="expand-icon"
          />
        </div>

        <div
          v-if="expandedTypeIds.includes(catItem.value)"
          class="train-type-content"
        >
          <!-- 核心修复1：移除sticky/scrollspy避免渲染异常，添加animated提升切换体验 -->
          <van-tabs
            v-model:active="activeTab[catItem.value]"
            class="type-tabs"
            animated
            @change="handleTabChange(catItem.value)"
          >
            <van-tab
              v-for="typeItem in typeMap"
              :key="`tab-${catItem.value}-${typeItem.value}`"
              :title="typeItem.label + ' (' + typeItem.value + ')'"
            >
              <!-- 核心修复2：强制设置Tab内容高度，避免样式错位 -->
              <div class="plan-list" :data-tab-id="typeItem.value">
                <van-checkbox-group
                  v-model="selectedPlans[`${catItem.value}-${typeItem.value}`]"
                >
                  <van-cell-group>
                    <van-cell
                      v-for="plan in getGameListByActiveTab(
                        catItem.value,
                        typeItem.value
                      )"
                      :key="plan.id"
                      clickable
                    >
                      <template #icon>
                        <van-checkbox :name="plan.id" />
                      </template>
                      {{ plan.name }}
                    </van-cell>
                    <!-- <div
                      v-if="getGameListByActiveTab(catItem.value).length === 0"
                      class="plan-empty-tip"
                    >
                      暂无相关方案
                    </div> -->
                  </van-cell-group>
                </van-checkbox-group>
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </div>

    <!-- 底部确认栏 -->
    <div class="bottom-bar">
      <div class="selected-info">已选方案：{{ totalSelectedPlans }} 个</div>
      <van-button type="primary" size="small" @click="handleConfirm">
        确认
      </van-button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { gameList } from "@/api/admin";
import {
  Toast,
  Checkbox,
  CheckboxGroup,
  Cell,
  CellGroup,
  Tabs,
  Tab,
  Icon,
  Button,
} from "vant";

export default {
  name: "TrainSettings",
  components: {
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Icon.name]: Icon,
    [Button.name]: Button,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { id } = route.query;

    const state = reactive({
      query: { pageSize: 10000, pageIndex: 1, status: 2, type: -1, id },
      gameList: [],
      // 激活的Tab：{ 训练类型ID: 子类型ID }
      activeTab: {},
      // 训练类型分类
      cats: [
        { label: "刺激训练", value: 1 },
        { label: "变频红光", value: 2 },
        { label: "Gabor视觉", value: 3 },
        { label: "拥挤", value: 5 },
        { label: "精细", value: 6 },
        { label: "脱抑制", value: 7 },
        { label: "旁中心", value: 8 },
        { label: "同时视觉", value: 9 },
        { label: "双眼融合", value: 10 },
        { label: "立体视觉", value: 11 },
        { label: "晶体调节", value: 12 },
        { label: "眼肌", value: 13 },
      ],
      // 子类型映射
      typeMap: [
        { label: "游戏", value: 0 },
        { label: "启蒙", value: 2 },
        { label: "视频", value: 3 },
      ],
      // 展开的训练类型ID列表
      expandedTypeIds: [],
      // 选中的方案：{ "trainTypeId-tabId": [planId1, planId2] }
      selectedPlans: {},
      // 标记数据是否加载完成
      isLoaded: false,
    });

    // 缓存游戏列表结果：{ "trainTypeId-tabId": [] }
    const gameListCache = {};

    // 计算已选方案总数
    const totalSelectedPlans = computed(() => {
      let count = 0;
      Object.values(state.selectedPlans).forEach((planIds) => {
        count += Array.isArray(planIds) ? planIds.length : 0;
      });
      return count;
    });

    // 筛选当前激活Tab的游戏列表
    function filterGameList(trainTypeId, tabId) {
      const trainTypeIdNum = Number(trainTypeId);
      const tabIdNum = Number(tabId);

      if (!state.gameList.length || isNaN(trainTypeIdNum) || isNaN(tabIdNum)) {
        return [];
      }

      return state.gameList.filter((item) => {
        return (
          Array.isArray(item.cats) &&
          item.cats.includes(trainTypeIdNum) &&
          item.type === tabIdNum
        );
      });
    }

    function getGameListByActiveTab(trainTypeId, tabId) {
      return filterGameList(trainTypeId, tabId);
    }

    // Tab切换时更新缓存
    function handleTabChange(trainTypeId) {
      const tabId = state.activeTab[trainTypeId];
      const cacheKey = `${trainTypeId}-${tabId}`;
      delete gameListCache[cacheKey];
    }

    // 切换训练类型展开/折叠
    function toggleExpand(typeId) {
      const index = state.expandedTypeIds.findIndex((id) => id === typeId);
      if (index > -1) {
        state.expandedTypeIds.splice(index, 1);
      } else {
        state.expandedTypeIds.push(typeId);
        if (state.activeTab[typeId] === undefined) {
          state.activeTab[typeId] = 0;
          const cacheKey = `${typeId}-0`;
          gameListCache[cacheKey] = filterGameList(typeId, 0);
        }
      }
    }

    // 初始化选中方案对象
    function initSelectedPlans() {
      state.cats.forEach((catItem) => {
        state.typeMap.forEach((typeItem) => {
          const key = `${catItem.value}-${typeItem.value}`;
          if (!state.selectedPlans[key]) {
            state.selectedPlans[key] = [];
          }
        });
      });
    }

    // 初始化数据
    async function init() {
      try {
        const { data } = await gameList({ ...state.query, id });
        state.gameList = data?.list || [];
        state.isLoaded = true;
        initSelectedPlans();
        Toast.success("数据加载成功");
      } catch (error) {
        console.error("初始化失败：", error);
        state.gameList = [];
        state.isLoaded = true;
        Toast.fail("数据加载失败，请重试");
      }
    }

    // 确认按钮逻辑
    function handleConfirm() {
      if (totalSelectedPlans.value === 0) {
        Toast.warning("请至少选择一个训练方案");
        return;
      }

      const selectedData = {};
      Object.entries(state.selectedPlans).forEach(([key, planIds]) => {
        if (planIds.length > 0) {
          selectedData[key] = planIds;
        }
      });

      console.log("选中的训练方案：", selectedData);
      Toast.success(`已确认选择 ${totalSelectedPlans.value} 个训练方案`);
    }

    onMounted(() => {
      init();
    });

    return {
      ...toRefs(state),
      totalSelectedPlans,
      getGameListByActiveTab,
      toggleExpand,
      handleTabChange,
      handleConfirm,
    };
  },
};
</script>

<style lang="less" scoped>
.trainSettings-wrap {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 60px;

  .head-warper {
    position: relative;
    width: 100%;
    height: 40px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    align-items: center;
    background: #fff;

    .left {
      cursor: pointer;
    }

    img {
      height: 20px;
    }
  }
}

.train-type-list {
  padding: 12px;
}

.train-type-item {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
}

.train-type-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;

  .train-type-name {
    flex: 1;
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-left: 8px;
  }

  .expand-icon {
    color: #969799;
    font-size: 16px;
  }
}

.train-type-content {
  padding: 0;

  .type-tabs {
    // 核心修复3：重置Tabs样式，避免层叠错位
    :deep(.van-tabs) {
      --van-tabs-default-color: #1989fa;
      --van-tabs-line-height: 44px;
    }

    :deep(.van-tabs__wrap) {
      background-color: #fff;
      position: relative; // 修复定位异常
      z-index: 1;
    }

    :deep(.van-tabs__content) {
      // 核心修复4：强制隐藏非激活Tab内容，避免视觉重叠
      overflow: hidden;
      height: auto !important;
    }

    :deep(.van-tab__pane) {
      // 核心修复5：确保每个Tab面板独立渲染，无样式共享
      position: relative;
      z-index: 2;
      padding: 8px 0;
      box-sizing: border-box;
    }

    // 激活的Tab标题样式
    :deep(.van-tab--active) {
      color: #1989fa;
      font-weight: 500;
    }
  }

  .plan-list {
    // 核心修复6：固定Tab内容容器样式，避免高度塌陷
    padding: 8px 16px;
    min-height: 100px;
    box-sizing: border-box;

    .tab-label {
      display: block;
      font-size: 15px;
      font-weight: 500;
      color: #333;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f5f5f5;
    }

    .plan-empty-tip {
      padding: 20px 0;
      text-align: center;
      color: #999;
      font-size: 13px;
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 99;

  .selected-info {
    font-size: 14px;
    color: #666;
  }
}
</style>