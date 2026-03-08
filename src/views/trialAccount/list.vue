<template>
  <div class="trialAccount-list-warper">

    <!-- 左上角 创建用户按钮 -->
    <div class="create-btn-box">
      <button class="create-btn" @click="handleCreateUser">
        创建用户
      </button>
    </div>

    <div class="list-container">
      <!-- 空状态 -->
      <div class="empty" v-if="accountList.length === 0 && !loading">
        <div>暂无数据</div>
      </div>

      <!-- 列表 -->
      <div class="item" v-for="item in accountList" :key="item.id">
        <!-- 复选框 -->
        <label class="check-label">
          <input
            type="checkbox"
            :value="item.id"
            @change="onCheckChange"
            :checked="selectedIds.includes(item.id)"
          >
        </label>

        <div class="item-main">
          <div class="top">
            <div>
              <div class="username">{{ item.username }}</div>
              <div class="account">{{ item.account || '未绑定手机号' }}</div>
            </div>
            <div class="tag" :class="getTypeClass(item.typeId)">
              {{ getTypeName(item.typeId) }}
            </div>
          </div>

          <div class="time">
            到期时间：{{ formatTime(item.expiredAt) }}
          </div>

          <div class="bottom">
            <div class="status" :class="getStatusClass(item.expiredAt)">
              {{ getStatusText(item.expiredAt) }}
            </div>
            <button class="edit-pwd-btn" @click="handleEditOne(item)">
              修改密码
            </button>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div class="load" v-if="loading">加载中...</div>
      <div class="nomore" v-if="nomore && !loading">已加载全部</div>

      <!-- 批量操作栏 -->
      <div class="batch-bar" v-if="selectedIds.length > 0">
        <span>已选中 {{ selectedIds.length }} 个</span>
        <button class="batch-btn" @click="handleBatchEdit">批量修改密码</button>
      </div>

      <CopyRight />
    </div>

    <!-- 密码弹窗（最稳写法） -->
    <div class="modal" v-show="showPwdModal">
      <div class="modal-box">
        <div class="modal-title">修改密码</div>
        <input
          v-model="newPwd"
          type="password"
          placeholder="请输入新密码"
          class="input"
        >
        <div class="btns">
          <button @click="showPwdModal = false">取消</button>
          <button @click="submitPwd">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import {
  tryoutuserlist,
  tryoutuserchangepwd
} from '@/api/tryoutUser'
import CopyRight from '@/components/CopyRight'

export default {
  name: 'trialAccount-list',
  components: { CopyRight },
  setup() {
    const router = useRouter()

    const state = reactive({
      accountList: [],
      selectedIds: [],
      loading: false,
      nomore: false,
      showPwdModal: false,
      newPwd: '',
      editId: null,
      isBatch: false,
      classifyList: [
        { id: -1, name: '全部' },
        { id: 0, name: '免费' },
        { id: 3, name: '七日卡' },
        { id: 99, name: '体验卡' },
        { id: 101, name: '季卡' },
        { id: 102, name: '半年卡' },
        { id: 103, name: '年卡' },
        { id: 104, name: '年卡Plus' },
      ]
    })

    // 格式化时间
    const formatTime = (time) => {
      if (!time) return '未设置'
      const d = new Date(time)
      if (isNaN(d)) return '错误'
      return d.getFullYear() + '/' +
        String(d.getMonth() + 1).padStart(2, '0') + '/' +
        String(d.getDate()).padStart(2, '0')
    }

    // 卡类型名称
    const getTypeName = (id) => {
      const item = state.classifyList.find(x => x.id === id)
      return item ? item.name : '未知'
    }

    // 卡类型样式
    const getTypeClass = (id) => {
      return 'type-' + (id || 'default')
    }

    // 状态文本
    const getStatusText = (t) => {
      if (!t) return '未设置'
      const now = new Date()
      const et = new Date(t)
      const day = (et - now) / 86400000
      if (day < 0) return '已过期'
      if (day <= 7) return '即将过期'
      return '正常'
    }

    // 状态样式
    const getStatusClass = (t) => {
      if (!t) return 'default'
      const now = new Date()
      const et = new Date(t)
      const day = (et - now) / 86400000
      if (day < 0) return 'expired'
      if (day <= 7) return 'warning'
      return 'normal'
    }

    // 获取列表
    const getList = async () => {
      if (state.loading || state.nomore) return
      state.loading = true
      try {
        const { data } = await tryoutuserlist()
        if (!data?.list?.length) {
          state.nomore = true
          return
        }
        state.accountList = [...state.accountList, ...data.list]
      } catch (e) {
        console.error(e)
      } finally {
        state.loading = false
      }
    }

    // 刷新
    const refresh = () => {
      state.accountList = []
      state.nomore = false
      state.selectedIds = []
      getList()
    }

    // 创建用户
    const handleCreateUser = () => {
      router.push('/tryout-add')
    }

    // 复选框
    const onCheckChange = (e) => {
      const id = Number(e.target.value)
      if (e.target.checked) {
        if (!state.selectedIds.includes(id)) {
          state.selectedIds.push(id)
        }
      } else {
        state.selectedIds = state.selectedIds.filter(x => x !== id)
      }
    }

    // 单个修改
    const handleEditOne = (item) => {
      state.editId = item.id
      state.isBatch = false
      state.newPwd = ''
      state.showPwdModal = true
    }

    // 批量修改
    const handleBatchEdit = () => {
      if (state.selectedIds.length === 0) return
      state.isBatch = true
      state.newPwd = ''
      state.showPwdModal = true
    }

    // 提交密码
    const submitPwd = async () => {
      if (!state.newPwd) {
        alert('请输入密码')
        return
      }
      try {
        if (state.isBatch) {
          for (const id of state.selectedIds) {
            await tryoutuserchangepwd({ id, password: state.newPwd })
          }
          alert('批量成功')
        } else {
          await tryoutuserchangepwd({ id: state.editId, password: state.newPwd })
          alert('修改成功')
        }
        state.showPwdModal = false
        refresh()
      } catch (e) {
        alert('失败')
        console.error(e)
      }
    }

    onMounted(() => {
      getList()
    })

    onActivated(() => {
      refresh()
    })

    return {
      ...toRefs(state),
      formatTime,
      getTypeName,
      getTypeClass,
      getStatusText,
      getStatusClass,
      handleCreateUser,
      onCheckChange,
      handleEditOne,
      handleBatchEdit,
      submitPwd
    }
  }
}
</script>

<style scoped>
/* 极简、无变量、不报错、纯移动端样式 */
.trialAccount-list-warper {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 20px 12px;
  box-sizing: border-box;
}

.create-btn-box {
  margin-bottom: 16px;
}
.create-btn {
  background: #409eff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.check-label {
  padding-top: 4px;
}

.item-main {
  flex: 1;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}
.username {
  font-size: 16px;
  font-weight: bold;
}
.account {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.tag {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  background: #f5f5f5;
}
.type-0 { background: #e8f4f8; color: #4299e1; }
.type-3 { background: #f0f8fb; color: #38b2ac; }
.type-99 { background: #fef7fb; color: #9f7aea; }
.type-101 { background: #f5fafe; color: #48bb78; }
.type-102 { background: #faf0f5; color: #ed8936; }
.type-103 { background: #f8f8f8; color: #e53e3e; }
.type-104 { background: #f7f3e9; color: #4299e1; }

.time {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.status {
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 6px;
}
.status.normal { background: #e6f7ee; color: #48bb78; }
.status.warning { background: #fdf3e7; color: #ed8936; }
.status.expired { background: #fee; color: #e53e3e; }

.edit-pwd-btn {
  background: #409eff;
  color: #fff;
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
}

.batch-bar {
  background: #fff;
  padding: 12px 16px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.batch-btn {
  background: #409eff;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
}

.empty {
  text-align: center;
  padding: 60px 0;
  color: #999;
}
.load, .nomore {
  text-align: center;
  color: #999;
  padding: 10px 0;
}

/* 弹窗 */
.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal-box {
  background: #fff;
  width: 80%;
  border-radius: 12px;
  padding: 20px;
}
.modal-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
}
.input {
  width: 100%;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 16px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: center;
  gap: 20px;
}
.btns button {
  padding: 8px 20px;
  border-radius: 8px;
  border: none;
}
.btns button:nth-child(2) {
  background: #409eff;
  color: #fff;
}
</style>