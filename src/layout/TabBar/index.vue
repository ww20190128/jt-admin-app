<template>
  <div class="tab-warper">
    <!-- active-color="#6EA9FB" inactive-color="#A7A7A7" -->
    <van-tabbar route placeholder @change="onTabChange" class="tab-list">
      <van-tabbar-item
        v-for="(item, index) in tabBarList"
        :key="item.to"
        :to="item.to"
        :icon="item.icon"
        active-color="#6EA9FB"
        inactive-color="#A7A7A7"
      >
        <template #icon>
          <img
            :src="isActiveTab(index) ? item.iconOn : item.iconOff"
            alt="icon"
            style="width: 24px; height: 24px"
          />
        </template>
        <p>{{ item.name }}</p>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import homeOnImg from "@/assets/images/icon/icon-home-on.png";
import homeOffImg from "@/assets/images/icon/icon-home-off.png";
import classifyOnImg from "@/assets/images/icon/icon-classify-on.png";
import classifyOffImg from "@/assets/images/icon/icon-classify-off.png";
import vipOnImg from "@/assets/images/icon/icon-vip-on.png";
import vipOffImg from "@/assets/images/icon/icon-vip-off.png";
import mineOnImg from "@/assets/images/icon/icon-mine-on.png";
import mineOffImg from "@/assets/images/icon/icon-mine-off.png";
import mindfulnessOnImg from "@/assets/images/icon/icon-mindfulness-on.png";
import mindfulnessOffImg from "@/assets/images/icon/icon-mindfulness-off.png";

export default {
  name: "TabBar",
  data() {
    return {
      tabBarList: [
        //...你的 tabBarList 数据
      ],
      activeTabIndex: 0,
    };
  },

  methods: {
    isActiveTab(index) {
      return this.activeTabIndex === index;
    },
    onTabChange(index) {
      this.activeTabIndex = index;
    },
  },

  setup() {
    const tabBarList = [
      {
        name: "用户",
        to: "/account",
        iconOn: vipOnImg,
        iconOff: vipOffImg,
      },
      {
        name: "代理",
        to: "/agent",
        iconOn: classifyOnImg,
        iconOff: classifyOffImg,
      },
      {
        name: "我的",
        to: "/mine",
        iconOn: mineOnImg,
        iconOff: mineOffImg,
      },
    ];

    return {
      tabBarList,
      homeOnImg,
      homeOffImg,
      classifyOnImg,
      classifyOffImg,
      vipOnImg,
      vipOffImg,
      mineOnImg,
      mineOffImg,
      mindfulnessOnImg,
      mindfulnessOffImg,
    };
  },
};
</script>
<style lang="less" scoped>
.tab-warper {
  width: 100%;
  z-index: 999;

  .mindfulness-warper {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateY(0%) translateX(-50%);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #fff;
    z-index: 999;
    // border: 1px solid #8ec5fc;
    // box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
    box-shadow: 0px -2px 5px rgba(0, 0, 0, 0.2);

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 3px solid #fff;

      &.playing {
        animation: play_rotate 20s linear infinite;
      }
    }
  }
}

@keyframes play_rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(1turn);
  }
}
</style>
