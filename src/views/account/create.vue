<template>
  <div class="account_create-wrap">
    <!-- 1. 用户详情区 -->
    <div class="section user-info-section" v-if="accountInfo">
      <h3 class="section-title">新增用户</h3>
      <div class="account-info-wrap">
        <div class="form-row">
          <label>姓名</label>
          <input
            type="text"
            v-model="accountInfo.name"
            placeholder="请输入姓名"
          />
        </div>
        <div class="form-row">
          <label>手机号</label>
          <input
            type="text"
            v-model="accountInfo.phone"
            placeholder="请输入手机号"
          />
        </div>
        <div class="form-row">
          <label>性别</label>
          <select v-model="accountInfo.gender">
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div class="form-row">
          <label>年龄</label>
          <div class="value-wrap">
            <span>{{ getAge() }}</span>
            <span class="edit-arrow">></span>
          </div>
        </div>
        <div class="form-row">
          <label>当前卡类型</label>
          <div class="value-wrap">
            <span>{{ getCurrentCardType() }}</span>
            <span class="edit-arrow">></span>
          </div>
        </div>
        <div class="form-row">
          <label>有效期至</label>
          <div class="value-wrap">
            <span>{{ accountInfo.expiredAt }}</span>
          </div>
        </div>
        <div class="form-row">
          <label>状态</label>
          <div class="value-wrap">
            <span>{{ accountInfo.status == "1" ? "正常" : "暂停" }}</span>
            <span class="edit-arrow">></span>
          </div>
        </div>
        <div class="form-row">
          <label>重置密码</label>
          <div class="value-wrap">
            <span></span>
            <span class="edit-arrow">></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { reactive, toRefs, onMounted, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Toast } from "vant";
import { get } from "lodash";

export default {
  name: "account_create",
  setup() {
    const router = useRouter();
    const route = useRoute();

    const { id } = route.query;
    const state = reactive({
      accountInfo: {},
      classifyList: [
        { id: -1, name: "全部" },
        { id: 0, name: "免费" },
        { id: 3, name: "七日卡" },
        { id: 99, name: "体验卡" },
        { id: 101, name: "季卡" },
        { id: 102, name: "半年卡" },
        { id: 103, name: "年卡" },
        { id: 104, name: "年卡Plus" },
      ],
      // 用户详情
      userInfo: {
        name: "",
        phone: "",
        gender: "男",
        age: "",
        cardType: "免费",
        expireTime: "",
        agent: "13400000003",
        status: "正常",
        password: "",
      },
      // 卡操作
      cardOp: {
        type: "购买",
        name: "",
        phone: "",
        gender: "",
        currentCard: "免费",
        targetCard: "年卡Plus",
      },
      // 训练方案
      trainingItems: [
        { key: "stimulus", name: "刺激训练", checked: false, duration: 10 },
        { key: "fine", name: "精细", checked: false, duration: 10 },
        { key: "suppression", name: "脱抑制", checked: false, duration: 10 },
        { key: "center", name: "旁中心", checked: false, duration: 10 },
        { key: "simultaneous", name: "同时视觉", checked: false, duration: 10 },
        { key: "fusion", name: "双眼融合", checked: false, duration: 10 },
        { key: "muscle", name: "眼肌", checked: false, duration: 10 },
      ],
      planSettings: {
        occlusion: "双眼",
        convergenceMode: "混合模式",
        totalDuration: 120,
      },
      // 档案列表
      archiveList: [],
    });

    onMounted(async () => {
      if (!id) {
        Toast.fail("缺少ID");
        return;
      }
      await init();
    });

    // 计算年龄
    const getAge = () => {
      if (!state.accountInfo.birthday) return "";
      const birthYear = new Date(state.accountInfo.birthday).getFullYear();
      const currentYear = new Date().getFullYear();
      return currentYear - birthYear;
    };
    // 获取当前卡类型
    const getCurrentCardType = () => {
      const cardTypeId = state.accountInfo.typeId;
      const card = state.classifyList.find((c) => c.id === cardTypeId);
      return card ? card.name : "未知";
    };

    // 初始化页面数据
    async function init() {
      try {
        // 1. 获取用户详情
        const accountInfo = JSON.parse(
          window.localStorage.getItem("account_info_" + id)
        );
        state.accountInfo = accountInfo;
        console.log("accountInfo:", accountInfo);

        // 2. 获取训练方案
        const planRes = await getTrainingPlan({ userId });
        if (planRes.data) {
          // 合并到 trainingItems 和 planSettings
          state.trainingItems = planRes.data.items || state.trainingItems;
          state.planSettings = planRes.data.settings || state.planSettings;
        }

        // 3. 获取档案列表
        const archiveRes = await getArchiveList({ userId });
        if (archiveRes.data?.list) {
          state.archiveList = archiveRes.data.list;
        }
      } catch (err) {
        console.error("初始化失败", err);
        Toast.fail("页面加载失败");
      }
    }

    // 保存用户信息
    async function handleSaveInfo() {
      try {
        await updateUserInfo({ id: userId, ...state.accountInfo });
        Toast.success("保存成功");
      } catch (err) {
        Toast.fail("保存失败");
      }
    }

    // 暂停训练
    function handleTraining() {
      state.accountInfo.status = "暂停";
      Toast("已切换为暂停状态");
    }

    // 卡操作确认
    async function handleCardOpConfirm() {
      try {
        await operateCard({
          userId,
          type: state.cardOp.type,
          targetCard: state.cardOp.targetCard,
        });
        Toast.success("卡操作成功");
        // 刷新用户信息
        initPageData();
      } catch (err) {
        Toast.fail("卡操作失败");
      }
    }

    // 训练方案取消
    function handlePlanCancel() {
      initPageData(); // 重置为初始数据
      Toast("已重置方案");
    }

    // 训练方案确认
    async function handlePlanConfirm() {
      try {
        await saveTrainingPlan({
          userId,
          items: state.trainingItems,
          settings: state.planSettings,
        });
        Toast.success("方案保存成功");
      } catch (err) {
        Toast.fail("方案保存失败");
      }
    }

    // 跳转到档案页面
    function handleJumpToArchive(archiveId) {
      router.push({ path: "/archive", query: { id: archiveId, userId } });
    }

    return {
      ...toRefs(state),
      handleSaveInfo,
      handleTraining,
      handleCardOpConfirm,
      handlePlanCancel,
      handlePlanConfirm,
      handleJumpToArchive,
      getAge,
      getCurrentCardType,
    };
  },
};
</script>
  
<style lang="less" scoped>
.account_create-wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.section {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.form-row {
  display: flex;
  align-items: center;
  padding: 15px 16px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  &.last-child {
    border-bottom: none;
  }
  label {
    flex: 0 0 100px;
    color: #333;
    font-weight: normal;
  }
  input,
  select {
    flex: 1;
    min-width: 200px;
    height: 32px;
    padding: 0 8px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 14px;
    color: #333;

    &[readonly] {
      background-color: #f5f7fa;
      color: #909399;
    }
  }
  &:hover {
    background-color: #f8f8f8;
  }
}

.btn-group {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: flex-end;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;

  &.primary {
    background-color: #409eff;
    color: #fff;

    &:hover {
      background-color: #66b1ff;
    }
  }

  &.secondary {
    background-color: #909399;
    color: #fff;

    &:hover {
      background-color: #a6a9ad;
    }
  }
}

// 训练方案区
.plan-wrap {
  .item-list {
    margin-bottom: 20px;

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;

      .item-left {
        flex: 1;
      }

      .item-right {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #666;
      }
    }
  }

  .num-ctrl {
    display: flex;
    align-items: center;
    gap: 8px;

    button {
      width: 24px;
      height: 24px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      background: #fff;
      font-size: 14px;
      cursor: pointer;

      &:hover {
        border-color: #409eff;
        color: #409eff;
      }
    }

    span {
      min-width: 30px;
      text-align: center;
    }
  }
}
</style>