<template>
  <div class="cell-list">
    <div class="list">
      <div class="item" v-for="item in data" :key="item">
        <div class="item-left">
          <div class="avatar" @click="handleItemShowUpdate(item)">
            <van-image fit="cover" :src="logoImg" />
          </div>
          <div class="info-main">
            <!-- 商户名称 -->
            <div class="agent-name">{{ item.Agent.name }}</div>
            <div class="field-list-wrap">
              <div class="field-item">
                <div class="field-name">联系人</div>
                <div class="field-value">{{ item.Agent.contact }}</div>
              </div>
              <div class="field-item">
                <div class="field-name">余额</div>
                <div class="field-value">
                  {{ item.Agent.balance }}元
                  <!-- 充值按钮 -->
                </div>
                <div class="field-button" @click="gotoTopUp(item)">充值</div>
              </div>
              <div class="field-item">
                <div class="field-name">账号</div>
                <div class="field-value">{{ item.Agent.expNum }}个</div>
              </div>
            </div>
          </div>
        </div>
        <div class="item-right">
          <!-- 分成比例 -->
          <div class="commission-wrapper">
            <div
              class="commission-ring"
              :style="{ '--percent': item.Agent.commission * 100 }"
            >
              <div class="commission-text">
                <span class="commission-label">分成比例:</span>
                <span class="commission-value"
                  >{{ item.Agent.commission * 100 }}%</span
                >
              </div>
            </div>
            <!--  -->
          </div>
        </div>
        <div
          class="status-tag"
          :class="item.Agent.status === 2 ? 'status-normal' : 'status-abnormal'"
          @click="handleItemShowUpdate(item)"
        >
          {{ item.Agent.status === 2 ? "签约中" : "已解约" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRouter } from "vue-router";
import logoImg from "@/assets/images/avatar.png";
export default {
  name: "CellList",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, ctx) {
    const router = useRouter();
    function handleItemShowUpdate(item) {
      ctx.emit("clickUpdate", item);
    }
    function gotoTopUp({ Agent }) {
      router.push({
        path: "/agent/topUp",
        query: {
          id: Agent.id,
          name: Agent.name,
        },
      });
    }

    return {
      handleItemShowUpdate,
      logoImg,
      gotoTopUp,
    };
  },
};
</script>
<style lang="less" scoped>
// 调整配色体系：核心新增蓝色系变量，保留原有逻辑
@white-primary: #ffffff;     // 主纯白
@white-light: #f9fafb;       // 极浅灰背景
@white-border: #f0f0f0;      // 浅灰边框
@text-primary: #333333;      // 深灰文字（替代纯黑）
@text-secondary: #666666;    // 中灰文字
@text-tertiary: #999999;     // 浅灰文字
@status-normal: #94c9b1;     // 浅绿（签约）
@status-abnormal: #e9b4b4;   // 浅红（解约）

// 新增蓝色系变量（核心修改）
@blue-primary: #e8f4f8;      // 浅蓝主背景（item默认）
@blue-hover: #d1e7f0;        // 浅蓝hover背景
@blue-deep: #88b0c9;         // 深蓝（按钮/强调）
@blue-border: #c5d9e5;       // 蓝灰色边框

.page-header {
  font-size: 32px;
  font-weight: 600;
  color: @text-primary;
  margin-bottom: 20px;
}

.list {
  display: flex;
  flex-direction: column;
}

// 核心修改：item背景改为蓝色系
.item {
  background: @blue-primary; // 浅蓝背景（核心修改）
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 8px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid @blue-border; // 蓝灰色边框（适配蓝色背景）
  box-shadow: 0 2px 8px rgba(136, 176, 201, 0.1); // 淡蓝色阴影
  transition: all 0.3s ease;
  margin-bottom: 15px;
  position: relative; // 确保状态标签定位
  &:active {
    transform: scale(0.98);
    background: @blue-hover; // hover/点击时加深蓝色
    box-shadow: 0 1px 4px rgba(136, 176, 201, 0.15);
  }
}

.item-left {
  display: flex;
  align-items: center;
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid @blue-border; // 适配蓝色边框
    background: @white-light; // 极浅灰底（保持对比）
    .van-image {
      width: 100%;
      height: 100%;
    }
  }
  .info-main {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    .agent-name {
      font-size: 17px;
      font-weight: 600;
      color: @text-primary; // 深灰文字保证可读性
    }
    .field-list-wrap {
      margin-top: 10px;
      .field-item {
        display: flex;
        line-height: 20px;
        .field-name {
          font-size: 12px;
          color: @text-secondary;
          width: 40px;
        }
        .field-value {
          font-size: 12px;
          color: @text-secondary;
        }
        .field-button {
          margin-left: 5px;
          padding: 0px 4px;
          background-color: @blue-deep; // 深蓝充值按钮（适配整体蓝色系）
          color: #ffffff;
          font-size: 12px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s ease;
          &:hover {
            background-color: darken(@blue-deep, 8%);
          }
        }
      }
    }
  }
}

.item-right {
  display: flex;
  flex-direction: column;
}

// 分成比例圆环：适配蓝色系
.commission-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    @blue-deep 0%,
    @blue-deep calc(var(--percent) * 1%),
    @blue-primary calc(var(--percent) * 1%),
    @blue-primary 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: @white-primary; // 纯白内圆（保持对比）
  }

  .commission-text {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .commission-label {
    font-size: 12px;
    color: @text-tertiary;
    margin-bottom: 4px;
  }

  .commission-value {
    font-size: 24px;
    font-weight: 700;
    color: @text-primary; // 深灰数值，保持简洁
  }
}

.status-tag {
  position: absolute;
  bottom: -5px;
  left: -8px;
  padding: 2px 8px;
  border-radius: 0px 12px 0 12px;
  font-size: 12px;
  font-weight: 500;
  color: @text-primary; // 深灰文字
  z-index: 2;
  border: 1px solid @blue-border; // 适配蓝色边框
}

// 签约状态 - 浅绿底（低饱和）
.status-normal {
  background: #f0f8f4;
  color: #5a9277;
}

// 解约状态 - 浅红底（低饱和）
.status-abnormal {
  background: #fdf2f2;
  color: #a76868;
}
</style>