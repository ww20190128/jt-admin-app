<template>

    <div class="JFPLT-04">

        <div class="top">
            <!-- 标题1 -->
            <LargeTitle
                :label="setting?.title1"
                :icon="setting?.title_icon_tag1"
            />
            <!-- 总结果说明 -->
            <RichTextBody :data="pl_list?.extend?.total_result_shuoming" />
        </div>
        <div class="top">
            <!-- 标题2 -->
            <LargeTitle
                :label="setting?.title2"
                :icon="setting?.title_icon_tag2"
            />
            <div class="row-bar">
                <div
                    class="item"
                    v-for="[left, right] in tubiaoList"
                >
                    <div class="letter">{{ left.title }}</div>
                    <div class="bar">
                        <div class="left">
                            <div
                                class="value"
                                :style="{ width: `${left.percent}%` }"
                            >{{ left.percent }}%</div>
                        </div>
                        <div class="right">
                            <div
                                class="value"
                                :style="{ width: `${right.percent}%` }"
                            >{{ right.percent }}%</div>
                        </div>
                    </div>
                    <div class="letter">{{ right.title }}</div>
                </div>
            </div>


            <!-- 图表说明 -->
            <RichTextBody :data="pl_list?.extend?.tubiao_shuoming" />

        </div>

        <div class="bottom">
            <!-- 结果分析 -->
            <RichTextBody :data="pl_list?.extend?.xiangxi" />

        </div>
    </div>

</template>

<script>
import { toRefs } from "vue";

import RichTextBody from "../../components/RichTextBody";
import LargeTitle from "../../components/LargeTitle";

export default {
    name: "04",
    components: {
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
        return {
            ...toRefs(props.data),
        };
    },
};
</script>

<style lang="less" scoped>

.row-bar {
    padding: 15px 0;
    .item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 0;
        }

        .letter {
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            color: #8876FE;
            border: 3px solid #8876FE;
            font-size: 16px;
        }

        .bar {
            height: 30px;
            background-color: #F1F1F1;
            border-radius: 30px;
            flex: 1;
            margin: 0 15px;
            display: flex;
            font-size: 14px;
            color: #fff;
            line-height: 30px;

            .left,
            .right {
                width: 50%;
                position: relative;

                .value {
                    position: absolute;
                    top: 0;
                    height: 30px;
                    display: flex;
                    justify-content: center;
                }
            }

            .left {
                .value {
                    right: 0;
                    background-color: #6C9AFC;
                    text-align: right;
                    border-radius: 30px 0 0 30px;
                }
            }

            .right {
                .value {
                    left: 0;
                    background-color: #8876FF;
                    border-radius: 0 30px 30px 0;
                }
            }
        }

    }
}
</style>