<template>
  <component :is="componentId"></component>
</template>

<script>
import Common from "./components/Common";
import Promotional from "./components/Promotional";
import { onMounted, computed } from "vue";
import { useAgent } from "@/hooks/useAgent";
import { useParams } from "@/hooks/useParams";
import { useRoute } from "vue-router";

export default {
  name: "exam2",
  components: {
    Common,
    Promotional,
  },
  setup() {
    const route = useRoute();
    const { isMobile } = useAgent();

    const { sendParams } = useParams();
    const { testPaperId, promotionId } = route.query;
    onMounted(async () => {
      sendParams(2);
    });
    const componentId = computed(() => {
      if (promotionId) {
        if (isMobile && false) {
          return "Common";
        } else {
          return "Promotional";
        }
      }
      if (testPaperId) {
        return "Common";
      }
    });
    return {
      componentId,
    };
  },
};
</script>