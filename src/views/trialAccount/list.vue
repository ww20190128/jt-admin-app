<template>
  <div class="trialAccount-list-warper">
    <div class="header-bar">
      <button class="create-btn" @click="showCreateModal = true">创建</button>

      <!-- 全选/取消全选按钮 -->
      <div class="select-all-box">
        <label class="check-label">
          <input
            type="checkbox"
            @change="handleSelectAllChange"
            :checked="isAllSelected"
            :disabled="accountList.length === 0"
          />
          <span class="select-text">全选</span>
        </label>
      </div>
    </div>

    <div class="list-container">
      <!-- 空状态 -->
      <div class="empty" v-if="accountList.length === 0 && !loading">
        <div class="empty-icon">📄</div>
        <div class="empty-text">暂无试用账号数据</div>
      </div>

      <!-- 列表 -->
      <div
        class="item"
        v-for="item in accountList"
        :key="item.id"
        @click="handleItemClick(item)"
        :class="{ 'item-selected': selectedIds.includes(item.id) }"
      >
        <!-- 复选框 -->
        <label class="check-label">
          <input
            type="checkbox"
            class="checkbox-input"
            :value="item.id"
            @change.stop="onCheckChange"
            :checked="selectedIds.includes(item.id)"
          />
          <!-- 自定义复选框样式 -->
          <span class="checkbox-custom"></span>
        </label>

        <div class="item-main">
          <!-- 顶部信息 -->
          <div class="item-top">
            <div class="user-info">
              <h3 class="username">{{ item.username }}</h3>
              <p class="account">{{ item.account || "未绑定手机号" }}</p>
            </div>
            <div class="tag" :class="`tag-${item.typeId || 'default'}`">
              {{ getTypeName(item.typeId) }}
            </div>
          </div>

          <!-- 中间信息区域 -->
          <div class="item-middle">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">性别：</span>
                <span class="info-value">{{
                  item.sex === 1 ? "男" : item.sex === 2 ? "女" : "未设置"
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">年龄：</span>
                <span class="info-value">{{
                  getAge(item.birthday) || "未设置"
                }}</span>
              </div>
              <div class="info-item full-width">
                <span class="info-label">创建时间：</span>
                <span class="info-value">{{ formatTime(item.createdAt) }}</span>
              </div>
              <div class="info-item full-width">
                <span class="info-label">有效期至：</span>
                <span class="info-value">{{ formatTime(item.expiredAt) }}</span>
              </div>
            </div>
          </div>

          <!-- 底部操作区域 -->
          <div class="item-bottom">
            <div class="status-tag" :class="getStatusClass(item.expiredAt)">
              {{ getStatusText(item.expiredAt) }}
            </div>
            <button class="edit-pwd-btn" @click.stop="handleEditOne(item)">
              重置密码
            </button>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div class="loading-state" v-if="loading">
        <span class="loading-icon">🔄</span>
        <span>加载中...</span>
      </div>
      <div class="nomore-state" v-if="nomore && !loading">已加载全部数据</div>

      <!-- 批量操作栏 - 一直显示 -->
      <div class="batch-actions-bar" v-if="accountList.length > 0">
        <div class="batch-left">
          <span class="selected-count"
            >已选中 {{ selectedIds.length }} / {{ accountList.length }} 个</span
          >
        </div>
        <button
          class="batch-edit-btn"
          @click="handleBatchEdit"
          :disabled="selectedIds.length === 0"
        >
          批量修改密码
        </button>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div class="modal-overlay" v-show="showPwdModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">
            {{ isBatch ? "批量修改密码" : "重置密码" }}
          </h3>
          <button class="modal-close" @click="showPwdModal = false">✕</button>
        </div>
        <div class="modal-body">
          <input
            v-model="newPwd"
            type="password"
            placeholder="请输入新密码"
            class="password-input"
          />
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showPwdModal = false">取消</button>
          <button
            class="btn-confirm"
            @click="submitPwd"
            :disabled="newPwd == ''"
          >
            确认
          </button>
        </div>
      </div>
    </div>

    <!-- 创建账号弹窗 -->
    <div class="modal-overlay" v-show="showCreateModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">创建体验账号</h3>
          <button class="modal-close" @click="showCreateModal = false">
            ✕
          </button>
        </div>
        <div class="modal-body">
          <div class="create-form">
            <div class="form-item">
              <label class="form-label">账号数量：</label>
              <input
                v-model.number="createCount"
                type="number"
                min="1"
                max="100"
                placeholder="请输入创建数量（1-100）"
                class="count-input"
              />
              <div class="form-tip" v-if="createCountError">
                {{ createCountError }}
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showCreateModal = false">
            取消
          </button>
          <button class="btn-confirm" @click="submitCreateAccount">
            确认创建
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, onActivated, computed, watch } from "vue";
import { useRouter } from "vue-router";
import {
  tryoutuserlist,
  tryoutuserchangepwd,
  tryoutuseradd,
} from "@/api/tryoutUser";
import { useStore } from "@/store";
import { Toast } from "vant";
import PassWordUtils from "@/utils/passWordUtils.js";
export default {
  name: "trialAccount-list",
  components: { Toast },
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      accountList: [],
      selectedIds: [],
      loading: false,
      nomore: false,
      showPwdModal: false,
      newPwd: "",
      editId: null,
      isBatch: false,
      // 创建账号相关
      showCreateModal: false,
      createCount: 5,
      createCountError: "",
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
      userInfo: {},
    });

    // 监听创建数量，实时校验
    watch(
      () => state.createCount,
      (val) => {
        if (val === "" || val === null || val === undefined) {
          state.createCountError = "";
          return;
        }
        if (val < 1) {
          state.createCountError = "创建数量不能小于1";
        } else if (val > 100) {
          state.createCountError = "创建数量不能大于100";
        } else {
          state.createCountError = "";
        }
      }
    );

    // 计算属性：是否全选
    const isAllSelected = computed(() => {
      if (state.accountList.length === 0) return false;
      return state.selectedIds.length === state.accountList.length;
    });

    // 格式化时间
    const formatTime = (time) => {
      if (!time) return "未设置";
      const d = new Date(time);
      if (isNaN(d.getTime())) return "格式错误";
      return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}/${String(d.getDate()).padStart(2, "0")} ${String(
        d.getHours()
      ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    };

    // 卡类型名称
    const getTypeName = (id) => {
      const item = state.classifyList.find((x) => x.id === id);
      return item ? item.name : "未知类型";
    };

    // 状态文本
    const getStatusText = (t) => {
      if (!t) return "未设置";
      const now = new Date();
      const et = new Date(t);
      const day = Math.ceil((et - now) / 86400000);
      if (day < 0) return "已过期";
      if (day <= 7) return `即将过期(${day}天)`;
      return `正常(${day}天)`;
    };

    // 状态样式
    const getStatusClass = (t) => {
      if (!t) return "status-default";
      const now = new Date();
      const et = new Date(t);
      const day = (et - now) / 86400000;
      if (day < 0) return "status-expired";
      if (day <= 7) return "status-warning";
      return "status-normal";
    };

    // 获取列表
    const getList = async () => {
      if (state.loading || state.nomore) return;
      state.loading = true;
      try {
        const { data } = await tryoutuserlist();
        if (!data?.list?.length) {
          state.nomore = true;
          return;
        }
        state.accountList = [...state.accountList, ...data.list];
      } catch (e) {
      } finally {
        state.loading = false;
      }
    };

    // 刷新列表
    const refresh = () => {
      state.accountList = [];
      state.nomore = false;
      state.selectedIds = [];
      getList();
    };

    // 提交创建账号
    const submitCreateAccount = async () => {
      // 再次校验
      if (
        !state.createCount ||
        state.createCount < 1 ||
        state.createCount > 100
      ) {
        Toast("请输入正确的数量");
        return;
      }
      try {
        await tryoutuseradd({
          count: state.createCount,
          agent_id: state.userInfo.userId,
        });
        Toast.success(`成功创建 ${state.createCount} 个试用账号`);
        // 关闭弹窗
        state.showCreateModal = false;
        // 重置创建数量
        state.createCount = 0;
      } catch (error) {
        Toast.fail(error);
        // 关闭弹窗
        state.showCreateModal = false;
      }
    };

    // 复选框变更
    const onCheckChange = (e) => {
      const id = Number(e.target.value);
      if (e.target.checked) {
        !state.selectedIds.includes(id) && state.selectedIds.push(id);
      } else {
        state.selectedIds = state.selectedIds.filter((x) => x !== id);
      }
    };

    // 点击列表项选中/取消选中
    const handleItemClick = (item) => {
      const id = item.id;
      const index = state.selectedIds.indexOf(id);
      if (index > -1) {
        state.selectedIds.splice(index, 1); // 取消选中
      } else {
        state.selectedIds.push(id); // 选中
      }
    };

    // 全选/取消全选
    const handleSelectAllChange = (e) => {
      if (e.target.checked) {
        // 全选：将所有账号ID加入选中列表
        state.selectedIds = state.accountList.map((item) => item.id);
      } else {
        // 取消全选：清空选中列表
        state.selectedIds = [];
      }
    };

    // 单个修改密码
    const handleEditOne = (item) => {
      state.editId = item.id;
      state.isBatch = false;
      state.newPwd = "";
      state.showPwdModal = true;
    };

    // 批量修改密码
    const handleBatchEdit = () => {
      if (state.selectedIds.length === 0) return;
      state.isBatch = true;
      state.newPwd = "";
      state.showPwdModal = true;
    };

    // 提交密码修改
    const submitPwd = async () => {
      if (!state.newPwd.trim()) {
        Toast("请填写新的密码");
        return;
      }
      const password = await PassWordUtils.BrowserEncrypt(state.newPwd.trim());
      try {
        await tryoutuserchangepwd({
          member_id: state.isBatch ? 0 : state.editId,
          agent_id: state.userInfo?.userId,
          password: password,
        });
        state.showPwdModal = false;
        Toast.success("密码重置成功");
      } catch (e) {
        Toast.fail(e);
      }
    };

    // 计算年龄
    const getAge = (birthday) => {
      if (!birthday) return 0;
      const birthDate = new Date(birthday);
      if (isNaN(birthDate.getTime())) return 0;
      const now = new Date();
      let age = now.getFullYear() - birthDate.getFullYear();
      // 修正未到生日的情况
      const monthDiff = now.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && now.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age > 0 ? age : 0;
    };

    onMounted(() => {
      if (!store.getters.token) {
        router.push({ path: "/login", query: {} });
      }
      // 用户信息
      state.userInfo = computed(() => store.getters.userInfo);
      getList();
    });

    onActivated(() => {
      refresh();
    });

    return {
      ...toRefs(state),
      isAllSelected,
      getAge,
      formatTime,
      getTypeName,
      getStatusText,
      getStatusClass,
      onCheckChange,
      handleEditOne,
      handleBatchEdit,
      submitPwd,
      handleItemClick,
      handleSelectAllChange,
      submitCreateAccount,
      refresh,
    };
  },
};
</script>

<style scoped>
/* 全局样式重置与基础设置 */
.trialAccount-list-warper {
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
  padding: 20px 16px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 头部栏 */
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.create-btn {
  background: linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 100%);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(142, 197, 252, 0.3);
  transition: all 0.2s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142, 197, 252, 0.4);
}

.select-all-box {
  display: flex;
  align-items: center;
}

.select-text {
  font-size: 14px;
  color: #666;
  margin-left: 6px;
}

/* 列表容器 */
.list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 空状态 */
.empty {
  text-align: center;
  padding: 80px 0;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
}

/* 列表项样式 - 精美化重构 */
.item {
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 2px solid transparent;
}

.item-selected {
  border-color: #409eff;
  background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.15);
}

.item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

/* 自定义复选框样式 */
.check-label {
  position: relative;
  padding-top: 4px;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
}

.checkbox-input:checked + .checkbox-custom {
  background-color: #409eff;
  border-color: #409eff;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: "✓";
  position: absolute;
  color: white;
  font-size: 12px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 列表项主体内容 */
.item-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 顶部信息 */
.item-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.username {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.account {
  font-size: 13px;
  color: #999;
  margin: 0;
}

/* 标签样式 */
.tag {
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tag-0 {
  background: #e8f4f8;
  color: #4299e1;
}
.tag-3 {
  background: #f0f8fb;
  color: #38b2ac;
}
.tag-99 {
  background: #fef7fb;
  color: #9f7aea;
}
.tag-101 {
  background: #f5fafe;
  color: #48bb78;
}
.tag-102 {
  background: #faf0f5;
  color: #ed8936;
}
.tag-103 {
  background: #f8f8f8;
  color: #e53e3e;
}
.tag-104 {
  background: #f7f3e9;
  color: #4299e1;
}
.tag-default {
  background: #f5f5f5;
  color: #999;
}

/* 中间信息网格 */
.item-middle {
  padding: 12px 0;
  border-top: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.info-item {
  display: flex;
  font-size: 14px;
}

.info-item.full-width {
  grid-column: 1 / 3;
}

.info-label {
  color: #999;
  min-width: 70px;
}

.info-value {
  color: #666;
  flex: 1;
}

/* 底部操作区域 */
.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 状态标签 */
.status-tag {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 500;
}

.status-normal {
  background: #e6f7ee;
  color: #48bb78;
}
.status-warning {
  background: #fdf3e7;
  color: #ed8936;
}
.status-expired {
  background: #fff2f2;
  color: #e53e3e;
}
.status-default {
  background: #f5f5f5;
  color: #999;
}

/* 重置密码按钮 */
.edit-pwd-btn {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-pwd-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(72, 187, 120, 0.3);
}

/* 加载/无更多状态 */
.loading-state,
.nomore-state {
  text-align: center;
  padding: 20px 0;
  color: #999;
  font-size: 14px;
}

.loading-icon {
  display: inline-block;
  margin-right: 8px;
  animation: rotate 1.5s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 批量操作栏 */
.batch-actions-bar {
  background: #fff;
  padding: 16px 20px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-top: 8px;
}

.batch-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.selected-count {
  font-size: 14px;
  color: #666;
}

/* 批量修改按钮 */
.batch-edit-btn {
  background: linear-gradient(135deg, #409eff 0%, #338cf5 100%);
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.batch-edit-btn:disabled {
  background: #c0c4cc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.batch-edit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.modal-card {
  background: #fff;
  width: 90%;
  max-width: 400px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 18px;
  color: #999;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f5f5f5;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.password-input {
  width: 100%;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.password-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

/* 创建账号表单样式 */
.create-form {
  width: 100%;
}

.form-item {
  margin-bottom: 8px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.count-input {
  width: 100%;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.count-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

.form-tip {
  font-size: 12px;
  color: #e53e3e;
  margin-top: 6px;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #f5f5f5;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel {
  padding: 8px 20px;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  background: #fff;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: #f5f5f5;
}

.btn-confirm {
  padding: 8px 20px;
  border-radius: 8px;
  border: none;
  background: #409eff;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-confirm:disabled {
  background: #c0c4cc;
  cursor: not-allowed;
}

.btn-confirm:hover:not(:disabled) {
  background: #338cf5;
}
</style>
