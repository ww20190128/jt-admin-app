<template>
  <div class="cell-list">
    <div class="head" :style="style" @click="handleItem(first)">
      <div class="num"><i class="icon fa fa-user-o"></i>{{ first.saleNum }}人测过</div>
      <div class="bottom">
        <div class="left">{{ first.subhead }}</div>
        <div class="go-button" @click="handleItem(first)">立即测试</div>
      </div>
    </div>
    <div class="list">
      <div class="item" v-for="item in data" :key="item" @click="handleItem(item)">
        <div class="left">
          <van-image fit="cover" :src="item.coverImg">
          </van-image>
        </div>
        <div class="right">
          <div class="top">
            <p class="title">{{ item.subhead }}</p>
            <p class="subhead">{{ item.name }}</p>
          </div>
          <div class="bottom">
            <!-- fa fa-heart -->
            <div class="num">{{ item.saleNum }}人测过</div>
            <div class="go-button">立即测试</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "CellList",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    couponInfo: {
      type: Object,
      default: () => { },
    },
  },
  setup(props) {
    const router = useRouter();
    const first = computed(() => {
      const [value] = props.data.splice(0, 1);
      return value || {};
    });
    const style = computed(() => {
      return {
        background: `linear-gradient(rgba(228, 228, 228, 0), rgba(0, 0, 0, 0.5)),
    url(${first.value.coverImg}) center
      center / 100% no-repeat`,
      };
    });

    function handleItem({ id }) {
      router.push({
        path: "/detail",
        query: {
          testPaperId: id,
        },
      });
    }
    return {
      first,
      style,
      handleItem,
    };
  },
};
</script>
<style lang="less" scoped>
.go-button {
  text-align: center;
  width: 70px;
  height: 22px;
  line-height: 22px;
  border-radius: 15px;
  padding: 0 @padding-base;
  background-color: @theme-color;
  color: #fff;
  font-size: @font-size-sm;
}

.head {
  height: 190px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: #fff;
  font-size: @font-size-base;
  padding: 20px @padding-base;
  border-radius: @radius-base;
  .pointer();

  .num {
    padding-bottom: @padding-sm;

    .icon {
      padding-right: 3px;
    }
  }

  .bottom {
    .space-between();
    .align-center();

    .left {
      font-size: @font-size-lg;
      line-height: 1.5;
      font-weight: bold;
      flex: 1;
      padding-right: 5px;
    }
  }
}

.list {
  border-radius: @radius-base;
  box-shadow: 0px 0px 6px #d6d6d6;
  margin-top: -10px;
  background: #fff;

  .item {
    padding: @padding-base @padding-sm;
    .pointer();
    .space-between();

    .left {
      width: 90px;
      height: 90px;

      .van-image {
        width: 100%;
        height: 100%;

        :deep(img) {
          border-radius: @radius-base;
        }
      }
    }

    .right {
      flex: 1;
      padding-left: @padding-sm;
      .column-space-between();

      .top {
        .title {
          font-weight: bold;
          font-size: @font-size-lg;
        }

        .subhead {
          color: @gray-color;
          font-size: @font-size-base;
        }
      }

      .bottom {
        font-size: @font-size-base;
        width: 100%;

        .space-between();

        .num {
          line-height: 26px;
          color: @gray-color;

          &::before {
            color: @theme-color;
          }

        }
      }
    }
  }
}
</style>