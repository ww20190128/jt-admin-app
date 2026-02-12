<template>
  <van-popup
    v-model:show="visible"
    closeable
    position="bottom"
    :style="style"
  >
    <div class="popup-content">
      <div class="title">{{ testPaperName }}</div>
			<p>为确保测试结果的信度，</p>
			<p>请先选择性别!</p>
			<div class="options">
				<van-row :gutter="25">
					<van-col span="12" v-for="item in versionConfig?.options" :key="item.id" @click="handleSelectItem(item)">
            
						<div class="item" :class="{ 'active': optionCurrent === item.id }">
							<img class="img" :src="item.img" />
							<p>{{ item.name }}</p>
							<img class="icon" v-if="optionCurrent === item.id" src="@/assets/images/xuanzhong.png" />
						</div>
					</van-col>
				</van-row>
			</div>
     
    </div>
  </van-popup>
</template>

<script>
import { computed ,ref} from "vue";
export default {
  name: "OptionsSelect2",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    current: {
      type: [String, Number, undefined],
    },
    versionConfig: {
      type: Object,
      default: () => {},
    },
    testPaperName:{
      type: String,
    }
  },
  setup(props, ctx) {
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
    const optionCurrent=ref(-1)
    function handleSelectItem(item) {
      optionCurrent.value=item.id
      ctx.emit("update:current", item.id);
      ctx.emit("confirm");
    }
    function confirm() {
      ctx.emit("confirm");
    }
    return {
      style,
      handleSelectItem,
      confirm,
      visible,
      optionCurrent
    };
  },
};
</script>

<style lang="less" scoped>

.popup-content {
	width: 90%;
	position: absolute;
	top: 100px;
	left: 5%;
	// margin-top: 80px;
	background: #fff;
	// margin: 100px 20px 0 20px;
	border-radius: 10px;
	border: 2px solid #dfdfdf;
	padding-bottom: 40px;

	.title {
		font-size: 22px;
		text-align: center;
		font-weight: bold;
		color: #333;
		padding-top: 40px;
		margin-bottom: 20px;

	}

	p {
		font-size: 12px;
		color: #666;
		text-align: center;
		margin-top: 5px;

	}

	.options {
		display: flex;
		justify-content: center;
		padding: 30px 0;

		.item {
			width: 110px;
			height: 110px;
			border-radius: 50%;
			background-color: #fff;
			// padding: 30px;
			border: 3px solid #f5f5f5;
			.align-center();
			flex-direction: column;
			position: relative;

			.img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}

			.icon {
				width: 30px;
				height: 30px;
				position: absolute;
				right: 0;
				top: 75px
			}

			p {
				font-size: @font-size-lg;
				padding-top: 18px;
			}
		}

		.active {
			border-color: #f4ea2a;
		}
	}


}
</style>