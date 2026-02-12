<template>
    <div class="theme-gray">


        <!-- 介绍内容 -->
        <div class="recommend" v-if="testPaperInfo?.introduce?.recommend" v-html="testPaperInfo?.introduce?.recommend">
        </div>
        <div class="card-warper" v-if="testPaperInfo?.introduce?.theory">
            <div class="head-warper"><span>理论依据</span></div>
            <div class="content-warper theory" v-html="testPaperInfo?.introduce?.theory"></div>
        </div>
        <div class="card-warper"
            v-if="testPaperInfo?.introduce?.gain && Object.keys(testPaperInfo?.introduce?.gain).length > 0">
            <div class="head-warper"><span>你将获得</span></div>
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

        <div class="card-warper" v-if="testPaperInfo?.introduce?.fit && testPaperInfo?.introduce?.fit.length >= 1">
            <div class="head-warper"><span>适合谁测</span></div>
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

        <div class="document-warper"
            v-if="testPaperInfo?.introduce?.document && testPaperInfo?.introduce?.document.length > 0">
            <div class="title-warper"> <span>部分参考文献</span></div>
            <div class="content-warper">
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


import contentBg1 from "@/assets/images/introduce-bg1.png";
import { isObject } from "lodash";
import { useRouter } from "vue-router";
export default {
    name: "ThemeGray",
    props: {
        testPaperInfo: {
            type: Object,
            default: {},
        },
        themeColor: {
            type: String,
            default: '',
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

        return { contentElement, contentElement1, contentElement2, contentBg1 };

    },
};
</script>

<style lang="less" scoped>
@theme: linear-gradient(-180deg, #BCC5CE 0%, #929EAD 98%), radial-gradient(at top left, rgba(255, 255, 255, 0.30) 0%, rgba(0, 0, 0, 0.30) 100%);

.theme-gray {
    margin-top: 30px;

    position: relative;
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 20px;
    padding-bottom: 20px;
    // 主题色
    // background-image: linear-gradient(to bottom, #F1F1FD 0%,  #e0c3fc 100%, );
    // background-image: linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%);

    // background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
    background: @theme;
    background-blend-mode: screen;

    .document-warper {
        color: #fff;
        margin-top: 30px;

        .title-warper {
            text-align: center;

            span {
                font-size: 19px;
                border: none !important;
                font-weight: 600;
                position: relative;

                &::before {
                    content: '';
                    display: block;
                    width: 40px;
                    height: 1px; // 下划线的粗细
                    background-color: #fff; // 下划线的颜色
                    position: absolute;
                    top: 50%;
                    left: 0;
                    transform: translateX(-120%);
                }

                &::after {
                    content: '';
                    display: block;
                    width: 40px;
                    height: 1px; // 下划线的粗细
                    background-color: #fff; // 下划线的颜色
                    position: absolute;
                    top: 50%;
                    right: 0;
                    transform: translateX(120%);
                }
            }
        }

        .content-warper {
            margin-top: 20px;
            font-size: @font-size-base;
            padding: 0 20px;

            .item-line {
                margin-bottom: 15px;
                color: #fff;
                font-size: @font-size-base;
                line-height: 1.8;
                font-style: oblique;
            }
        }

    }

    .card-warper {
        position: relative;
        padding: 40px 20px 20px 20px;
        border-radius: 5px;
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 50px;

        box-shadow: 0px 0px 4px #e8e8e8;
        background: #fff;

        .content-warper {

            // background-image: url("@/assets/images/content-element.png");
            // background-size: auto 50px;
            // background-repeat: no-repeat;
            // background-position: right top;

            &.theory {
                background: #fff url('@/assets/images/bg_base.png') repeat;

                background-size: 1.6rem;
                line-height: 2;
                font-size: @font-size-base;
                // background-color: #F1F1FD;
                font-weight: 400;

                p {
                    font-size: @font-size-base;
                    margin-bottom: 15px;
                }
            }

            .item-bg {
                width: 100%;


                &.bg1 {
                    background-color: #F1F1FD;
                }

                &.bg2 {
                    background-color: #FFF6D7;
                }

                &.bg3 {
                    background-color: #e7f5da;
                }

                &.bg4 {
                    background-color: #F1F1FD;
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

        .head-warper {
            position: absolute;
            top: 0px;
            left: 50%;
            transform: translateY(-30%) translateX(-50%);
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
            width: 43%;
            text-align: center;
            height: 35px;
            line-height: 35px;

            // background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
            background-image: linear-gradient(-20deg, #00cdac 0%, #8ddad5 100%);

            span {
                font-size: 22px;
                font-weight: 500;
                color: #fff;
            }

            img {
                width: 30px;
                height: 30px;
            }

            &:before {
                content: '';
                position: absolute;
                width: 10px;
                height: 10px;
                left: -10px;
                top: 0px;
                background-color: inherit;
                filter: brightness(.8);
                clip-path: polygon(0 100%, 100% 0, 100% 100%);
                background-color: #8ddad5;
            }

            &:after {
                content: '';
                position: absolute;
                width: 10px;
                height: 10px;
                right: -10px;
                top: 0px;
                background-color: inherit;
                filter: brightness(.8);
                clip-path: polygon(0 0, 0 100%, 100% 100%);
                background-color: #8ddad5;
            }
        }
    }
}
</style>
