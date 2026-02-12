<template>
    <transition name="el-fade-in">
        <div v-show="visible" class="back-mindfulnness" @click.stop="onClick">
            <slot>
                <van-icon name="arrow-up" />
            </slot>
        </div>
    </transition>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { throttle } from "lodash";
import { useEventListener } from "@/hooks/useEventListener";

export default {
    name: "BackMindfulnness",
    props: {
        visibilityHeight: {
            type: Number,
            default: 200,
        },
        target: {
            type: String,
            default: "",
        },
    },
    emits: ["click"],
    setup(props, ctx) {
        return {

        };
    },
};
</script>
<style lang="less" scoped>
.back-mindfulnness {
    position: absolute;
    bottom: 50%;
    right: 0;
    height: 40px;
    width: 40px;
    // display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 0 6px #0000001f;
    cursor: pointer;
    border-radius: 50%;
    position: fixed;
    right: calc((100vw - 355px) / 2 + 20px);
   
    z-index: 999;
    background-color: red;
}
</style>