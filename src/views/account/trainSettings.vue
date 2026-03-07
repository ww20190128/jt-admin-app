<template>
  <div class="trainSettings-wrap">
    <!-- 返回头部 -->
    <div class="head-warper">
      <div class="left" @click="$router.go(-1)">
        <img src="@/assets/images/icon/back.png" alt="返回" />
      </div>
    </div>

    <!-- 加载中状态 -->
    <div v-if="!isLoaded" class="loading-container">
      <van-loading type="spinner" color="#1989fa" />
      <p class="loading-text">数据加载中...</p>
    </div>

    <!-- 主内容区域（加载完成后显示） -->
    <div v-else class="train-type-list">
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
          <van-tabs
            v-model:active="activeTab[catItem.value]"
            class="type-tabs"
            animated
            @change="handleTabChange(catItem.value)"
          >
            <!-- 显示已选中的数量 -->
            <van-tab
              v-for="typeItem in typeMap"
              :key="`tab-${catItem.value}-${typeItem.value}`"
              :title="`${typeItem.label}(${getSelectedCount(
                catItem.value,
                typeItem.value
              )}/${getTotalCount(catItem.value, typeItem.value)})`"
            >
              <div class="plan-list" :data-tab-id="typeItem.value">
                <!-- 全选复选框 -->
                <van-cell
                  clickable
                  @click="toggleAllSelect(catItem.value, typeItem.value)"
                >
                  <template #icon>
                    <van-checkbox
                      :checked="isAllSelected(catItem.value, typeItem.value)"
                      :indeterminate="
                        isIndeterminate(catItem.value, typeItem.value)
                      "
                    />
                  </template>
                  全选
                </van-cell>

                <van-checkbox-group
                  v-model="selectedPlans[`${catItem.value}-${typeItem.value}`]"
                  @change="handleCheckboxChange(catItem.value, typeItem.value)"
                >
                  <van-cell-group>
                    <!-- 游戏列表 -->
                    <van-cell
                      v-for="plan in getSortedGameListByActiveTab(
                        catItem.value,
                        typeItem.value
                      )"
                      :key="plan.id"
                      clickable
                    >
                      <template #icon>
                        <van-checkbox :name="plan.id" />
                      </template>
                      {{ plan.name }} {{ plan.id }}
                    </van-cell>
                    <!-- 空数据提示 -->
                    <van-cell
                      v-if="
                        getSortedGameListByActiveTab(
                          catItem.value,
                          typeItem.value
                        ).length === 0
                      "
                      disabled
                    >
                      <span class="empty-tip">暂无相关训练方案</span>
                    </van-cell>
                  </van-cell-group>
                </van-checkbox-group>
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </div>

    <!-- 底部确认栏（加载完成后显示） -->
    <div v-if="isLoaded" class="bottom-bar">
      <div class="selected-info">已选方案：{{ totalSelectedPlans }} 个</div>
      <van-button type="primary" size="small" @click="handleConfirm">
        保存方案
      </van-button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { gameList, setPlanGame, getPlan } from "@/api/admin";
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
  Divider,
  Loading,
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
    [Divider.name]: Divider,
    [Loading.name]: Loading,
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
      selectedPlans: {},
      isLoaded: false, // 数据是否加载完成
    });

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

    // 获取倒序排序后的游戏列表
    function getSortedGameListByActiveTab(trainTypeId, tabId) {
      const list = filterGameList(trainTypeId, tabId);
      // 按ID倒序排序，如果有其他排序字段可替换
      return list.sort((a, b) => a.id - b.id);
    }

    // 获取指定Tab下的总数量
    function getTotalCount(trainTypeId, tabId) {
      return getSortedGameListByActiveTab(trainTypeId, tabId).length;
    }

    // 获取指定Tab下已选中的数量
    function getSelectedCount(trainTypeId, tabId) {
      const key = `${trainTypeId}-${tabId}`;
      return state.selectedPlans[key] ? state.selectedPlans[key].length : 0;
    }

    // 判断是否全选
    function isAllSelected(trainTypeId, tabId) {
      const key = `${trainTypeId}-${tabId}`;
      const total = getTotalCount(trainTypeId, tabId);
      const selected = getSelectedCount(trainTypeId, tabId);
      return total > 0 && selected === total;
    }

    // 判断是否半选（部分选中）
    function isIndeterminate(trainTypeId, tabId) {
      const key = `${trainTypeId}-${tabId}`;
      const total = getTotalCount(trainTypeId, tabId);
      const selected = getSelectedCount(trainTypeId, tabId);
      return selected > 0 && selected < total;
    }

    // 全选/取消全选
    function toggleAllSelect(trainTypeId, tabId) {
      const key = `${trainTypeId}-${tabId}`;
      const list = getSortedGameListByActiveTab(trainTypeId, tabId);
      const allIds = list.map((item) => item.id);

      if (isAllSelected(trainTypeId, tabId)) {
        // 取消全选
        state.selectedPlans[key] = [];
      } else {
        // 全选
        state.selectedPlans[key] = allIds;
      }
    }

    // 复选框变更事件
    function handleCheckboxChange(trainTypeId, tabId) {
      // 触发更新，可添加额外逻辑
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

    // 初始化选中方案对象（从getPlan接口获取已选数据）
    async function initSelectedPlans() {
      try {
        // 1. 初始化空的选中状态
        state.cats.forEach((catItem) => {
          state.typeMap.forEach((typeItem) => {
            const key = `${catItem.value}-${typeItem.value}`;
            state.selectedPlans[key] = [];
          });
        });

        // 2. 调用getPlan接口获取已选数据
        const { data } = await getPlan({ id: id });

        // 3. 处理返回的train_plan数据
        if (data?.train_plan && Array.isArray(data.train_plan)) {
          data.train_plan.forEach((planItem) => {
            const { id, course_id, course_games } = planItem;

            // 只处理有游戏列表且course_id有效的数据
            if (
              course_id &&
              Array.isArray(course_games) &&
              course_games.length
            ) {
              // 找到对应训练类型的默认子类型（游戏：0）
              // 如果需要匹配其他子类型，可根据业务规则调整
              const defaultSubType = 0;
              const key = `${course_id}-${defaultSubType}`;

              // 合并已选中的游戏ID（去重）
              if (state.selectedPlans[key]) {
                const uniqueGames = [
                  ...new Set([...state.selectedPlans[key], ...course_games]),
                ];
                state.selectedPlans[key] = uniqueGames;
              }
            }
          });
        }
      } catch (error) {
        console.warn("初始化选中状态失败：", error);
        // 即使获取失败，也保证选中状态对象存在
        state.cats.forEach((catItem) => {
          state.typeMap.forEach((typeItem) => {
            const key = `${catItem.value}-${typeItem.value}`;
            if (!state.selectedPlans[key]) {
              state.selectedPlans[key] = [];
            }
          });
        });
      }
    }

    // 初始化数据
    async function init() {
      try {
        // 先标记为未加载
        state.isLoaded = false;

        // 并行加载游戏列表和已选方案数据
        const [gameListRes] = await Promise.all([
          gameList({ ...state.query, id }),
          initSelectedPlans(), // 初始化选中状态
        ]);

        // 处理游戏列表数据
        state.gameList = gameListRes?.data?.list || [];

        // 标记加载完成
        state.isLoaded = true;
      } catch (error) {
        state.gameList = [];
        state.isLoaded = true; // 即使失败也显示页面
        Toast.fail(error.message || "数据加载失败");
      }
    }

    // 确认按钮逻辑
    async function handleConfirm() {
      if (totalSelectedPlans.value === 0) {
        Toast.warning("请至少选择一个训练方案");
        return;
      }

      // 转换为指定的参数格式
      const course_games = [];
      Object.entries(state.selectedPlans).forEach(([key, planIds]) => {
        if (planIds.length > 0) {
          // 解析key：格式为 "训练类型ID-子类型ID"
          const [trainTypeId, tabId] = key.split("-").map(Number);
          const combinedId = trainTypeId * 10 + tabId; // 示例：1-0 → 10，2-3 → 23

          course_games.push({
            id: combinedId, // 组合后的ID
            games: planIds.map(Number), // 确保games数组中的值都是数字类型
          });
        }
      });

      console.log("转换后的course_games参数：", course_games);

      try {
        await setPlanGame({
          member_id: Number(id),
          course_games: course_games, // 使用新格式的参数
        });
        Toast.success("方案保存成功");
        router.go(-1);
      } catch (error) {
        Toast.fail(error.message || "方案保存失败");
      }
    }

    onMounted(() => {
      init();
    });

    return {
      ...toRefs(state),
      totalSelectedPlans,
      getSortedGameListByActiveTab,
      getTotalCount,
      getSelectedCount,
      isAllSelected,
      isIndeterminate,
      toggleAllSelect,
      toggleExpand,
      handleTabChange,
      handleCheckboxChange,
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

  // 加载中样式
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;

    .loading-text {
      margin-top: 16px;
      font-size: 14px;
      color: #999;
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

    // Tab标题样式优化
    :deep(.van-tab__text) {
      font-size: 14px;
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

    // 空数据提示样式
    .empty-tip {
      color: #999;
      font-size: 14px;
      display: block;
      text-align: center;
      width: 100%;
      padding: 20px 0;
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