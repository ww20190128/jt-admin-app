<template>
	<component :is="components[data.setting.fan_type]" :data="data"></component>
</template>

<script>
import { reactive, toRefs } from "vue";
import FWJG01 from "./01";
import FWJG02 from "./02";
import FWJG03 from "./03";
import FWJG04 from "./04";
import FWJG05 from "./05";
export default {
	name: "ZJGJF",
	props: {
		data: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {
		FWJG01,
		FWJG02,
		FWJG03,
		FWJG04,
		FWJG05,
	},
	setup() {
		const state = reactive({
			components: {
				1: "FWJG01",
				2: "FWJG02",
				3: "FWJG03",
				4: "FWJG04",
				5: "FWJG05",
			},
		});
		return {
			...toRefs(state),
		};
	},
};
</script>

<style lang="less" scoped></style>
