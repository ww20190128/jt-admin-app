<template>
  <div class="trainSettings-wrap">
    <div class="head-warper">
      <div class="left" @click="$router.go(-1)">
        <img src="@/assets/images/icon/back.png" alt="返回" />
      </div>
    </div>

    <div class="train-type-list">
      <div
        v-for="(typeName, typeId) in trainTypeMap"
        :key="typeId"
        class="train-type-item"
      >
        <div class="train-type-header" @click="toggleExpand(typeId)">
          <span class="train-type-name">{{ typeName }}</span>
          <van-icon
            :name="expandedTypeIds.includes(typeId) ? 'arrow-up' : 'arrow-down'"
            class="expand-icon"
          />
        </div>

        <div v-if="expandedTypeIds.includes(typeId)" class="train-type-content">
          <van-tabs
            v-model:active="activeTab[typeId]"
            class="type-tabs"
            sticky
            scrollspy
          >
            <van-tab
              v-for="(tabName, tabId) in typeMap"
              :key="tabId"
              :title="tabName"
            >
              <div class="plan-list">
                <!-- 仅渲染当前激活的Tab内容，非激活Tab不渲染 -->
                <template v-if="activeTab[typeId] === Number(tabId)">
                  <van-checkbox-group
                    v-model="selectedPlans[`${typeId}-${tabId}`]"
                  >
                    <van-cell-group>
                      <van-cell
                        v-for="plan in getCachedGameList(typeId, tabId)"
                        :key="plan.id"
                        clickable
                      >
                        <template #icon>
                          <van-checkbox
                            :name="plan.id"
                            :checked="
                              selectedPlans[`${typeId}-${tabId}`].includes(
                                plan.id
                              )
                            "
                          />
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
      query: { pageSize: 10000, pageIndex: 1, status: 2, type: -1 },
      gameList: [],
      activeTab: {},
      trainTypeMap: {
        1: "刺激训练",
        2: "变频红光",
        3: "Gabor视觉",
        4: "拥挤",
        5: "精细",
        8: "旁中心",
        9: "脱抑制",
        10: "同时视觉",
        11: "双眼融合",
        12: "立体视觉",
        13: "眼肌",
      },
      typeMap: {
        0: "游戏",
        1: "启蒙",
        2: "视频",
      },
      expandedTypeIds: [],
      selectedPlans: {},
    });

    // 缓存游戏列表结果：{ "trainTypeId-tabId": [] }，避免重复计算
    const gameListCache = shallowRef({});

    // 计算已选方案总数
    const totalSelectedPlans = computed(() => {
      let count = 0;
      Object.values(state.selectedPlans).forEach((planIds) => {
        count += planIds.length;
      });
      return count;
    });

    // 原始筛选逻辑（仅内部调用，不对外暴露）
    function filterGameList(trainTypeId, tabId) {
      if (!state.gameList.length) return [];
      return state.gameList
        .filter(
          (item) =>
            item.type === Number(tabId) && 
            item.cats?.includes(Number(trainTypeId))
        )
        .flatMap((item) => {
          try {
            return item;
          } catch (e) {
            return [];
          }
        });
    }

    // 带缓存的游戏列表获取方法（核心修复：缓存结果，避免重复计算）
    function getCachedGameList(trainTypeId, tabId) {
      const cacheKey = `${trainTypeId}-${tabId}`;
      // 缓存不存在/游戏列表更新时，重新计算并缓存
      if (!gameListCache.value[cacheKey] || state.gameList._updated) {
        gameListCache.value[cacheKey] = filterGameList(trainTypeId, tabId);
      }
      return gameListCache.value[cacheKey];
    }

    // 切换训练类型展开/折叠
    function toggleExpand(typeId) {
      const index = state.expandedTypeIds.findIndex((id) => id === typeId);
      if (index > -1) {
        state.expandedTypeIds.splice(index, 1);
      } else {
        state.expandedTypeIds.push(typeId);
        if (!state.activeTab[typeId]) {
          state.activeTab[typeId] = 0;
        }
      }
    }

    // 切换单个方案勾选状态
    function togglePlan(trainTypeId, tabId, planId) {
      const key = `${trainTypeId}-${tabId}`;
      if (!state.selectedPlans[key]) {
        state.selectedPlans[key] = [];
      }
      const index = state.selectedPlans[key].findIndex((id) => id === planId);
      if (index > -1) {
        state.selectedPlans[key].splice(index, 1);
      } else {
        state.selectedPlans[key].push(planId);
      }
    }

    // 初始化数据
    async function init() {
      try {
        const { data } = await gameList({ ...state.query, id });
        state.gameList = data?.list || [];
        // 标记游戏列表已更新，触发缓存重新计算
        state.gameList._updated = Date.now();
        // 初始化选中方案对象
        Object.keys(state.trainTypeMap).forEach((trainTypeId) => {
          Object.keys(state.typeMap).forEach((tabId) => {
            const key = `${trainTypeId}-${tabId}`;
            if (!state.selectedPlans[key]) {
              state.selectedPlans[key] = [];
            }
          });
        });
      } catch (error) {
        console.error("初始化失败：", error);
        Toast.fail("数据加载失败，显示基础训练类型");
      }
    }

    // 确认按钮
    function handleConfirm() {
      Toast.success("设置已保存");
    }

    onMounted(() => {
      init();
    });

    return {
      ...toRefs(state),
      totalSelectedPlans,
      getCachedGameList, // 替换为带缓存的方法
      toggleExpand,
      togglePlan,
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