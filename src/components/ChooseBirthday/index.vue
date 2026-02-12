<template>
  <div>
    <van-popup
      v-model:show="visible"
      position="top"
      :style="style"
      class="popup"
      teleport="body"
    >
      <div class="popup-content">
        <div class="popup-title">
          <div class="title">请选择您的年龄</div>
        </div>
        <div class="form-item">
          <div class="label">年龄:</div>
          <div @click="handleChoose" class="form-input">
            {{ dateValue || "请选择" }}
            <img src="../../assets/images/right.png" />
          </div>
        </div>
        <div class="rich-text" v-html="ageSet?.title"></div>
        
        <div class="buttons">
          <div
            class="button"
            :class="{ disabled: !dateValue }"
            @click="confirm"
          >
            {{ ageSet?.location == 'end' ? "查看报告 " : "继续" }}
          </div>
        </div>
        <div class="warm-prompt" v-if="ageSet?.desc">
          <p class="warm">温馨提示:</p>
          <div v-html="ageSet?.desc" class="desc"></div>
        </div>
      </div>
    </van-popup>

    <van-popup
      v-model:show="showPicker"
      round
      teleport="body"
      position="bottom"
      class="picker-content"
    >
      <van-picker
        ref="pickerRef"
        :columns="columns"
        @cancel="onConfirm"
        @confirm="onConfirm"
        @change="(value) => (dateValue = value)"
        :default-index="15"
      />
    </van-popup>
  </div>
</template>

<script>
import { toRefs, reactive, computed, watch, ref } from "vue";
import moment from "moment";
import { useRoute } from "vue-router";
import { Toast } from "vant";
import { useAgent } from "@/hooks/useAgent";
import DatePicker from "./DatePicker";
import "@vant/touch-emulator";
export default {
  name: "ChooseBirthday",
  components: {
    DatePicker,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    ageSet: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const state = reactive({
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      dateValue: "",
      showPicker: false,
      columns: new Array(70).fill(1).map((e, i) => 5 + i),
    });
    const { testOrderId } = useRoute().query;
    const { isMobile } = useAgent();
    const style = {
      height: "100%",
      backgroundColor: "#F5F5F5",
    };
    const visible = computed({
      get() {
        return props.show;
      },
      set(val) {
        ctx.emit("update:show", val);
      },
    });
    function confirm() {
      if (!state.dateValue) {
        return Toast("请选择你的年龄");
      }
      ctx.emit("confirm", state.dateValue);
    }
    function datePickerChange(value) {
      state.dateValue = value;
      state.currentDate = new Date(value);
    }

    // 生日选择确定按钮
    function handleDateConfirm(value) {
      state.dateValue = moment(value).format("YYYY-MM-DD");
    }
    function handleChoose() {
      state.showPicker = true;
    }
    const onConfirm = (e) => {
      state.dateValue = e;
      state.showPicker = false;
    };
    const pickerRef = ref(null);
    watch(
      () => state.showPicker,
      (val) => {
        if (!val) {
          const values = pickerRef.value.getValues();
          const [value] = values;
          state.dateValue = value;
        }
      }
    );
    return {
      style,
      handleChoose,
      handleDateConfirm,
      onConfirm,
      confirm,
      ...toRefs(state),
      visible,
      isMobile,
      datePickerChange,
      pickerRef,
    };
  },
};
</script>

<style lang="less">
@media screen and (min-width: @max-device-width) {
  .picker-content {
    width: @max-device-width;
    left: 50%;
    transform: translateX(-50%);
    max-height: 200px;
    overflow: hidden;
  }
}
</style>
<style lang="less" scoped>
@media screen and (min-width: @max-device-width) {
  .popup-content {
    width: @max-device-width;
    margin: 0 auto;
    .scroll-bar();
  }
}

.popup-content {
  padding: 30px;
  color: @light-black;

  .popup-title {
    background: #fff;
    border-radius: 4px 4px 4px 4px;
    .title {
      font-size: @font-size-lg;
    }
    .pop-text {
      font-size: 14px;
      line-height: 36px;
      border-radius: 0px 0px 4px 4px;
      padding: 8px 10px;
      background-color: #fff;

      span {
        font-weight: bold;
      }

      .input {
        height: 34px;
        width: 180px;
        margin: 0 4px;
        padding-left: 6px;
        border: 1px solid #ccc;
        border-radius: 2px;
        display: inline-block;
      }

      .placeholder {
        color: gray;
      }
    }
  }

  .title {
    font-size: 18px;
    // text-align: center;
    font-weight: bold;
    // padding-bottom: @padding-sm;
    background: #ff5d7d;
    text-align: center;
    color: #fff;
    line-height: 44px;
    padding-left: 10px;
    border-radius: 4px 4px 0 0;
  }

  .rich-text {
    line-height: 25px;
    font-size: 14px;
    padding: 10px;
    background-color: #fff;
  }

  .choose {
    display: flex;
    justify-content: space-between;
    font-size: @font-size-base;
    padding-top: @padding-sm;

    .left {
      color: @theme-color;
      display: flex;
      align-items: flex-end;
    }

    .right {
      display: flex;
      align-items: center;
    }

    .mid {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 160px;

      &.input-body {
        border-bottom: 1px solid #cccccc;
      }

      input {
        background-color: transparent;
        border: none;
        text-align: center;
        color: transparent;
        text-shadow: 0 0 0 #000;
        pointer-events: none;
      }
    }

    img {
      width: 18px;
    }
  }

  .buttons {
    display: flex;
    flex-direction: column;
    align-items: center;

    .button {
      background-color: @theme-color;
      font-size: 15px;
      height: 38px;
      width: 100%;
      border-radius: 38px;
      color: #fff;
      line-height: 38px;
      text-align: center;
      margin-top: 25px;

      &.disabled {
        background-color: #c9c7c8;
      }

      &.plain {
        margin-top: 5px;
        color: #737373;
        background-color: transparent;
        font-size: @font-size-base;

        span {
          border-bottom: 1px solid #737373;
        }
      }
    }
  }

  .warm-prompt {
    margin-top: 30px;
    color: #979797;
    font-size: @font-size-sm;
    padding: 10px;
    text-align: left;
    line-height: 24px;
    background: #fff;
    .warm {
      font-size: @font-size-base !important;
    }
    .desc {
      
    }
  }
}

.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0.26667rem;
  height: 50px;
  font-size: 16px;
  border-bottom: 1px solid #ebebeb;
  background-color: #fff;

  .label {
    font-size: 16px;
    font-weight: bold;
  }

  .form-input {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex: 1;
    color: #1989fa;
    
    img {
      width: 15px;
    }
  }
}

.van-picker {
  height: 400px;
}
</style>
