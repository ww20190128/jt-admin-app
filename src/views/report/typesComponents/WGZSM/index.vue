<template>
	<div class="WGZSM">
		<component
			:is="components[data.setting?.rule_type]"
			:data="data"
		></component>
	</div>
</template>

<script>
import { reactive, toRefs } from "vue";
import WGZSM01 from "./01";
import WGZSM02 from "./02";
import WGZSM03 from "./03";
export default {
	name: "WGZSM",
	props: {
		data: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {
		WGZSM01,
		WGZSM02,
		WGZSM03,
	},

	setup() {
		const state = reactive({
			components: {
				1: "WGZSM01",
				2: "WGZSM02",
				3: "WGZSM03",
			},
		});
		return {
			...toRefs(state),
		};
	},
};
</script>

<style lang="less" scoped>
.WGZSM {
	background-color: #fff;
	margin-bottom: @padding-base;
	padding-bottom: @padding-base;
}
</style>
