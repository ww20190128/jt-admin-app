<template>
  <component :is="componentId"></component>
  <!-- <ToCustomer></ToCustomer> -->
</template>

<script>
import General from "./components/General";
import Promotional from "./components/Promotional";
import { useRoute } from "vue-router";
import { computed, onMounted, onBeforeUnmount } from "vue";
import { useAgent } from "@/hooks/useAgent";
import { useParams } from "@/hooks/useParams";
import { shareWx } from "@/hooks/shareWx";
// import ToCustomer from '../goods/components/customer'

export default {
  name: "exam",
  components: {
    General,
    Promotional,
    // ToCustomer
  },
  setup() {
    const route = useRoute();

    const { isMobile } = useAgent();
    const { sendParams, sendParamsV2 } = useParams();
    const { testOrderId, testPaperId, promotionId } = route.query;

    // 组件卸载时移除两个脚本
    // onBeforeUnmount(() => {
    //   removeScript(`#script_${testOrderId}_${1}`);
    //   removeScript(`#script_${testOrderId}_${2}`);
    // });
    // 移除脚本函数
    // function removeScript(id) {
    //   document.querySelector(id)?.remove();
    // }
    // 创建脚本函数
    // function createScript(testOrderId, type, el) {
    //   const script = document.createElement("script");
    //   script.setAttribute("type", "text/javascript");
    //   script.setAttribute("id", `script_${testOrderId}_${type}`);
    //   script.setAttribute(
    //     "src",
    //     `${process.env.VUE_APP_BASE_API}/v1/goods_order/pay_page_script?testOrderId=${testOrderId}&type=${type}`
    //   );
    //   document[el].appendChild(script);
    // }

    onMounted(async () => {
      shareWx({ testPaperId: testPaperId, promotionId: promotionId });
      // createScript(testOrderId, 1, "head");
      // createScript(testOrderId, 2, "body");
      sendParams(3);
      // sendParamsV2(3);
    });

    const componentId = computed(() => {
      if (promotionId) {
        if (isMobile) {
          return "General";
        } else {
          return "Promotional";
        }
      } else {
        return "General";
      }
    });
    return {
      componentId,
    };
  },
};
</script>
