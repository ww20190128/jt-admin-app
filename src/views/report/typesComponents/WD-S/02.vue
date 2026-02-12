<template>

  <div class="WD-S-02">
    <LargeTitle :label="setting?.title" :icon="setting?.title_icon_tag" />

    <!-- 简介内容 -->
    <RichTextBody :data="setting?.jianjie" />


    <div v-if="setting?.show_type == 1">
      <div v-for="(item2, index) in weiduList" :key="item2.id" id="box">

        <div class="center" :style="{ height: !item2.fay ? '' : height + 'px', overflow: !item2.fay ? '' : 'hidden' }"
          :id="'myElement' + (index + 1)">
          <div class="tab-item1">
            {{ item2.weidu_name }}
            <!-- <div class="bottomicon"></div> -->
          </div>
          <div :id="'content' + (index + 1)">
            <!-- 结果 -->
            <ResultName :title="item2.weidu_name" :result="item2.weidu_result?.name" :color="item2.extend.tubiao_color"
              titleColor="#5a5a5a" />
            <PositionBar :value="item2.last_percent"
              :multi="[item2.extend?.duorenshu?.min_score, item2.extend?.duorenshu?.max_score]"
              :color="item2.extend.tubiao_color" />

            <!-- 结果分析 -->
            <RichTextBody :data="item2.weidu_result?.result_explain" />

            <!-- 建议 -->
            <Suggest :data="item2.weidu_result?.jianyi" />

            <!-- 小贴士 -->
            <Warning :data="item2.weidu_result?.zhuyi" title="小贴士" icon="fa vaaeq fa-bullhorn" />
          </div>
          <div v-if="item2.show">
            <div class="mask" id="mask" style="height:180px" v-if="item2.fay">
              <div class="butzk" @click="onzhankai(index, 1)">展开全部 <i class="fa fa-caret-down"></i>
              </div>
            </div>
            <div class="mask2" v-else>
              <div class="butzk2" @click="onzhankai(index, 2)">点击收起 <i class="fa fa-caret-up"></i>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <div v-else>
      <Tabs v-model:active="active">
        <TabItem :name="index" v-for="(item, index) in weiduList" :key="item.id">
          {{ item.weidu_name }}
        </TabItem>

      </Tabs>

      <!-- 结果 -->
      <ResultName :title="currentResult.weidu_name" :result="currentResult.weidu_result?.name"
        :color="currentResult.extend.tubiao_color" titleColor="#5a5a5a" />
      <PositionBar :value="currentResult.last_percent"
        :multi="[currentResult.extend?.duorenshu?.min_score, currentResult.extend?.duorenshu?.max_score]"
        :color="currentResult.extend.tubiao_color" />

      <!-- 结果分析 -->
      <RichTextBody :data="currentResult.weidu_result?.result_explain" />

      <!-- 建议 -->
      <Suggest :data="currentResult.weidu_result?.jianyi" />

      <!-- 小贴士 -->
      <Warning :data="currentResult.weidu_result?.zhuyi" title="小贴士" icon="fa vaaeq fa-bullhorn" />
    </div>


  </div>

</template>

<script>
import { reactive, toRefs, computed, onMounted, nextTick, ref } from "vue";
import Tabs from "../../components/Tabs";
import TabItem from "../../components/Tabs/TabItem";
import PositionBar from "../../components/PositionBar";
import Suggest from "../../components/Suggest";
import Warning from "../../components/Warning";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
import ResultName from "../../components/ResultName";
export default {
  name: "02",
  components: {
    PositionBar,
    Tabs,
    TabItem,
    Suggest,
    Warning,
    LargeTitle,
    RichTextBody,
    ResultName,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const state = reactive({
      active: 0,
      show: true,
      fay: true,
      offsetTop: [],
      initial: 0,
    });
    // 当前tab展示的内容
    const currentResult = computed(() => {
      return props.data.weiduList[state.active] || {};
    });
    const height = document.documentElement?.clientHeight / 2-50; //实时屏幕高度

    function onzhankai(index, fay) {
      state.fay = !state.fay;


      const element = document.querySelector("#myElement" + (index + 1))
      // const element2 = document.querySelector("#box")
      let offsetTop = element?.offsetTop;

      if (fay == 1) {
        props.data.weiduList[index].fay = !props.data.weiduList[index].fay
      }
      scrollTo(offsetTop, fay, index)
    }
    const myElement = ref(null);
    function scrollTo(offsetTop, fay, index) {
      // const parent = document.querySelector('.JFPLT-07')
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
      //延时执行
      setTimeout(() => {
        if (fay == 2) {
          props.data.weiduList[index].fay = true
        }
      }, 200)


    }
    onMounted(async () => {
      await nextTick(); // 等待DOM更新
      state.offsetTop = []
      // const element = myElement.value; // 获取DOM元素的引用
      // 获取DOM元素的引用
      props.data.weiduList.forEach((item, index) => {
        // let jieguo = item.weidu_result.name.length;
        // let jiefx = item.weidu_result?.result_explain.length;
        // let jieyi = item.weidu_result?.jianyi.length;
        // let zhuyi = item.weidu_result?.zhuyi.length;

        // let total=jieguo+jiefx+jieyi+zhuyi
        item.fay = true
          item.fay2 = true
          item.show = true;
        // item.height = document.querySelector("#content" + (index + 1)) / 2;
        let element = document.querySelector("#myElement" + (index + 1));// 获取DOM元素的引用
        if (element) {
          let height = element.offsetHeight;
          const height2 = document.documentElement?.clientHeight / 2 + 400; //实时屏幕高度

          if (height < height2) {
            item.fay = false
            state.fay = false;
            item.show = false;
          } 

         
          // item.height = parseInt(height / 3 + 300 > parseInt(height2) ? parseInt(height2) : height / 3 + 300)
          // let rect = element.offsetTop; // 获取元素相对于视口的位置信息
          // state.offsetTop.push(rect + 200)
        }
      });

    });
    return {
      ...toRefs(state),
      ...toRefs(props.data),
      currentResult,
      onzhankai,
      height
    };
  },
};
</script>

<style lang="less" scoped>


.butzk {
  width: 140px;
  height: 35px;
  border-radius: 35px;
  background: #f1f2f8;
  color: #666e94;
  text-align: center;
  line-height: 35px;
  font-size: 16px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.butzk2 {
  width: 140px;
  height: 35px;
  border-radius: 35px;

  background: #f1f2f8;
  color: #666e94;
  text-align: center;
  line-height: 35px;
  font-size: 16px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.tab-item1 {
  color: #000;
  border-radius: 8px 8px 0 0;
  font-size: 20px;
  padding: 14px 0;
  flex: 1;
  text-align: center;
  // border-bottom: 1px solid #dddddd;
  margin-bottom: @padding-base;
  background-color: #fcdde5;
  font-weight: bold;
  position: relative;
  margin-top: 30px;
}

.mask {
  width: 100%;
  // background: #fff;
  //从下到上，白色渐变色，白色占大部分
  background: linear-gradient(to top, white 30%, transparent 100%);
  // background: linear-gradient(to top, #fff, rgba(255, 255, 255, 0));
  position: absolute;
  bottom: 0px;
  z-index: 99;
}

.mask2 {
  width: 100%;
  //从下到上，白色渐变色，白色占大部分
  // background: linear-gradient(to top, #fff, rgba(255, 255, 255, 0));
  // // background: linear-gradient(to top, #fff, rgba(255, 255, 255, 0));
  // position: absolute;
  // bottom: 0;
  height: 65px;
}

.center {
  position: relative;
  // background-color: #f2fcff;
  border-radius: 8px;
  margin-bottom: 30px;
  // padding: 0 10px;
}
</style>