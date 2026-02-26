<template>
  <div class="trainSettings-wrap">
    <div class="head-warper">
      <div class="left" @click="$router.go(-1)">
        <img src="@/assets/images/icon/back.png" alt="返回" />
      </div>
      <div class="right">
        <div @click="gotoTrain" class="botton">保存设置</div>
      </div>
    </div>

    <div class="train-type-list">
      <!-- 遍历baseTrainTypeMap，通过typeId找到对应的trainType对象 -->
      <div
        v-for="(typeName, typeId) in baseTrainTypeMap"
        :key="typeId"
        class="train-type-item"
      >
        <!-- 找到当前typeId对应的trainType对象 -->
        <template v-if="getTrainTypeById(Number(typeId))">
          <div class="train-type-header" @click="toggleTrainType(Number(typeId))">
            <van-checkbox
              v-model="getTrainTypeById(Number(typeId)).checked"
              @click.stop="toggleTrainTypeCheck(getTrainTypeById(Number(typeId)))"
            />
            <span class="train-type-name">{{ typeName }}</span>
            <van-icon
              :name="getTrainTypeById(Number(typeId)).expanded ? 'arrow-up' : 'arrow-down'"
              class="expand-icon"
            />
          </div>

          <!-- 展开时显示完整的Tab（基于typeMap） -->
          <div v-if="getTrainTypeById(Number(typeId)).expanded" class="train-type-content">
            <van-tabs
              v-model:active="activeTab[Number(typeId)]"
              class="type-tabs"
              sticky
              scrollspy
            >
              <!-- 循环typeMap（游戏/启蒙/视频），参数改为tabName/tabId -->
              <van-tab
                v-for="(tabName, tabId) in typeMap"
                :key="tabId"
                :title="tabName"
              >
                <div class="plan-list">
                  <!-- 获取当前训练类型+当前Tab的方案（tabId作为分类ID） -->
                  <div
                    v-if="!getPlansByTrainTypeAndTab(Number(typeId), Number(tabId)).length"
                    class="plan-empty-tip"
                  >
                    暂无该类型的训练方案
                  </div>
                  <van-checkbox-group
                    v-else
                    v-model="getSelectedPlans(Number(typeId), Number(tabId))"
                    @change="() => handlePlanChange(Number(typeId), Number(tabId))"
                  >
                    <van-cell-group>
                      <van-cell
                        v-for="plan in getPlansByTrainTypeAndTab(
                          Number(typeId),
                          Number(tabId)
                        )"
                        :key="plan.id"
                        clickable
                        @click="togglePlan(Number(typeId), Number(tabId), plan.id)"
                      >
                        <template #icon>
                          <van-checkbox
                            :name="plan.id"
                            :checked="
                              getSelectedPlans(
                                Number(typeId),
                                Number(tabId)
                              ).includes(plan.id)
                            "
                          />
                        </template>
                        {{ plan.name }}
                      </van-cell>
                    </van-cell-group>
                  </van-checkbox-group>
                </div>
              </van-tab>
            </van-tabs>
          </div>
        </template>
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

// 模拟接口数据（仅用于填充方案，不影响训练类型/Tab的渲染）
const mockGameList = () => {
  return Promise.resolve({
    data: {
      list: [
        {
          id: 1,
          type: 0, // 刺激训练
          ageGroup: [0, 1], // 对应typeMap的0(游戏)/1(启蒙)
          playlist: JSON.stringify([
            { id: 101, name: "刺激训练-游戏-方案1" },
            { id: 102, name: "刺激训练-启蒙-方案1" },
          ]),
        },
        {
          id: 2,
          type: 1, // 变频红光
          ageGroup: [1, 2], // 对应typeMap的1(启蒙)/2(视频)
          playlist: JSON.stringify([
            { id: 201, name: "变频红光-启蒙-方案1" },
            { id: 202, name: "变频红光-视频-方案1" },
          ]),
        },
        {
          id: 3,
          type: 2, // Gabor视觉
          ageGroup: [0, 2], // 对应typeMap的0(游戏)/2(视频)
          playlist: JSON.stringify([
            { id: 301, name: "Gabor视觉-游戏-方案1" },
            { id: 302, name: "Gabor视觉-视频-方案1" },
          ]),
        },
      ],
    },
  });
};

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
      // 核心渲染列表（完全基于baseTrainTypeMap初始化）
      trainTypeList: [],
      // 每个训练类型的激活Tab（默认选中第一个Tab）
      activeTab: {},
      // 固定训练类型映射（不修改）
      baseTrainTypeMap: {
        0: "刺激训练",
        1: "变频红光",
        2: "Gabor视觉",
        3: "拥挤",
        4: "精细",
        5: "脱抑制",
        6: "旁中心",
        7: "同时视觉",
        8: "双眼融合",
        9: "立体视觉",
        10: "眼肌",
      },
      // 原有typeMap（不修改：游戏/启蒙/视频）
      typeMap: {
        0: "游戏",
        1: "启蒙",
        2: "视频",
      },
      // 方案数据存储：{ 训练类型ID: { TabID: { plans: [], selectedPlans: [] } } }
      planData: {},
    });

    // 根据typeId获取trainType对象（解决模板中变量匹配问题）
    function getTrainTypeById(typeId) {
      return state.trainTypeList.find(item => item.id === typeId);
    }

    // 初始化训练类型列表（完全基于baseTrainTypeMap，不修改原有类型）
    function initBaseTrainTypeList() {
      // 1. 生成训练类型列表
      state.trainTypeList = Object.entries(state.baseTrainTypeMap).map(
        ([typeId, typeName]) => ({
          id: Number(typeId),
          name: typeName,
          checked: false,
          expanded: false,
        })
      );

      // 2. 初始化每个训练类型的激活Tab（默认第一个typeMap）
      const firstTabId = Object.keys(state.typeMap)[0];
      state.trainTypeList.forEach((trainType) => {
        state.activeTab[trainType.id] = Number(firstTabId);
      });

      // 3. 初始化planData（每个训练类型+每个Tab都有独立的方案/选中列表）
      state.trainTypeList.forEach((trainType) => {
        state.planData[trainType.id] = {};
        Object.keys(state.typeMap).forEach((tabId) => {
          state.planData[trainType.id][Number(tabId)] = {
            plans: [],
            selectedPlans: [],
          };
        });
      });
    }

    // 根据训练类型ID+TabID获取方案列表（替换原有ageId为tabId，匹配typeMap）
    function getPlansByTrainTypeAndTab(trainTypeId, tabId) {
      return state.planData[trainTypeId]?.[tabId]?.plans || [];
    }

    // 根据训练类型ID+TabID获取选中的方案ID列表
    function getSelectedPlans(trainTypeId, tabId) {
      return state.planData[trainTypeId]?.[tabId]?.selectedPlans || [];
    }

    // 统计选中方案总数
    const totalSelectedPlans = computed(() => {
      let count = 0;
      Object.keys(state.planData).forEach((trainTypeId) => {
        Object.keys(state.planData[trainTypeId]).forEach((tabId) => {
          count += state.planData[trainTypeId][tabId].selectedPlans.length;
        });
      });
      return count;
    });

    // 解析接口数据，填充到对应训练类型+Tab的方案列表（适配typeMap）
    function formatTrainTypeData(gameList) {
      if (!gameList.length) return;

      gameList.forEach((game) => {
        const trainTypeId = game.type ?? 0;
        const tabIds = Array.isArray(game.ageGroup) ? game.ageGroup : []; // 接口中ageGroup对应typeMap的TabID
        let playlists = [];

        // 解析方案JSON
        try {
          playlists = game.playlist ? JSON.parse(game.playlist) : [];
          playlists = playlists.filter((plan) => plan && plan.id && plan.name);
        } catch (e) {
          console.error("解析playlist失败：", e);
          playlists = [];
        }

        // 填充到对应训练类型+Tab的方案列表
        if (state.planData[trainTypeId]) {
          tabIds.forEach((tabId) => {
            if (state.planData[trainTypeId][tabId]) {
              // 方案去重
              playlists.forEach((plan) => {
                const isExist = state.planData[trainTypeId][tabId].plans.some(
                  (p) => p.id === plan.id
                );
                if (!isExist) {
                  state.planData[trainTypeId][tabId].plans.push(plan);
                }
              });
            }
          });
        }
      });
    }

    // 初始化数据
    async function init() {
      try {
        // 1. 优先初始化基础列表（保证训练类型/Tab必显）
        initBaseTrainTypeList();

        // 2. 调用接口（真实接口替换mockGameList）
        const { data } = await mockGameList();
        // const { data } = await gameList({ ...state.query, id }); // 真实接口
        state.gameList = data?.list || [];

        // 3. 填充方案数据
        formatTrainTypeData(state.gameList);
      } catch (error) {
        console.error("初始化失败：", error);
        Toast.fail("数据加载失败，显示基础训练类型");
      }
    }

    // 展开/折叠训练类型
    function toggleTrainType(trainTypeId) {
      const trainType = getTrainTypeById(trainTypeId);
      if (trainType) trainType.expanded = !trainType.expanded;
    }

    // 训练类型全选/取消全选（适配typeMap）
    function toggleTrainTypeCheck(trainType) {
      Object.keys(state.typeMap).forEach((tabId) => {
        const tabNum = Number(tabId);
        const plans = getPlansByTrainTypeAndTab(trainType.id, tabNum);
        state.planData[trainType.id][tabNum].selectedPlans = trainType.checked
          ? plans.map((p) => p.id)
          : [];
      });
    }

    // 单个方案勾选/取消（适配typeMap）
    function togglePlan(trainTypeId, tabId, planId) {
      const selectedPlans = getSelectedPlans(trainTypeId, tabId);
      const index = selectedPlans.findIndex((id) => id === planId);
      if (index > -1) {
        selectedPlans.splice(index, 1);
      } else {
        selectedPlans.push(planId);
      }
      // 更新全选状态
      handlePlanChange(trainTypeId, tabId);
    }

    // 方案选择变化，更新训练类型的全选状态（适配typeMap）
    function handlePlanChange(trainTypeId, tabId) {
      const trainType = getTrainTypeById(trainTypeId);
      if (!trainType) return;

      // 计算该训练类型下所有方案数和已选数
      let totalPlans = 0;
      let selectedPlans = 0;
      Object.keys(state.typeMap).forEach((tabKey) => {
        const tabNum = Number(tabKey);
        totalPlans += getPlansByTrainTypeAndTab(trainTypeId, tabNum).length;
        selectedPlans += getSelectedPlans(trainTypeId, tabNum).length;
      });

      // 更新训练类型的勾选状态
      trainType.checked = totalPlans > 0 && totalPlans === selectedPlans;
    }

    // 确认按钮（适配typeMap）
    function handleConfirm() {
      // 收集选中数据
      const selectedData = state.trainTypeList
        .map((trainType) => {
          const tabData = Object.keys(state.typeMap)
            .map((tabId) => {
              const tabNum = Number(tabId);
              const selectedPlans = getSelectedPlans(trainType.id, tabNum).map(
                (planId) => {
                  const plan = getPlansByTrainTypeAndTab(
                    trainType.id,
                    tabNum
                  ).find((p) => p.id === planId);
                  return plan || { id: planId, name: "未知方案" };
                }
              );
              return {
                tabId: tabNum,
                tabName: state.typeMap[tabId],
                selectedPlans,
              };
            })
            .filter((item) => item.selectedPlans.length > 0);

          return {
            trainTypeId: trainType.id,
            trainTypeName: trainType.name,
            tabData,
          };
        })
        .filter((item) => item.tabData.length > 0);

      if (!selectedData.length) {
        Toast.warning("请至少选择一个方案");
        return;
      }

      Toast.success(`已选择 ${totalSelectedPlans.value} 个方案`);
      console.log("选中数据：", selectedData);
    }

    // 保存设置跳转
    function gotoTrain() {
      handleConfirm();
      router.push({ path: "/train", query: { id } });
    }

    onMounted(() => {
      init();
    });

    return {
      ...toRefs(state),
      totalSelectedPlans,
      getTrainTypeById, // 新增：模板中获取trainType对象
      getPlansByTrainTypeAndTab, // 替换原有age方法，匹配typeMap
      getSelectedPlans,
      toggleTrainType,
      toggleTrainTypeCheck,
      togglePlan,
      handlePlanChange,
      handleConfirm,
      gotoTrain,
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