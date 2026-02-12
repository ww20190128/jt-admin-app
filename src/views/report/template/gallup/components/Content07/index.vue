<script setup>
import { computed } from "vue";
import ContentWrapper from "../ContentWrapper";

const props = defineProps({
	data: {
		type: Object,
	},
});

const setting = computed(() => props.data?.setting);
</script>

<template>
	<ContentWrapper :title="setting?.title" v-if="setting?.title && setting?.content">
		<!-- <div class="title">
			<i :class="[setting?.title_icon_tag]" class="fa"></i>
			{{ setting?.title }}
		</div> -->
		<div class="wrapper" v-html="setting?.content"></div>
	</ContentWrapper>
</template>

<style lang="less" scoped>

</style>
