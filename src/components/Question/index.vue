<!-- 盖洛普类型的题目样式 -->
<script setup>
import { computed } from "vue";
const props = defineProps({
    data: {
        type: Object,
        default: () => { },
    },
    value: {
        type: Number,
    },
    styleType: {
        type: Number,
    },
    showResultButton: {
        type: Boolean,
    },

    isLast: {
        type: Boolean,
    }
});
const emit = defineEmits(["select"]);

const selections = computed(() => props.data?.selections ?? []);
const styleType = computed(() => props.styleType)
const showResultButton = computed(() => props.showResultButton)
const matter = computed(() => {
    return props.data?.matter
    // .split("|");
});
const matterImg = computed(() => {
    return props.data?.matterImg
    // .split("|");
});
function isAcive(index) {
    return index === props.value;
}
function handleOption(index) {
    emit("select", index);
}
const options2 =
    [{
        name: '非常像',
    },
    {
        name: '比较像',
    },
    {
        name: '居中',
    },
    {
        name: '比较像',
    },
    {
        name: '非常像',
    },
    ]
const options1 =
    [{
        name: '非常像',
    },
    {
        name: '比较像',
    },
    {
        name: '比较像',
    },
    {
        name: '非常像',
    },
    ]
const optionStyle = computed(() => ({
    // width: `${100 / options.value.length}%`,
    display: 'grid',
    gridTemplateColumns: `repeat(${options2.length},1fr)`,
    gridGap: '0.32rem'
}));
const optionStyle2 = computed(() => ({
    // width: `${100 / options.value.length}%`,
    display: 'grid',
    gridTemplateColumns: `repeat(${options1.length},1fr)`,
    gridGap: '0.32rem'
}));
</script>

<template>
    <div class="question-warper">
        <!-- <div>{{ total }}{{ currentIndex }}</div> -->
        <div v-if="!matterImg">
            <div class="header-warper" v-if="isLast">
                <p>终测题: 基于您的测试结果 + AI算法动态生成</p>
                <p>再次校验结果准确度</p>
            </div>
            <!-- 材料-->
            <div class="material-warper"> {{ matter }}</div>
            <!-- 题干 -->
            <div class="matter-warper" v-if="styleType == 1">
                <div class="item" v-if="selections[0]?.name">
                    <div class="markA mark"><span>A</span></div>
                    <div class="matter matterA" v-html="selections[0]?.name"></div>
                </div>

                <div class="item" v-if="selections[1]?.name">
                    <div class="markB mark"><span>B</span></div>
                    <div class="matter matterB" v-html="selections[1]?.name"></div>
                </div>
            </div>
            <div class="matter-warper" v-else>
                <div class="item" v-if="selections[0]?.name" @click="handleOption(0)">
                    <div class="markA mark"><span class="mark">A</span></div>
                    <div class="matter matterA" v-html="selections[0]?.name"></div>
                </div>

                <div class="item" v-if="selections[1]?.name" @click="handleOption(1)">
                    <div class="markB mark"><span class="mark">B</span></div>
                    <div class="matter matterB" v-html="selections[1]?.name"></div>
                </div>

            </div>
            <!-- 选项 -->
            <div class="options-warper" :style="optionStyle" v-if="styleType == 1 && !isLast">
                <div class="option-item" :class="{ active: isAcive(index) }" v-for="(item, index) in options2"
                    :key="index" @click="handleOption(index)">
                    <div class="value">
                        <div class="text"><span>{{ item.name }}</span></div>
                        <div class="letter" v-if="[0, 1].includes(index)">A</div>
                        <div class="letter" v-if="[3, 4].includes(index)">B</div>
                    </div>

                </div>
            </div>

            <div class="options-warper" :style="optionStyle2" v-if="styleType == 1 && isLast">
                <div class="option-item" :class="{ active: isAcive(index) }" v-for="(item, index) in options1"
                    :key="index" @click="handleOption(index)">
                    <div class="value">
                        <div class="text"><span>{{ item.name }}</span></div>
                        <div class="letter" v-if="[0, 1].includes(index)">A</div>
                        <div class="letter" v-if="[2, 3].includes(index)">B</div>
                    </div>

                </div>
            </div>
        </div>

        <div v-if="matterImg && styleType == 1">
            <div class="material-warper"> {{ matter }}</div>
            <img :src="matterImg" class="matter_image" />
            <div class="button" :class="{ active: isAcive(-1) }" @click="handleOption(-1)">继续测试 </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@orange-color: #f37b1d;
@blue-color: #0081ff;

.question-warper {
    background-color: #ffffff;
    border-radius: 10px;

    // 头部说明
    .header-warper {
        color: #f57792;
        text-align: center;
        padding-top: 10px;
        padding-bottom: 10px;

        p {
            font-size: 16px;
        }
    }

    // 材料
    .material-warper {
        color: #41464b;
        font-size: 18px !important;
        min-height: 60px;
    }

    // 题干图片
    .matter_image {
        width: 100%;
        border-radius: 10px;
    }

    .button {
        width: 100%;
        margin-top: 15px;
        font-size: 15px;
        border-radius: 3px;
        height: 60px;
        padding: 16.5px;
        text-align: left;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-left: 5px solid #1989fa;
        background: linear-gradient(270deg, #fff 50%, #6c9afc 0, #8876ff) 100%;
        background-repeat: no-repeat;
        background-size: 200%;
        box-shadow: 0 0 6px #ddd;

        &.active {
            // background-color: #2196f3;
            background: linear-gradient(270deg, #2196f3 50%, #2196f3 0, #2196f3) 100%;
            color: #fff;
            // border: 0.01rem solid #ffd780;
            // border: none; margin: 0; padding: 0; display: block;
        }

    }

    // 选项
    .options-warper {
        display: flex;
        // justify-content: space-around;
        overflow: hidden;
        margin-top: 28px;

        .option-item {
            flex-shrink: 0;
            background-color: #ffffff;
            border: 0.01rem solid #c3c3c3;
            cursor: pointer;
            border-radius: 5px;
            span {
                font-size: 14px;
            }

            .letter {
                color: #000000;
                margin-top: 3px;
                font-size: 16px;
            }

            &.active {
                background-color: #ffd780;
                color: #fff;
                .letter {
                    color: #fff;
                }
            }

            .value {
                height: 60px !important;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 5px 4px;
                text-align: center;
            }
        }
    }

    // 题干
    .matter-warper {
        display: flex;
        justify-content: space-between;
        font-size: 26px;
        border-radius: 4px;
        margin-top: 10px;
        min-height: 120px;

        .item {
            width: 46%;
            line-height: 24px;

            // 符号
            .mark {
                display: block;
                -moz-text-align-last: left;
                text-align-last: left;
                width: 100%;
                height: 25px;
                line-height: 25px;
                padding-left: 10px;

                span {
                    font-weight: bold;
                    color: #fff !important;
                    font-size: 18px;

                }

                position: relative;

                background-color: #fff !important;
                z-index: 10;

                &::before {
                    border-radius: 3px;
                    content: "";
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 100%;

                    transform: translate(-50%, -50%) skew(-15deg); // 平移并倾斜45度
                    z-index: -1; // 使伪元素在文字后面显示
                }
            }

            .markA {
            //    background: linear-gradient(270deg, #6c9afc, #8876ff);
                &::before {

                    background: #6c9afc;
                    box-shadow: 2px 2px 0 #fc9, 2px 2px 0 0.5px #fc9;

                }
            }

            .markB {
            //   background: linear-gradient(270deg, #fc9, #efaa90);

                &::before {

                    background: #fc9;
                    box-shadow: 2px 2px 0 #6c9afc, 2px 2px 0 0.5px #6c9afc;

                }
            }

            .matter {
                margin-top: 15px;
                display: block;
                font-size: 16px !important;
                text-align: left;
                padding-left: 5px;
            }

            .matterA {
                border-left: 4px solid #6c9afc;
            }

            .matterB {
                border-left: 4px solid #fc9;
            }

            :deep(.matter) {
                p {
                    margin-bottom: 10px;
                }
            }

            span {
                font-weight: bold;
            }

            &:first-child {
                span {
                    color: @orange-color;
                }
            }

            &:last-child {
                span {
                    color: @blue-color;
                }
            }
        }
    }
}
</style>