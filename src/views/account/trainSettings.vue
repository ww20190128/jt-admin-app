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

        <!-- 修复：item.value → catItem.value -->
        <div
          v-if="expandedTypeIds.includes(catItem.value)"
          class="train-type-content"
        >
          <van-tabs
            v-model:active="activeTab[catItem.value]"
            class="type-tabs"
            sticky
            scrollspy
          >
            <van-tab
              v-for="typeItem in typeMap"
              :key="typeItem.value"
              :title="typeItem.label"
            >
              <div class="plan-list">
                <!-- 修复：仅渲染当前激活Tab，优化渲染性能 -->
                <template
                  v-if="activeTab[catItem.value] === Number(typeItem.value)"
                >
                  <van-checkbox-group
                    v-model="
                      selectedPlans[`${catItem.value}-${typeItem.value}`]
                    "
                  >
                    <van-cell-group>
                      <!-- 空数据提示 -->
                      <div
                        v-if="
                          getCachedGameList(catItem.value, typeItem.value)
                            .length === 0
                        "
                        class="plan-empty-tip"
                      >
                        暂无相关训练方案
                      </div>
                      <van-cell
                        v-for="plan in getCachedGameList(
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
                    </van-cell-group>
                  </van-checkbox-group>
                </template>
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
import { reactive, toRefs, onMounted, computed, shallowRef } from "vue";
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
      query: { pageSize: 10000, pageIndex: 1, status: 2, type: -1, id }, // 修复：添加id参数
      gameList: [],
      // 修复：初始化activeTab，默认选中第一个Tab（游戏）
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
      // 新增：标记数据是否加载完成
      isLoaded: false,
    });

    // 缓存游戏列表结果：{ "trainTypeId-tabId": [] }
    const gameListCache = shallowRef({});
    // 新增：缓存更新时间戳，替代不规范的_updated属性
    const cacheUpdateTime = shallowRef(0);

    // 计算已选方案总数
    const totalSelectedPlans = computed(() => {
      let count = 0;
      Object.values(state.selectedPlans).forEach((planIds) => {
        count += Array.isArray(planIds) ? planIds.length : 0;
      });
      return count;
    });

    // 修复：筛选游戏列表逻辑，移除错误的flatMap
    function filterGameList(trainTypeId, tabId) {
      if (!state.gameList.length || !trainTypeId || tabId === undefined)
        return [];

      return state.gameList.filter((item) => {
        // 全部类型显示所有匹配trainTypeId的项
        if (Number(tabId) === -1) {
          return item.cats?.includes(Number(trainTypeId));
        }
        // 指定类型需同时匹配类型和分类
        return (
          item.type === Number(tabId) &&
          item.cats?.includes(Number(trainTypeId))
        );
      });
    }

    // 带缓存的游戏列表获取方法（修复缓存逻辑）
    function getCachedGameList(trainTypeId, tabId) {
      if (!trainTypeId || tabId === undefined) return [];

      const cacheKey = `${trainTypeId}-${tabId}`;
      // 缓存不存在/数据已更新时重新计算
      if (!gameListCache.value[cacheKey] || cacheUpdateTime.value > 0) {
        gameListCache.value[cacheKey] = filterGameList(trainTypeId, tabId);
      }
      return gameListCache.value[cacheKey] || [];
    }

    // 切换训练类型展开/折叠
    function toggleExpand(typeId) {
      const index = state.expandedTypeIds.findIndex((id) => id === typeId);
      if (index > -1) {
        state.expandedTypeIds.splice(index, 1);
      } else {
        state.expandedTypeIds.push(typeId);
        // 修复：初始化Tab激活状态为"游戏"（value=0）
        if (state.activeTab[typeId] === undefined) {
          state.activeTab[typeId] = 0;
        }
      }
    }

    // 初始化选中方案对象（修复：提前初始化所有可能的key）
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
        // 修复：传递完整的查询参数（包含id）
        const { data } = await gameList({ ...state.query, id });
        state.gameList = data?.list || [];
        state.isLoaded = true;

        // 更新缓存时间戳，触发缓存重新计算
        cacheUpdateTime.value = Date.now();

        // 初始化选中方案对象
        initSelectedPlans();

        Toast.success("数据加载成功");
      } catch (error) {
        console.error("初始化失败：", error);
        state.gameList = [];
        state.isLoaded = true;
        Toast.fail("数据加载失败，请重试");
      }
    }

    // 确认按钮逻辑（补充完整逻辑）
    function handleConfirm() {
      if (totalSelectedPlans.value === 0) {
        Toast.warning("请至少选择一个训练方案");
        return;
      }

      // 整理选中的方案数据
      const selectedData = {};
      Object.entries(state.selectedPlans).forEach(([key, planIds]) => {
        if (planIds.length > 0) {
          selectedData[key] = planIds;
        }
      });

      console.log("选中的训练方案：", selectedData);
      Toast.success(`已确认选择 ${totalSelectedPlans.value} 个训练方案`);

      // 可在这里添加保存逻辑，例如跳回上一页并传递数据
      // router.go(-1);
    }

    onMounted(() => {
      init();
    });

    return {
      ...toRefs(state),
      totalSelectedPlans,
      getCachedGameList,
      toggleExpand,
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

    .botton {
      padding: 4px 12px;
      background-color: #1989fa;
      color: #fff;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
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
    :deep(.van-tabs__wrap) {
      background-color: #fff;
    }

    :deep(.van-tab__content) {
      padding: 0;
    }
  }

  .plan-list {
    padding: 8px 0;

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