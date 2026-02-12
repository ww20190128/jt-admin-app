<template>
    <div class="theme-white">
        <!-- 简介 -->
        <div class="recommend" v-if="testPaperInfo?.introduce?.recommend" v-html="testPaperInfo?.introduce?.recommend">
        </div>
        <!-- 理论依据 -->
        <div v-if="testPaperInfo?.introduce?.theory">
            <div class="title-warper"><span>理论依据</span></div>
            <div class="content-warper theory" v-html="testPaperInfo?.introduce?.theory"></div>
        </div>
        <div v-if="testPaperInfo?.introduce?.gain && Object.keys(testPaperInfo?.introduce?.gain).length > 0">
            <div class="title-warper"><span>你将获得</span></div>
            <div class="content-warper">
                <div v-if="isObject(testPaperInfo?.introduce?.gain)">
                    <div class="item-bg" v-for="(value, key, index) in testPaperInfo?.introduce?.gain"
                        :class="{ 'bg1': index % 4 === 0, 'bg2': index % 4 === 1, 'bg3': index % 4 === 2, 'bg4': index % 4 === 3 }">
                        <div class="left">
                            <img :src="contentElement1" />
                        </div>
                        <div class="right">
                            <p class="desc-big" v-html="key" v-if="isNonNumericAndLongEnough(key)"></p>
                            <p class="desc-sm" v-html="value"></p>
                        </div>
                    </div>
                </div>
                <!-- 数组 -->
                <div v-else>
                    <div class="item-bg" v-for="(value, index) in testPaperInfo?.introduce?.gain"
                        :class="{ 'bg1': index % 4 === 0, 'bg2': index % 4 === 1, 'bg3': index % 4 === 2, 'bg4': index % 4 === 3 }">
                        <div class="left">
                            <img :src="contentElement1" />
                        </div>
                        <div class="right">
                            <p class="desc-base" v-html="value"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="testPaperInfo?.introduce?.fit && testPaperInfo?.introduce?.fit.length >= 1">
            <div class="title-warper"><span>适合谁测</span></div>
            <div class="content-warper">
                <div class="item-line" v-for="(desc, index) in testPaperInfo?.introduce?.fit">
                    <div class="left">
                        <img :src="contentElement2" />
                    </div>
                    <div class="right">
                        <p class="desc" v-html="desc"></p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="testPaperInfo?.introduce?.document && testPaperInfo?.introduce?.document.length > 0">
            <div class="title-warper"> <span>部分参考文献</span></div>
            <div class="content-warper document-warper">
                <p class="item-line" v-for="(item, index) in testPaperInfo?.introduce?.document" v-html="item">
                </p>
            </div>
        </div>
    </div>

</template>
<script>
import contentElement from "@/assets/images/content-element.png";
import contentElement1 from "@/assets/images/content-element-01.png";
import contentElement2 from "@/assets/images/content-element-02.png";

import bgImg from "@/assets/images/bg_base.png";
import { isObject } from "lodash";
import { useRouter } from "vue-router";
export default {
    name: "ThemeWhite",
    props: {
        testPaperInfo: {
            type: Object,
            default: {},
        },
    },
    computed: {
        isArray() {
            return Array.isArray(this.testPaperInfo?.introduce?.gain);
        }
    },
    methods: {
        isNonNumericAndLongEnough(key) {
            // 判断 key 不是数字，并且去掉首尾空格后的长度大于4个字符（即2个汉字）
            return isNaN(key) && key.trim().length > 2;
        },
        isObject(obj) {
            return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
        },
    },
    setup(props, ctx) {
        const router = useRouter();

        return { contentElement, contentElement1, contentElement2 };

    },
};
</script>

<style lang="less" scoped>
.theme-white {
    background: #fff url("@/assets/images/bg_base.png") repeat;
    background-size: 1.6rem;
    margin-top: 10px;
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 20px;
    padding-bottom: 20px;
    font-size: @font-size-lg !important;

    .recommend {
        background: none !important;
        box-shadow: none !important;
    }

    .title-warper {
        margin: 30px auto 10px auto;
        background-color: #C6D3F4;
        width: 40%;
        text-align: center;
        height: 35px;
        line-height: 35px;
        box-shadow: 3px 3px 0 #fff, 3px 3px 0 0.5px #C6D3F4;
        border-radius: 0px 10px 0 10px;

        span {
            font-size: 22px;
            font-weight: 400;
            color: #fff !important;
        }
    }

  


    .content-warper {
        padding: 10px 20px 10px 20px;
        line-height: 2;
        font-size: @font-size-lg !important;

        .item-bg {
            width: 100%;
            position: relative;
            background-color: #fff;

            &::before {

                content: "";
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                height: 100%;
                transform: translate(-50%, -50%) skew(-8deg); // 平移并倾斜45度
                z-index: -1; // 使伪元素在文字后面显示
            }

            z-index: 10;

            &.bg1 {
                &::before {
                    background-color: #FFEFE7;
                }
            }

            &.bg2 {
                &::before {
                    background-color: #FFF6D7;
                }
            }

            &.bg3 {
                &::before {
                    background-color: #f2f3ce;
                }
            }

            &.bg4 {
                &::before {
                    background-color: #e7f5da;
                }
            }


            margin-top: 10px;
            border-radius: 5px;
            padding: 5px 5px;
            .space-between();

            .left {
                text-align: left;
                margin-top: 5px;
                margin-right: 10px;
                border-radius: 5px;
                width: 25px;
                height: 25px;

                img {
                    border-radius: 50%;
                    width: 100%;
                    height: 100%;
                }
            }

            .right {
                flex: 1;

                .desc-big {
                    color: @light-black;
                    font-size: 17px;
                    line-height: 30px;
                    font-weight: 500;
                }

                .desc-sm {
                    line-height: 20px;
                    color: @gray-color;
                    font-size: 13px;
                }

                .desc-base {
                    color: @light-black;
                    font-size: 16px;
                    line-height: 1.8;
                    font-weight: 400;
                }
            }

        }

        .item-line {
            width: 100%;
            // border-bottom: 1px solid bisque;
            margin-top: 20px;
            .space-between();

            .left {

                text-align: left;
                margin-right: 10px;
                border-radius: 10px;
                width: 35px;
                height: 35px;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .right {
                flex: 1;

                .desc {
                    line-height: 1.8;
                    font-size: @font-size-lg;
                    position: relative;
                    font-weight: 500;
                    margin-bottom: 10px;

                    &::after {
                        content: '';
                        display: block;
                        width: 100%;
                        height: 1px; // 下划线的粗细
                        background-color: #e7ce68; // 下划线的颜色
                        opacity: 0.3;
                        position: absolute;
                        bottom: 0px; // 调整下划线与文字的距离
                        left: 0;
                    }
                }
            }

        }
    }

    .document-warper {
        padding: 0px 15px 10px 15px !important;

        p {
            font-size: @font-size-lg;
            line-height: 1.2 !important;
            margin-bottom: 5px !important;
        }

        color: @gray-color !important;
    }

}
</style>
