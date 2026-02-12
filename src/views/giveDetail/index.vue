<template>
    <!-- 领取 -->
    <UserGet
      v-if="info?.id && ((!info?.isGiveUser && !info?.isDrawUser) || info?.isDrawUser)"
      :info="info"
    />
    <!-- 赠送 -->
    <UserGive
      v-if="info?.id && info?.isGiveUser"
      :info="info"
    />
  
  </template>
  
  <script>
  import { reactive, toRefs } from "vue";
  import { useRoute } from "vue-router";
  import UserGive from "./components/UserGive";
  import UserGet from "./components/UserGet";
  import { useAuth } from "@/hooks/useAuth";
  // api 接口
  import { giveInfo } from "@/api/give";
  export default {
    name: "giveDetail",
    components: {
      UserGive,
      UserGet,
    },
  
    setup() {
      const route = useRoute();
      const state = reactive({
        info: {},
      });
      const { giveId } = route.query;
      // 授权钩子
      useAuth(
        {
          authType: 2,
        },
        init
      );
  
      async function init() {
        const { info } = await giveInfo({ giveId });
        state.info = info;
      }
  
      return {
        ...toRefs(state),
      };
    },
  };
  </script>
  
  <style lang="scss" scoped>
  </style>