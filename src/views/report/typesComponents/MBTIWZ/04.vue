<template>

	<div class="MBTIWZ-04">

		<!-- 总结过分析 -->
		<div class="top" v-if="wz_info?.total_result_explain">
			<RichTextBody :data="wz_info?.total_result_explain" />
		</div>

		<!-- <div class="top">
		<LargeTitle
		  :label="setting?.title1"
		  :icon="setting?.title_icon_tag1"
		/>

		<RichTextBody :data="setting?.jianjie" />
  

		<MeshChart :options="options" />
  
		<Warning
		  :data="setting?.zhuyi"
		  title="注意事项"
		  icon="fa vaaeq fa-bullhorn"
		/>
	  </div> -->

		<div class="bottom">
			<!-- 标题2 -->
			<LargeTitle :label="setting?.title2" :icon="setting?.title_icon_tag2" />
			<!-- 标题2介绍 -->
			<RichTextBody :data="setting?.title2_jieshao" />

			<!-- <Tabs v-model:active="active">
		  <TabItem
			:name="index"
			v-for="(item,index) in wz_list.slice(0,4)"
			:key="item.id"
		  >
			{{item.weidu_name}}
		  </TabItem>
  
		</Tabs> -->

			<!-- 具体结果分析 -->
			<RichTextBody :data="wz_info?.juti_result_explain" />

		</div>
	</div>

</template>

<script>
import { reactive, toRefs, computed } from "vue";
import Tabs from "../../components/Tabs";
import TabItem from "../../components/Tabs/TabItem";
import RichTextBody from "../../components/RichTextBody";
import LargeTitle from "../../components/LargeTitle";
export default {
	name: "04",
	components: {
		Tabs,
		TabItem,
		RichTextBody,
		LargeTitle,
	},
	props: {
		data: {
			type: Object,
			default: () => ({}),
		},
	},
	setup(props) {
		const state = reactive({
			active: 0,
		});
		//   const indicator = props.data.wz_list.map((v, index) => ({
		// 	text: v.weidu_name,
		// 	max: 100,
		// 	axisLabel: { show: index === 0 ? true : false },
		//   }));
		//   const value = props.data.wz_list.map((v) => v.percent);
		//   const options = {
		// 	value,
		// 	indicator,
		// 	color: props.data.setting.title_icon_color,
		//   };
		// 当前tab展示的内容
		const currentResult = computed(() => {
			return props.data.wz_list[state.active] || {};
		});

		return {
			...toRefs(state),
			...toRefs(props.data),
			currentResult,
			// options,
		};
	},
};
</script>

<style lang="less" scoped>
.name {
	text-align: center;
	font-size: 20px;
	font-weight: bold;
	color: @theme-color;
}
</style>