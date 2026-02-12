<template>
  <div class="RW-01">
    <div class="top">
      <LargeTitle :label="setting?.title1" :icon="setting?.title_icon_tag1" />
      <!-- 智商 -->
      <div class="large-num">
        {{ professionInfo.zhishang }}
      </div>
      <!-- 智商评估结果 -->
      <div class="large-text">
        {{ professionInfo.zhiliPinggu }}
      </div>

      <!-- 象形图 -->
      <!-- <PictorialBarChart :options="options" /> -->

      <!-- 总结果分析 -->
      <RichTextBody :data="ruiwenOrdInfo?.total_result_content" />

      <!-- 注意事项 -->
      <div class="notice-card">
        <i class="fa fa-exclamation-circle"></i> {{ setting?.zhuyi1 }}
      </div>
      <!-- 海报 -->
      <Poster v-if="setting?.share_switch" :img="setting?.share_image" :text="setting?.share_btn_text">
        <div class="poster-text">
          <p class="num"> {{ professionInfo.zhishang }}</p>
          <p class="title"> {{ professionInfo.zhiliPinggu }}</p>
          <p class="title-text"> 超过{{ ageGroup?.min_age }}岁-{{ ageGroup?.max_age }}岁年龄组{{ professionInfo.percent
            }}%以上的测试者
          </p>
        </div>
      </Poster>
    </div>


  </div>
</template>

<script>
import { toRefs } from "vue";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
import Warning from "../../components/Warning";
import PictorialBarChart from "../../components/Charts/PictorialBarChart";
import Poster from "../../components/Poster";
export default {
  name: "01",
  components: {
    LargeTitle,
    RichTextBody,
    PictorialBarChart,
    Warning,
    Poster,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    // const data = props.data.fantwoList.map((v) => ({
    //   name: v.weidu_name,
    //   value: v.last_percent,
    // }));

    const options = {
      value: props.data.professionInfo.percent,
    };
    return {
      ...toRefs(props.data),
      options,
    };
  },
};
</script>

<style lang="less" scoped>
// PC海报样式
@import "../../components/Poster/media.less";

.poster-text {
  position: absolute;
  left: 50%;
  top: 190px;
  transform: translateX(-50%);
  width: 100%;
  color: #fff;
  font-size: @font-size-base;
  text-align: center;

  .num {
    font-size: 50px;
  }

  .title {
    font-size: 22px;
  }

  .title-text {
    padding-top: @padding-base;
    color: #d3d3d4;
  }
}

.notice-card {
  border: 1px solid #ece7cc;
  font-size: @font-size-base;
  background-color: @bg-color;
  color: @light-black;
  border-radius: 5px;
  line-height: 1.8;
  padding: 5px;

  i {
    color: @theme-color;
  }
}


.large-text,
.large-num {
  font-weight: bold;
  text-align: center;
}

.large-num {
  margin: 0 auto;
  background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);
  width: 120px;
  height: 120px;
  line-height: 120px;
  border-radius: 50%;
  color: #cf1326;
  font-size: 52px !important;
}

.large-text {
  margin-top: 20px;
  margin-bottom: 20px;
  color: @theme-color;
  font-size: 30px !important;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 20%;
    height: 2px; // 下划线的粗细
    background-color: #ffd427; // 下划线的颜色
    opacity: 0.3;
    position: absolute;
    bottom: -8px; // 调整下划线与文字的距离
    left: 50%;
    transform: translateX(-50%);
  }
}

.text {
  color: #df757f;
  text-align: center;
  font-size: @font-size-lg;
}

.job-list {
  color: @light-black;
  line-height: 40px;
  font-size: 17px;

  li {
    font-size: 17px;
    position: relative;
    padding-left: 40px;

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 20px;
      transform: translateY(-50%);
      width: 12px;
      height: 12px;
      background: #5e5e5e;
      border-radius: 50%;
    }
  }
}
</style>