<template>
    <div class="info-page">
      <!-- 1. 用户详情区 -->
      <div class="section user-info-section">
        <h3 class="section-title">用户详情</h3>
        <div class="account-info-wrap">
          <div class="form-row">
            <label>姓名</label>
            <input type="text" v-model="userInfo.name" placeholder="请输入姓名" />
          </div>
          <div class="form-row">
            <label>手机号</label>
            <input type="text" v-model="userInfo.phone" placeholder="请输入手机号" />
          </div>
          <div class="form-row">
            <label>性别</label>
            <select v-model="userInfo.gender">
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
          <div class="form-row">
            <label>年龄</label>
            <input type="number" v-model="userInfo.age" placeholder="请输入年龄" />
          </div>
          <div class="form-row">
            <label>当前卡类型</label>
            <select v-model="userInfo.cardType">
              <option value="免费">免费</option>
              <option value="年卡">年卡</option>
              <option value="年卡Plus">年卡Plus</option>
              <option value="体验卡">体验卡</option>
              <option value="季卡">季卡</option>
            </select>
          </div>
          <div class="form-row">
            <label>有效期至</label>
            <input type="text" v-model="userInfo.expireTime" readonly />
          </div>
          <div class="form-row">
            <label>代理</label>
            <select v-model="userInfo.agent">
              <option value="13400000003">13400000003</option>
            </select>
          </div>
          <div class="form-row">
            <label>状态</label>
            <select v-model="userInfo.status">
              <option value="正常">正常</option>
              <option value="暂停">暂停</option>
            </select>
          </div>
          <div class="form-row">
            <label>密码</label>
            <input type="password" v-model="userInfo.password" placeholder="请输入新密码" />
          </div>
          <div class="btn-group">
            <button class="btn btn-secondary" @click="handlePauseTraining">暂停训练</button>
            <button class="btn btn-primary" @click="handleSaveUserInfo">保存信息</button>
          </div>
        </div>
      </div>
  
      <!-- 2. 卡操作区 -->
      <div class="section card-op-section">
        <h3 class="section-title">卡操作</h3>
        <div class="card-op-wrap">
          <div class="form-row">
            <label class="required">操作类型</label>
            <select v-model="cardOp.type">
              <option value="购买">购买</option>
              <option value="续费">续费</option>
              <option value="升级">升级</option>
            </select>
          </div>
          <div class="form-row">
            <label>姓名</label>
            <input type="text" v-model="cardOp.name" readonly />
          </div>
          <div class="form-row">
            <label>手机号</label>
            <input type="text" v-model="cardOp.phone" readonly />
          </div>
          <div class="form-row">
            <label>性别</label>
            <input type="text" v-model="cardOp.gender" readonly />
          </div>
          <div class="form-row">
            <label>当前卡类型</label>
            <input type="text" v-model="cardOp.currentCard" readonly />
          </div>
          <div class="form-row">
            <label class="required">目标卡类型</label>
            <select v-model="cardOp.targetCard">
              <option value="免费">免费</option>
              <option value="年卡">年卡</option>
              <option value="年卡Plus">年卡Plus</option>
              <option value="体验卡">体验卡</option>
              <option value="季卡">季卡</option>
            </select>
          </div>
          <div class="btn-group">
            <button class="btn btn-primary" @click="handleCardOpConfirm">确认</button>
          </div>
        </div>
      </div>
  
      <!-- 3. 训练方案区 -->
      <div class="section plan-section">
        <h3 class="section-title">训练方案</h3>
        <div class="plan-wrap">
          <div class="item-list">
            <div
              class="item"
              v-for="item in trainingItems"
              :key="item.key"
            >
              <div class="item-left">
                <van-checkbox v-model="item.checked">{{ item.name }}</van-checkbox>
              </div>
              <div class="item-right">
                <span>训练时长(分):</span>
                <div class="num-ctrl">
                  <button @click="item.duration = Math.max(0, item.duration - 1)">
                    −
                  </button>
                  <span>{{ item.duration }}</span>
                  <button @click="item.duration += 1">+</button>
                </div>
              </div>
            </div>
          </div>
          <div class="plan-op-wrap">
            <div class="form-row">
              <label>遮挡设置</label>
              <select v-model="planSettings.occlusion">
                <option value="双眼">双眼</option>
                <option value="左眼">左眼</option>
                <option value="右眼">右眼</option>
              </select>
            </div>
            <div class="form-row">
              <label>集合散开模式</label>
              <select v-model="planSettings.convergenceMode">
                <option value="混合模式">混合模式</option>
                <option value="集合优先">集合优先</option>
                <option value="散开优先">散开优先</option>
              </select>
            </div>
            <div class="form-row">
              <label>训练时长(分钟)</label>
              <div class="num-ctrl">
                <button
                  @click="
                    planSettings.totalDuration = Math.max(
                      0,
                      planSettings.totalDuration - 1
                    )
                  "
                >
                  −
                </button>
                <span>{{ planSettings.totalDuration }}</span>
                <button @click="planSettings.totalDuration += 1">+</button>
              </div>
            </div>
          </div>
          <div class="btn-group">
            <button class="btn btn-secondary" @click="handlePlanCancel">取消</button>
            <button class="btn btn-primary" @click="handlePlanConfirm">确认</button>
          </div>
        </div>
      </div>
  
      <!-- 4. 档案列表区 -->
      <div class="section archive-section">
        <h3 class="section-title">档案列表</h3>
        <div class="archive-wrap">
          <div
            class="archive-item"
            v-for="item in archiveList"
            :key="item.id"
            @click="handleJumpToArchive(item.id)"
          >
            <span>档案 {{ item.id }}</span>
            <span class="arrow">→</span>
          </div>
          <div v-if="archiveList.length === 0" class="empty-tip">暂无档案</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { reactive, toRefs, onMounted, inject } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { Toast } from "vant";
  // 假设接口
  import { getUserDetail, updateUserInfo, operateCard, getTrainingPlan, saveTrainingPlan, getArchiveList } from "@/api/user";
  
  export default {
    name: "UserManagementPage",
    setup() {
      const router = useRouter();
      const route = useRoute();
      const userId = route.query.id; // 从路由获取用户ID
  
      const state = reactive({
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
        if (!userId) {
          Toast.fail("缺少用户ID");
          return;
        }
        await initPageData();
      });
  
      // 初始化页面数据
      async function initPageData() {
        try {
          // 1. 获取用户详情
          const userRes = await getUserDetail({ id: userId });
          if (userRes.data) {
            state.userInfo = { ...userRes.data };
            state.cardOp.name = userRes.data.name;
            state.cardOp.phone = userRes.data.phone;
            state.cardOp.gender = userRes.data.gender;
            state.cardOp.currentCard = userRes.data.cardType;
          }
  
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
      async function handleSaveUserInfo() {
        try {
          await updateUserInfo({ id: userId, ...state.userInfo });
          Toast.success("保存成功");
        } catch (err) {
          Toast.fail("保存失败");
        }
      }
  
      // 暂停训练
      function handlePauseTraining() {
        state.userInfo.status = "暂停";
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
        handleSaveUserInfo,
        handlePauseTraining,
        handleCardOpConfirm,
        handlePlanCancel,
        handlePlanConfirm,
        handleJumpToArchive,
      };
    },
  };
  </script>
  
  <style lang="less" scoped>
  .info-page {
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
    margin-bottom: 12px;
    flex-wrap: wrap;
  
    label {
      width: 100px;
      font-size: 14px;
      color: #666;
      flex-shrink: 0;
  
      &.required::before {
        content: "*";
        color: #f56c6c;
        margin-right: 2px;
      }
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
  
  // 档案列表区
  .archive-wrap {
    .archive-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background-color 0.2s;
  
      &:hover {
        background-color: #f5f7fa;
      }
  
      .arrow {
        color: #909399;
        font-size: 16px;
      }
    }
  
    .empty-tip {
      text-align: center;
      color: #909399;
      padding: 20px 0;
    }
  }
  </style>