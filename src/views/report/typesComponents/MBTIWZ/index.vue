<template>
	<component :is="components[data.setting?.wz_type]" :data="data"></component>
</template>

<script>
import { reactive, toRefs } from "vue";
import MBTIWZ01 from "./01";
import MBTIWZ02 from "./02";
import MBTIWZ03 from "./03";
import MBTIWZ04 from "./04";
export default {
	name: "MBTIWZ",
	props: {
		data: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {
		MBTIWZ01,
		MBTIWZ02,
		MBTIWZ03,
		MBTIWZ04,
	},

	setup() {
		const state = reactive({
			components: {
				1: "MBTIWZ01",
				2: "MBTIWZ02",
				3: "MBTIWZ03",
				4: "MBTIWZ04",
			},
		});
		return {
			...toRefs(state),
		};
	},
};
</script>