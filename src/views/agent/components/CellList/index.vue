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
// 极简白色基调配色体系
@white-primary: #ffffff;     // 主纯白
@white-light: #f9fafb;       // 极浅灰背景
@white-border: #f0f0f0;      // 浅灰边框
@white-hover: #f5f5f5;       // hover浅灰
@accent-light: #e8f4f8;      // 淡蓝点缀
@accent-main: #88b0c9;       // 主淡蓝（交互）
@text-primary: #333333;      // 深灰文字（替代纯黑）
@text-secondary: #666666;    // 中灰文字
@text-tertiary: #999999;     // 浅灰文字
@status-normal: #94c9b1;     // 浅绿（签约）
@status-abnormal: #e9b4b4;   // 浅红（解约）

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

.item {
  background: @white-primary; // 纯白主背景
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 8px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid @white-border; // 极简浅灰边框
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03); // 极淡阴影
  transition: all 0.3s ease;
  margin-bottom: 15px;
  position: relative; // 确保状态标签定位
  &:active {
    transform: scale(0.98);
    background: @white-hover;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
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
    border: 2px solid @white-border; // 浅灰边框
    background: @white-light; // 极浅灰底
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
      color: @text-primary;
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
          background-color: @accent-main; // 淡蓝充值按钮
          color: #ffffff;
          font-size: 12px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s ease;
          &:hover {
            background-color: darken(@accent-main, 8%);
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

.commission-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    @accent-main 0%,
    @accent-main calc(var(--percent) * 1%),
    @accent-light calc(var(--percent) * 1%),
    @accent-light 100%
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
    background: @white-primary; // 纯白内圆
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
  border: 1px solid @white-border; // 浅灰边框
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