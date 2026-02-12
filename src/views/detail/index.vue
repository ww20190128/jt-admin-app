
<template>
  <component :is="componentId"></component>
</template>
<script>
import Common from "./components/Common"; // 一般详情页
import Promotional from "./components/Promotional"; // 推广详情页
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted } from "vue";
import { useParams } from "@/hooks/useParams";

export default {
  name: "detail",
  components: {
    Common,
    Promotional,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { testPaperId, promotionId } = route.query;
    const componentId = computed(() => {
      if (promotionId) { // 推广ID
        return "Promotional";
      }
      if (testPaperId) {
        return "Common";
      }
    });
    const { sendParams } = useParams();
    onMounted(() => {
      if (!testPaperId && !promotionId) {
        router.replace("/");
        return;
      }
      if(promotionId) {
        return;
      }
      sendParams(1);
    });
    return {
      componentId,
    };
  },
};
</script>