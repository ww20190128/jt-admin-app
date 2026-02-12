<template>
  <div class="date-content">
    <Select
      class="date-select"
      v-model="year"
      :options="years"
      placeholder="年"
    />
    <Select
      class="date-select"
      v-model="month"
      :options="months"
      placeholder="月"
    />
    <Select
      class="date-select"
      v-model="day"
      :options="days"
      placeholder="日"
    />

  </div>
</template>

<script>
import { computed, reactive, toRefs, watch } from "vue";
import Select from "@/components/Select";
export default {
  name: "DatePicker",
  components: {
    Select,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const visible = computed({
      get() {
        return props.show;
      },
      set(val) {
        ctx.emit("update:show", val);
      },
    });

    const state = reactive({
      year: String(new Date().getFullYear()),
      month: String(
        new Date().getMonth() + 1 >= 10
          ? new Date().getMonth() + 1
          : `0${new Date().getMonth() + 1}`
      ),
      day: String(
        new Date().getDate() >= 10
          ? new Date().getDate()
          : `0${new Date().getDate()}`
      ),
    });

    watch(
      state,
      ({ year, month, day }) => {
        ctx.emit("change", `${year}-${month}-${day}`);
      },
      {
        immediate: true,
        deep: true,
      }
    );

    const years = computed(() => {
      const values = [];
      const year = new Date().getFullYear();
      for (let index = year - 100; index <= year; index++) {
        values.push({
          value: String(index),
          label: index + "年",
        });
      }
      return values;
    });
    const months = computed(() => {
      const values = [];
      for (let index = 1; index <= 12; index++) {
        const month = index >= 10 ? index : `0${index}`;
        values.push({
          value: String(month),
          label: month + "月",
        });
      }
      return values;
    });
    const days = computed(() => {
      let day = 30;
      const day31 = ["01", "03", "05", "07", "08", "10", "12"];
      if (day31.includes(state.month)) {
        day = 31;
      }
      if (state.month === "02") {
        if (
          (state.year % 4 == 0 && state.year % 100 != 0) ||
          state.year % 400 == 0
        ) {
          day = 29;
        } else {
          day = 28;
        }
      }
      const values = [];
      for (let index = 1; index <= day; index++) {
        const day = index >= 10 ? index : `0${index}`;
        values.push({
          value: String(day),
          label: day + "日",
        });
      }
      return values;
    });
    watch(
      () => [state.year, state.month],
      () => {
        const day31 = ["01", "03", "05", "07", "08", "10", "12"];
        if (day31.includes(state.month)) {
          if (state.day === "31") {
            state.day = "";
          }
        }
        if (state.month === "02") {
          if (
            (state.year % 4 == 0 && state.year % 100 != 0) ||
            state.year % 400 == 0
          ) {
            if (Number(state.day) > 29) {
              state.day = "";
            }
          } else {
            if (Number(state.day) > 28) {
              state.day = "";
            }
          }
        }
      }
    );
    return {
      visible,
      ...toRefs(state),
      years,
      months,
      days,
    };
  },
};
</script>

<style lang="less" scoped>
.date-content {
  display: flex;
  justify-content: space-between;
  .date-select {
    margin: 0 3px;
  }
}
</style>