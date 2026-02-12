<template>
    <div>
        <div class="cnt2" :style="{background: versionConfig?.bgColor}">
            <div class=" mbti_cont">
                <div class="mbti_top">
                    <img v-if="versionConfig?.topImg" :src="versionConfig?.topImg" alt="">
                    <img v-else src="../../../../../assets/images/page02-title.png" alt="">
                    <!-- <p class="mbti_title2">{{ versionConfig?.topDesc }}</p> -->
                    <!-- <div class="mbti_title"> <i class="ioc_left">↓↓</i> {{ versionConfig?.text }} <i
                            class="ioc_right">↓↓</i></div> -->
                </div>
                <div class="two">
                    <div class="cont1">
                        <div class="cont " :class="{ 'cur': optionCurrent === 1 }" @click="handleSelectItem(versionConfig?.options[0])">
                            <div class="img1 cur2" v-if="optionCurrent === 1">
                                <img src="../../../../../assets/images/duihao.png" alt="">
                            </div>
                            <img v-if="versionConfig?.options[0]?.img"
                                :src="versionConfig?.options[0]?.img" alt="" class="img">
                            <img v-else  src="../../../../../assets/images/left1.png" alt="" class="img">
                            <div class="bt1"> {{ versionConfig?.options[0]?.name }} </div>
                            <div class="bt2">预计3-5分钟完成</div>
                            <div class="bt2"> 近30天测试{{getPeople}}人 </div>
                        </div>
                        <div class="cout_num">{{getWeek()}}{{ getHeat }}</div>
                        <div class="cout_text">今日热度</div>
                    </div>

                    <div class="cont1">
                        <div class="cont " :class="{ 'cur': optionCurrent === 2 }" @click="handleSelectItem(versionConfig?.options[1])">
                            <div class="img1 cur2" v-if="optionCurrent === 2">
                                <img src="../../../../../assets/images/duihao.png" alt="">
                            </div>
                            <img v-if="versionConfig?.options[1]?.img"
                                :src="versionConfig?.options[1]?.img" alt="" class="img">
                            <img v-else src="../../../../../assets/images/right1.png" alt="" class="img">
                            <div class="bt1"> {{versionConfig?.options[1]?.name }}</div>
                            <div class="bt2">预计3-5分钟完成</div>
                            <div class="bt2"> 近30天测试{{getPeople}}人 </div>
                        </div>
                        <div class="cout_num">荣格八维</div>
                        <div class="cout_text">专业解读分析</div>
                    </div>
                </div>
                <div class="mbtibtn move" @click="confirm"> 开始测试 </div>
                <div v-if="versionConfig?.bottomDesc">
                    <div class="tips2" v-html="versionConfig?.bottomDesc"></div>
                </div>
                <div class="page_detail">
                    <div v-html="versionConfig?.desc"></div>
                    <!-- <div class="detail_title_ydrated">为什么每个人都要做MBTI测试？</div>
                    <div class="detail_txt___3QorP">
                        MBTI测试是世界500强正在使用的职业人格评估工具。MBTI从纷繁复杂的个性特征中，归纳提炼出4个关键要素，从而把人区分成16种类型，如ENTJ领导者、ISFP艺术家、INFJ哲学家等。 <br>
                        很多测试者认为MBTI对自己的职业和自我认知帮助无可替代，专家建议反复测试。 </div> -->
                </div>
                <div v-if="versionConfig?.copyright">
                    <div class="tips" v-html="versionConfig?.copyright"></div>
                </div>
                <!-- <div class="m">
                    <img src="../../../../../assets/images/page02-bottom.png">
                </div> -->
            </div>

        </div>
    </div>
</template>

<script setup>
import { computed } from "vue"
const emit = defineEmits(["handleSelectItem2", "confirm"]);
const props = defineProps({
    link: {
        type: String,
    },
    versionConfig: {
        type: Object
    },
    optionCurrent: {
        type: Number,
        default: 0
    }
});

function handleSelectItem(optionsItem) {
    // console.log('%c [ 选择 ]-60', 'font-size:13px; background:pink; color:#bf2c9f;',props.optionCurrent)
    emit('handleSelectItem2', optionsItem);
}
function confirm() {
    emit('confirm');
}
// 获取秒的时间戳后6位
function getTimestamp(num) {
  var date = new Date();
  var timestamp = date.getTime();
  var timestamp_str = timestamp.toString();
  var timestamp_str_last6 = timestamp_str.substring(num,10);
  return timestamp_str_last6;
}

// 人数  获取秒的时间戳后5位
const getPeople = computed(() => {
	var date = new Date();
	var timestamp = date.getTime();
	var timestamp_str = timestamp.toString();
	var timestamp_str_last6 = timestamp_str.substring(5, 10);
	return '1' + timestamp_str_last6 ;
})
// 获取热度
const getHeat=computed(() => {
  return getTimestamp(6)
})
// 获取星期几方法
function getWeek() { 
    var date = new Date(); 
    var week =  "7123456".charAt(new Date().getDay());
    return week; 
} 
</script>

<style lang="less" scoped>
p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
}

.cnt2 {
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
    // background-image: linear-gradient(145deg, #4398b5, #4398b5);
    font-size: 14px;
    background:  #4398b5;
}

// .mbti_cont {
//     background: url(../../../../../assets/images/page01-bg.png) top no-repeat;
//     width: 100%;
//     height: auto;
//     background-size: cover;
//     overflow: hidden;
//     min-height: 100vh;
// }

.mbti_top {
    text-align: center;
    color: #fff;
    font-size: 20px !important;
    p {
        margin: 0;
    }
    img {
        width: 100%;
        display: block;
        margin: 0 auto;
    }

    .mbti_title2 {
        margin-top: -10px;
        font-size: 18px;
    }

    .mbti_title {
        margin-top: 40px;
        color: #FFEB3B;
        font-size: 20px;
        font-weight: 500;
        display: flex;
        justify-content: center;
        align-items: center;
        .ioc_left {
            margin-right: 5px;
        }
        .ioc_right {
            margin-left: 5px;
        }
    }
}

.two {
    display: flex;
    justify-content: space-evenly;
    margin-top: 10px;
    width: 100%;
}

.two .cur {
    border: 4px solid #ff5d7d !important;
    transform: scale(1.1);
}

.two .cont {
    padding: 15px 15px 10px 15px;
    box-sizing: border-box;
    border-radius: 10px;
    width: 100%;
    border: 3px solid rgba(255, 0, 0, 0);
    text-align: center;
    box-shadow: 0 .08rem .3rem 0 #207997;
    background: #fff;
    // height: 160px;
}

.cont1 {
    box-sizing: border-box;
    width: 37%;
    text-align: center;
    // height: 160px;
}

.cout_num {
    font-size: 14px;
    margin-top: 12px;
    color: #f7d808;
    font-weight: 600;
}

.cout_text {
    font-size: 14px;
    margin-top: 2px;
    color: #fff;
    font-weight: 600;
}

.cur2 {
    display: none
}

.two .img1 {
    display: block;
    background: #ff5d7d;
    width: 20px;
    height: 20px;
    border-bottom-right-radius: 5px;
    border-top-left-radius: 5px;
    position: absolute;
    top: -1px;
    left: -1px;

    img {
        pointer-events: none;
        max-width: 90%;
    }
}

.two .cont .img {
    width: 100%;
}

.two .cont .bt1 {
    font-size: 17px;
    margin-top: 6px;
    margin-bottom: 4px;
}

.bt2 {
    font-size: 10px;
    color: #bebebe;
    margin-top: 2px;
}

.two .cont p {
    color: #999;
    letter-spacing: 0;
}

.page_detail .detail_title_ydrated {
    text-align: center;
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 10px;
}

.page_detail .detail_txt___3QorP {
    line-height: 23px;
}

.page_detail {
    width: 90%;
    background-color: #207997;
    border-radius: 10px;
    color: #fff;
    margin: 0 auto;
    margin-top: 5px;
    padding: 15px;

    :deep(h5) {
        text-align: center;
        font-weight: 700;
        font-size: 18px;
        margin-bottom: 10px;
    }

    :deep(p) {
        line-height: 23px;
        font-size: 14px;
    }
}

.mbtibtn {
    // position: fixed;
    // bottom: 1px;

    margin-left: 50%;
    margin-top: 35px;
    // left: 50%;
    transform: translate(-50%, -50%);
    // background: linear-gradient(178deg, #ffb489 1%, #f37a4b 99%);
    background: #ff5d7d;

    box-shadow: 0 8px 21px 0 rgba(0, 0, 0, .19);

    border-radius: 45px;
    line-height: 45px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    // background-image: linear-gradient(to right, #ff6f8c, #fd466a);
    font-weight: bold;
    font-size: 18px;
    height: 40px;
    width: 180px;
    border-radius: 40px;
    color: #fff;
    line-height: 40px;
    text-align: center;
    letter-spacing: 5px;

    // animation: scaleAnimation-data-v-9a11e5a2 1s ease-in-out infinite;
}

.tips {
    // padding: 10px 20px 15px;
    padding: 5px 0 0 0;
    color: #fff;
    font-size: 14px;
    :deep(img) {
        width: 100%;
        display: block;
        padding: 0;
        margin: 0;
    }
    
}

.tips2 {
    margin-top: -5px;
    padding-bottom: 5px;
    color: #fff;
    font-size: 12px;
    text-align: center;
}

@keyframes scaleAnimation-data-v-9a11e5a2 {
    0% {
        transform: translate(-50%, -50%) scale(1);
    }

    50% {
        transform: translate(-50%, -50%) scale(1.1);
    }

    100% {
        transform: translate(-50%, -50%) scale(1);
    }
}

.m {
    margin-top: 5px;
    width: 100%;

    img {
        width: 100%;
        display: block;
        padding: 0;
        margin: 0;
    }
}
</style>