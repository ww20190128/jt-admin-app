<template>
  <BaseDialog v-bind="$attrs" :showConfirmButton="false">
    <div class="withdraw-warper">
      <div class="title-warper">
        <div class="left">提现金额</div>
        <img :src="withdrawIcon" class="right" />
      </div>
      <div class="input-warper">
        <div class="left">
          <i class="icon fa fa-jpy"></i
          ><input
            type="text"
            @input="onInput"
            v-model="inputValue"
            v-numberOnly
            placeholder="请输入提现金额"
          />
        </div>
        <div class="right" @click="withdrawAll">全部提现</div>
      </div>
      <p class="desc">提现到<span>微信钱包</span></p>
      <div
        class="button"
        :class="{ active: inputValue > 0 }"
        @click="submitWithdraw"
      >
        立即提现
      </div>
      <p class="text">提现金额200元以内实时到账。超出200元，3个工作日内完成打款结算，不收取手续费</p>
    </div>
    <div class="close-button" @click="close">
      <van-icon name="close" />
    </div>
  </BaseDialog>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";
import BaseDialog from "@/components/BaseDialog";
import withdrawIcon from "@/assets/images/icon/icon-withdraw.png";
export default {
  name: "Withdraw",
  props: {
    value: {
      type: [Number],
      default: "",
    },
    maxValue: {
      type: [Number],
      default: "",
    },
  },
  components: { BaseDialog },
  setup(props, ctx) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const state = reactive({});
    function close() {
      ctx.emit("update:show", false);
      ctx.emit("update:value", 0);
    }

    const inputValue = computed({
      get: () => props.value,
      set: (value) => ctx.emit("update:value", value),
    });

    function onInput(e) {
      let value = e.target.value;
      // 只允许输入数字和一个小数点
      value = value.replace(/[^\d.]/g, "");
      // 只保留一个小数点
      if (value.match(/\./g) && value.match(/\./g).length > 1) {
        value = value.replace(/\.([^.]*)$/, "");
      }
      // 转换为数字类型以便比较大小
      const numValue = parseFloat(value);
      if (
        isNaN(numValue) ||
        numValue <= 0 ||
        (props.maxValue && numValue > props.maxValue)
      ) {
        // 如果输入值不合法，将输入值重置为之前合法的值
        value = inputValue.value;
      }
      ctx.emit("update:value", value);
    }
    function submitWithdraw() {
      ctx.emit("submitWithdraw");
    }
    // 设置最大提现金额为200
    function withdrawAll() {
      ctx.emit("update:value", props.maxValue);
      //   this.inputValue = props.maxValue;
    }

    return {
      ...toRefs(state),
      close,
      withdrawIcon,
      onInput,
      inputValue,
      submitWithdraw,
      withdrawAll,
    };
  },
};
</script>

<style lang="less" scoped>
.close-button {
  font-size: 35px;
  position: absolute;
  left: 50%;
  bottom: 10px;
  color: #fff;
  transform: translateX(-50%) translateY(0%);
  z-index: 999;
}

.withdraw-warper {
  padding: 30px 20px 80px 20px;
  position: relative;
  height: auto;
  background-image: linear-gradient(
    to top,
    #f3e7e9 0%,
    #e3eeff 99%,
    #e3eeff 100%
  );

  .title-warper {
    width: 100%;
    height: 50px;
    margin-bottom: 15px;
    color: @light-black;
    .space-between();
    width: 100%;

    .left {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      font-size: 20px;
      font-weight: 500;
      line-height: 20px;
    }

    .right {
      height: 60px;
      width: auto;
      display: flex;
      align-items: center;
      font-size: @font-size-base;
      color: @light-black;
    }
  }

  .input-warper {
    border-bottom: 1px solid @light-black;
    width: 100%;
    margin-bottom: 5px;
    .space-between();

    .left {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
        font-size: 24px;
        text-align: center;
        color: @light-black;
        line-height: 40px;
      }

      input {
        text-align: left;
        background: transparent;
        font-weight: 200;
        border: none;
        color: @light-black;
        font-size: @font-size-lg;
      }
    }

    .right {
      width: 220px;
      height: 40px;
      display: flex;
      align-items: center;
      font-size: @font-size-base;
      color: @light-black;
    }
  }

  .desc {
    font-size: @font-size-base;
    color: @gray-color;

    span {
      font-size: @font-size-base;
      color: #ff5d5e;
    }
  }

  .button {
    margin-top: 40px !important;
    margin: 20px 30px 10px 30px;
    height: 30px;
    line-height: 30px;
    // background-color: @gray-color;
    background-color: @theme-color !important;
    text-align: center;
    border-radius: 20px;
    font-size: @font-size-lg;
    color: #fff;
    transition: transform 0.3s ease;
    &:active {
      transform: scale(0.95);
    }
    &.active {
      background-color: @theme-color !important;
    }
  }

  .text {
    font-size: @font-size-sm;
    color: @gray-color;
    line-height: 20px;
  }
}
</style>
