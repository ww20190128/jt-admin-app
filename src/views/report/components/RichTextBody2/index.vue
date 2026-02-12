<template>

    <div class="center"
      :style="{ height: !obj.fay ? '' : height + 'px', overflow: !obj.fay ? '' : 'hidden', marginBottom: obj.show ? '30px' : '' }"
      :id="'myElement1'">
      <div :id="'content1'">
  
        <div class="rich-text" v-html="data" v-if="data"></div>
      </div>
      <div v-if="obj.show">
        <div class="mask" id="mask" style="height:180px" v-if="obj.fay">
          <div class="butzk" @click="onzhankai(1)">展开全部 <i class="fa fa-caret-down"></i>
          </div>
        </div>
        <div class="mask2" v-else>
          <div class="butzk2" @click="onzhankai(2)">点击收起 <i class="fa fa-caret-up"></i>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { reactive, toRefs, computed, watch, onMounted, nextTick, ref } from "vue";
  export default {
    name: "RichTextBody",
    props: {
      data: {
        type: String,
      },
    },
    setup(props) {
      const { data } = props;
      const state = reactive({
        active: 0,
        fay: true,
        offsetTop: [],
        initial: 0,
        show: true,
        obj: {
          fay: true,
          fay2: true,
          show: true,
  
        }
      });
  
      const currentResult = computed(() => {
        return props.data.fanthreeList[state.active] || {};
      });
      const height = document.documentElement?.clientHeight / 2 - 50; //实时屏幕高度
  
      function onzhankai(fay) {
        state.fay = !state.fay;
  
  
        const element = document.querySelector("#myElement1")
        // const element2 = document.querySelector("#box")
        let offsetTop = element?.offsetTop;
        // if (index == 0) {
        //   offsetTop = element2?.offsetTop;
        // }
        if (fay == 1) {
          state.obj.fay = !state.obj.fay
        }
        scrollTo(offsetTop, fay)
      }
      const myElement = ref(null);
      function scrollTo(offsetTop, fay) {
        // const parent = document.querySelector('.JFPLT-07')
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        })
        //延时执行
        setTimeout(() => {
          if (fay == 2) {
            state.obj.fay = true
          }
        }, 200)
  
  
      }
      onMounted(async () => {
        await nextTick(); // 等待DOM更新
        state.offsetTop = []
        // 获取DOM元素的引用
  
        state.obj.fay = true
        state.obj.fay2 = true
        state.obj.show = true;
        // item.height = document.querySelector("#content" + (index + 1)) / 2;
        let element = document.querySelector("#myElement1"); // 获取DOM元素的引用
        if (element) {
          let height = element.offsetHeight;
          const height2 = document.documentElement?.clientHeight / 2 - 50; //实时屏幕高度
          //取整数
  
          if (height < height2) {
            state.obj.fay = false
            state.fay = false;
            state.obj.show = false;
          }
  
        }
  
  
      });
  
  
      return {
  
        ...toRefs(state),
        currentResult,
        onzhankai,
        height
      };
    },
  };
  </script>
  
  <style lang="less" scoped>
  .rich-text {
    font-size: @font-size-lg;
    color: @light-black;
    line-height: 30px;
    padding: @padding-sm 0;
  }
  
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
    bottom: 10px;
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
    bottom: 10px;
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
    // margin-top: 30px;
  }
  
  .mask {
    width: 100%;
    // background: #fff;
    //从下到上，白色渐变色，白色占大部分
    background: linear-gradient(to top, white 30%, transparent 100%);
    // background: linear-gradient(to top, #fff, rgba(255, 255, 255, 0));
    position: absolute;
    bottom: 0px;
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
  </style>ss