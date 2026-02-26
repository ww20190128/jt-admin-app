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
.page-header {
  font-size: 32px;
  font-weight: 600;
  color: #0a2463;
  margin-bottom: 20px;
}

.list {
  display: flex;
  flex-direction: column;
}

.item {
  background: #fdf0c4;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 8px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  margin-bottom: 15px;
  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
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
    border: 2px solid #e0efff;
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
      color: #0a2463;
    }
    .field-list-wrap {
      margin-top: 10px;
      .field-item {
        display: flex;
        line-height: 20px;
        .field-name {
          font-size: 12px;
          color: #64748b;
          width: 40px;
        }
        .field-value {
          font-size: 12px;
          color: #64748b;
        }
        .field-button {
          margin-left: 5px;
          padding: 0px 2px;
          background-color: #4a9cf3;
          color: #fff;
          font-size: 12px;
          border-radius: 5px;
          cursor: pointer;
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
    #007bff 0%,
    #007bff calc(var(--percent) * 1%),
    #e0efff calc(var(--percent) * 1%),
    #e0efff 100%
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
    background: #fff;
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
    color: #bbc0c1;
    margin-bottom: 4px;
  }

  .commission-value {
    font-size: 24px;
    font-weight: 700;
    color: #3d3d0e;
  }
}

.status-tag {
  position: absolute;
  bottom: -5px;
  left: -8px;
  padding: 2px 5px;
  border-radius: 0px 12px 0 12px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  z-index: 2;
}

.status-normal {
  background: #007bff;
}

.status-abnormal {
  background: #ff4d4f;
}
</style>
