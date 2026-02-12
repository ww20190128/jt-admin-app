<template>
    <div class="theme-pink">
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
import { isObject } from "lodash";
import { useRouter } from "vue-router";
export default {
    name: "ThemePink",
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
@theme: linear-gradient(to top, #fad0c4 0%, #fad0c4 1%, #ffd1ff 100%);
.theme-pink {
    margin-top: 30px;

    position: relative;
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 20px;
    padding-bottom: 20px;
    // 主题色
    background-image: @theme;

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
        border-radius: 10px;
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
          
            .item-bg {
                width: 100%;


                &.bg1 {
                    background-color: #FFEFE7;
                    transform: rotate(-2deg);
                }

                &.bg2 {
                    background-color: #FFF6D7;

                }

                &.bg3 {
                    background-color: #f2f3ce;
                    transform: rotate(2deg);
                }

                &.bg4 {
                    background-color: #e7f5da;
                }



                transform-origin: center;



                margin-top: 10px;
                border-radius: 10px;
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
            top: 0;
            left: 0;
            transform: translateY(-50%) translateX(0%);


            border-radius: 5px 20px 0 0px;
            width: 40%;
            text-align: center;
            height: 35px;
            line-height: 35px;
            background-color: pink;

            span {
                font-size: 22px;
                font-weight: 500;
                color: #fff;
            }

            img {
                width: 30px;
                height: 30px;
            }


        }
    }
}
</style>
