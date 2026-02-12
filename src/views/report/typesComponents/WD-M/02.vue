<template>
    <div class="WD-M-02">
        <div class="top">
            <LargeTitle :label="setting?.title" :icon="setting?.title_icon_tag" />

            <!-- 简介内容 -->
            <RichTextBody :data="setting?.jianjie" />

            <div v-for="(item2, index) in duoweiduParentList" :key="item2.id" id="box">
                <div class="title-wireframe"><span>{{ item2.weidu_name }}</span></div>
                <div class="content-item" :id="'content' + (index + 1)">
                    <RichTextBody :data="item2.jianjie" />
                    <div class="result-name" :style="{ color: item2.extend?.weidu_color }">
                        {{ item2.weidu_result?.name }}</div>
                    <!-- 网状图 -->
                    <MeshChart v-if="item2.extend?.weidu_show == 1" :options="item2" />
                    <!-- 半环形图 -->
                    <HalfRingChart v-if="item2.extend?.weidu_show == 2" :options="halfRingChartOption" />

                    <!-- 结果分析 -->
                    <RichTextBody :data="item2.weidu_result?.result_explain" />
                    <!-- 建议指导 -->
                    <Suggest :data="item2.weidu_result?.jianyi" />
                    <!-- 注意事项-->
                    <Warning :data="item2.weidu_result?.zhuyi" />

                    <!-- 详细解答 -->
                    <RichTextBody :data="item2.xiangxijieda" />

                    <!-- 子维度循环 -->
                    <template v-for="(item, i) in item2.child_duoweidu" :key="item.id">
                        <div class="center" :id="'box' + item.id"
                            :style="{ height: !item.fay ? '' : height + 'px', overflow: !item.fay ? '' : 'hidden' }">
                            <!-- 带结果判断 -->
                            <template v-if="item.extend?.child_weidu_result == 1" :id="'myElement' + (i + 1)">
                                <!-- 结果 -->
                                <ResultName :title="item.weidu_name" :result="item.weidu_result?.name"
                                    :color="item.extend.weidu_color" titleColor="#5a5a5a" />
                                <PositionBar :value="item.last_percent"
                                    :multi="[item.extend?.duorenshu.min_score, item.extend?.duorenshu.max_score]"
                                    :color="item.extend.weidu_color" />

                                <!-- 结果分析 -->
                                <RichTextBody :data="item.weidu_result?.result_explain" />

                                <!-- 建议指导 -->
                                <Suggest :data="item.weidu_result?.jianyi" />
                                <!-- 温馨提示 -->
                                <Warning :data="item.weidu_result?.zhuyi" title="温馨提示" icon="fa vaaeq fa-bullhorn" />
                            </template>
                            <!-- 不带结果判断 -->
                            <template v-if="item.extend?.child_weidu_result == 2" :id="'myElement' + (i + 1)">
                                <!-- 简介 -->
                                <RichTextBody :data="item.jianjie" />
                                <div class="title2-bg"><span>{{ item.weidu_name}}</span></div>
  
                                <PositionBar :value="item.last_percent"
                                    :multi="[item.extend?.duorenshu.min_score, item.extend?.duorenshu.max_score]"
                                    :color="item.extend.weidu_color" />

                                <!-- 详细解答 -->
                                <RichTextBody :data="item.xiangxijieda" />

                            </template>
                            <div v-if="item.show">
                                <div class="mask" id="mask" style="height:180px" v-if="item.fay">
                                    <div class="butzk" @click="onzhankai(i, item, 1)">展开全部 <i
                                            class="fa fa-caret-down"></i>
                                    </div>
                                </div>
                                <div class="mask2" v-else>
                                    <div class="butzk2" @click="onzhankai(i, item, 2)">点击收起 <i
                                            class="fa fa-caret-up"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                </div>
                <div class="card-split" v-if="index + 1  < duoweiduParentList.length"></div>
            </div>

        </div>
        <div class="bottom" v-if="currentResult.tuozhanyuedu && !fay">
            <!-- 扩展阅读 -->
            <RichTextBody :data="currentResult.tuozhanyuedu" />
        </div>


    </div>

</template>

<script>
import { reactive, toRefs, computed, onMounted, nextTick, ref } from "vue";
import Tabs from "../../components/Tabs";
import TabItem from "../../components/Tabs/TabItem";
import PositionBar from "../../components/PositionBar";
import Suggest from "../../components/Suggest";
import Warning from "../../components/Warning";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
import MeshChart from "../../components/Charts/MeshChart2";
import HalfRingChart from "../../components/Charts/HalfRingChart";
import ResultName from "../../components/ResultName2";
export default {
    name: "01",
    components: {
        PositionBar,
        Tabs,
        TabItem,
        Suggest,
        Warning,
        LargeTitle,
        RichTextBody,
        MeshChart,
        HalfRingChart,
        ResultName,
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
            fay: true,
            offsetTop: [],
            initial: 0,
            show: true,
        });
        const itemRefs = ref([]);
        // 当前tab展示的内容
        const currentResult = computed(() => {

            return props.data.duoweiduParentList[state.active] || {};
        });

        const height = document.documentElement?.clientHeight / 2; //实时屏幕高度
        // 半环形图数据
        const halfRingChartOption = computed(() => {
            return {
                color: currentResult.value.extend?.weidu_color,
                value: currentResult.value.last_percent,
            };
        });
        // 网状图数据
        const meshChartOption = computed(() => {
            const indicator = currentResult.value.child_duoweidu.map((v, index) => ({
                text: v.weidu_name,
                max: 100,
                axisLabel: { show: index === 0 ? true : false },
            }));

            const value = currentResult.value.child_duoweidu.map(
                (v) => v.last_percent
            );

            return {
                value,
                indicator,
            };
        });
        function onzhankai(index, item, fay) {
            state.fay = !state.fay;
            const element = document.querySelector("#box" + item.id)
            let offsetTop = element?.offsetTop;
            // if (index == 0) {
            //     offsetTop = element2?.offsetTop;
            // }

            if (fay == 1) {
                item.fay = !item.fay

            }

            scrollTo(offsetTop, fay, item, index)

        }

        const myElement = ref(null);
        function scrollTo(offsetTop, fay, item, index) {
            // console.log('%c [ offsetTop ]-206', 'font-size:13px; background:pink; color:#bf2c9f;', offsetTop)
            // const parent = document.querySelector('.JFPLT-07')
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            })
            //延时执行
            setTimeout(() => {
                if (fay == 2) {
                    item.fay = true
                }
            }, 200)


        }
        function handleScroll() {
            var scrollTop = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) + 75
            // console.log('%c [ scrollTop ]-222', 'font-size:13px; background:pink; color:#bf2c9f;', scrollTop)
        }
        onMounted(async () => {
            await nextTick(); // 等待DOM更新
            state.offsetTop = []
            state.initial == document.querySelector("#myElement0")
            // const element = myElement.value; // 获取DOM元素的引用
            // 获取DOM元素的引用
            props.data.duoweiduParentList.forEach((item, index) => {
                item.child_duoweidu.forEach((child, index) => {


                    child.fay = true
                    child.fay2 = true
                    child.show = true;
                    let element = document.querySelector("#box" + child.id); // 获取DOM元素的引用
                    if (element) {
                        let rect = element.offsetTop; // 获取元素相对于视口的位置信息
                        //获取dom的高度
                        let height = element.offsetHeight;
                        const height2 = document.documentElement?.clientHeight / 2 + 400; //实时屏幕高度
                        if (height < height2) {
                            child.fay = false
                            state.show = false;
                            child.show = false;
                        }
                        // item.height = parseInt(height / 3 + 300 > parseInt(height2) ? parseInt(height2) : height / 3 + 300)
                        // state.offsetTop.push(rect + 200)
                    }

                })

            });

            // console.log('%c [  ]-237', 'font-size:13px; background:pink; color:#bf2c9f;', props.data.duoweiduParentList)
            window.addEventListener('scroll', handleScroll);

        });
        return {
            ...toRefs(state),
            ...toRefs(props.data),
            currentResult,
            halfRingChartOption,
            meshChartOption,
            height,
            onzhankai,
            myElement
        };
    },
};
</script>

<style lang="less" scoped>
.mask {
    width: 100%;
    // background: #fff;
    //从下到上，白色渐变色，白色占大部分
    background: linear-gradient(to top, white 30%, transparent 100%);
    // background: linear-gradient(to top, #fff, rgba(255, 255, 255, 0));
    position: absolute;
    bottom: 0px;
    z-index: 99;
}

.mask2 {
    width: 100%;
    //从下到上，白色渐变色，白色占大部分
    // background: linear-gradient(to top, #fff, rgba(255, 255, 255, 0));
    // // background: linear-gradient(to top, #fff, rgba(255, 255, 255, 0));
    // position: absolute;
    // bottom: 0;
    height: 65px;
}

.center {
    position: relative;
    // background-color: #f2fcff;
    border-radius: 8px;
    margin-bottom: 30px;
    // padding: 0 10px;
}

#box {
    padding-bottom: 10px;
}


.butzk {
    width: 140px;
    height: 35px;
    border-radius: 35px;
    background: #f1f2f8;
    color: #666e94;
    text-align: center;
    line-height: 35px;
    font-size: 16px;
    position: absolute;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
}

.butzk2 {
    width: 140px;
    height: 35px;
    border-radius: 35px;

    background: #f1f2f8;
    color: #666e94;
    text-align: center;
    line-height: 35px;
    font-size: 16px;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
}



.bottomicon {
    width: 70px;
    height: 10px;
    background: #ff5d7d4d;
    border-radius: 10px;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9;
}

.result-name {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: @theme-color;
    z-index: 1;
}
</style>