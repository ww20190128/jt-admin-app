<template>
    <div class="play-warper" v-if="mindfulness && mindfulness.id">
        <div class="head-warper">
            <div class="left" @click="$router.go(-1)">
                <!-- <img src="@/assets/images/icon/back.png"> -->
                <i class="fa fa-angle-down"></i>
            </div>
        </div>
        <div class="content-warper">
            <van-swipe indicator-color="#6EA9FB" class="swipe-warper">
                <van-swipe-item class="play-show-warper">
                    <div class="cover-warper">
                        <img ref="coverImage" class="cover-img" :src="mindfulness.coverImg"
                            :class="{ rotating: currentPlayInfo.status === 1 }">
                    </div>
                    <div class="lyric-warper" v-if="currentLyricList.length > 0">
                        <div class="lyric-item" v-for="(lyric, index) in currentLyricList" :key="index"
                            :class="{ active: index == 1 }">
                            {{ lyric.text }}
                        </div>
                    </div>
                </van-swipe-item>
                <!-- 简介 -->
                <van-swipe-item class="mindfulness-desc-warper">
                    <div class="desc-warper">
                        <div class="tag-name" v-if="mindfulness.desc">简介</div>
                        <div class="desc" v-if="mindfulness.desc" v-html="mindfulness.desc"></div>
                        <div class="tag-name" v-if="mindfulness.fit">适用</div>
                        <div class="fit" v-if="mindfulness.fit" v-html="mindfulness.fit"></div>
                    </div>
                    <div class="lyric-warper" v-if="currentLyricList.length > 0">
                        <p class="left">“</p>
                        <div v-for="(lyric, index) in currentLyricList" :key="index" class="item"
                            :class="{ active: index === 2 }">
                            {{ lyric.text }}
                        </div>
                        <p class="right">”</p>
                    </div>
                </van-swipe-item>
            </van-swipe>
        </div>
        <!-- 控制区域 -->
        <div class="bottom-warper">
            <div class="top-warper">
                <div class="left">
                    <p class="name" v-show="currentAudio.name">{{ currentAudio.name }}</p>
                    <p class="current-time">{{ currentPlayInfo.currentTime ?
                        $filters.formatDate(currentPlayInfo.currentTime,
                            'mm:ss') : '00:00'
                        }}</p>
                </div>
                <div class="right">
                    <div class="inner" :class="{ 'show-back-home': currentPlayInfo.status === 0 }">
                        <div v-if="currentPlayInfo.status == 0" class="back-home" @click.stop="backMindfulnessHome">
                            <img src="@/assets/images/icon/mindfulness-home.png">
                        </div>

                        <div class="play" @click="handlePlay">
                            <img :src="currentPlayInfo.status ? playImg : pauseImg">
                        </div>
                    </div>
                </div>
                <!-- <div class="right">{{ currentPlayInfo.duration ? $filters.formatDate(currentPlayInfo.duration, 'mm:ss')
                    : '00:00'
                    }}</div> -->
            </div>
            <div class="progress-warper">
                <i class="pre-progress" ref='preProgress'></i>
                <vue-slider class="progress" ref="audioSlider" v-model="audioProgress" :tooltip="'none'" :min=0
                    :max="progressMaxValue" :debug=false :clickable=true eventType='auto' @change="audioSliderHander"
                    :bgStyle="{
                        backgroundColor: '#121212',
                    }" :processStyle="{
                        backgroundColor: '#6EA9FB',
                    }" />
            </div>

            <!-- 控制区域 -->
            <div class="control-warper">
                <div class="left item" @click="onTimeSetShow">
                    <img :src="timeImg">
                </div>
                <div class="center item collect-tag" @click="handleDoCollect">
                    <i class="fa fa-heart" v-if="mindfulness.collectStatus == 1"></i>
                    <i class="fa fa-heart-o" v-else></i>
                </div>
                <div class="right item" @click="onAudioListShow">
                    <img src="@/assets/images/icon/list.png">
                </div>
            </div>
        </div>
        <!-- 时间设置弹窗 -->
        <van-popup v-model:show="timeSetShow" position="bottom" :style="{ width: '80%', height: '40%', bottom: '50px' }"
            :close-on-click-overlay="true" class="popup-time-set" @click-close-icon="onTimeSetShowCancel"
            close-icon="close" closeable>
            <div class="popup-content">
                <van-picker :show-toolbar="false" :columns="playSetList"
                    @change="(value) => selectedValue = value.value" :default-index="2" />
                <div class="button" @click="handleSet">立即设置</div>
            </div>
        </van-popup>

        <!-- 列表弹窗 -->
        <van-popup v-model:show="audioListShow" position="bottom" :style="{ width: '100%' }"
            :close-on-click-overlay="true" :cancel-text="''" :confirm-text="''" class="popup-audio-list"
            @click-close-icon="onAudioListShowCancel" close-icon="close" closeable>
            <div class="audio-list-warper">
                <div class="header">
                    <div class="title">当前播放列表</div>
                    <div class="num">（{{ mindfulness.audioNum }}）</div>
                </div>
                <div class="item" v-for="item in audioList" :class="{ playing: currentAudio.id === item.id }"
                    @click="handlePlayItem(item)">
                    <div class="index">{{ item.index }}</div>
                    <div class="name-warper">
                        <div class="left ">
                            <div class="name">{{ item.name }}</div>
                            <div class="time">{{ item.time }}分钟</div>
                        </div>
                        <div class="right" v-if="currentAudio.id === item.id">
                            <i class="show-pause" :class="{ playing: currentPlayInfo.status == 1 }"></i>
                        </div>
                    </div>
                    <div class="play">
                        <!-- 播放中 -->
                        <i class="fa fa-play" v-if="currentAudio.id === item.id && currentPlayInfo.status == 1"></i>
                        <i class="fa fa-pause"
                            v-else-if="currentAudio.id === item.id && currentPlayInfo.status == 0"></i>
                        <i class="fa fa-lock" v-else></i>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
    <div id="aplayer"></div>
</template>

<script>
import { reactive, toRefs, computed, onMounted, watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";
import { Toast } from "vant";
// import APlayer from '@moefe/vue-aplayer';

import APlayer from 'aplayer';
// import 'APlayer/dist/APlayer.min.css';
import { getMindfulnessInfo } from "@/api/mindfulness";
import playImg from "@/assets/images/icon/play-1.png";
import pauseImg from "@/assets/images/icon/pause-1.png";
import timeImg from "@/assets/images/icon/time.png";
import backImg from "@/assets/images/icon/back.png";
import vueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import {
    doCollect,
} from "@/api/testPaper";

// 播放详情页
export default {
    name: "play",
    components: {
        APlayer,
        vueSlider,
    },
    setup(props, cxt) {
        const store = useStore();
        const router = useRouter();
        const route = useRoute();
        const { mindfulnessId, audioId } = route.query;
        const player = reactive({
            instance: null,
        });
        const state = reactive({
            mindfulness: {}, // 课程详情
            audioList: [], // 音频列表
            timeSetShow: false, // 设置时间
            audioListShow: false,
            currentAudio: {}, // 当前播放的音频信息
            currentPlayInfo: {
                status: 0, //  1 播放  0 暂停
                audioId: 0, // 当前的播放的音频id
                currentTime: 0, // 当前时间
                duration: 0, // 结束时间
            },
            playState: 1,
            playTimer: null,
            playSetList: [
                {
                    value: 1,
                    text: "播放一次"
                },
                {
                    value: 99,
                    text: "顺序播放"
                },
                {
                    value: 10,
                    text: "定时10分钟"
                },
                {
                    value: 30,
                    text: "定时30分钟"
                },
                {
                    value: 60,
                    text: "定时60分钟"
                },
            ],
            currentLyricList: [
                {
                    index: 1,
                    text: '上一句歌词',
                },
                {
                    index: 2,
                    text: '当前播放的歌词',
                },
                {
                    index: 3,
                    text: '下一句的歌词',
                },
            ],

            audioProgress: 0,
            progressMaxValue: 0, // 最大进度值 

            selectedValue: 0,
        });

        onMounted(() => {
            init();
        });

        // 收藏或取消收藏
        async function handleDoCollect() {
            if (!state.mindfulness.id) {
                return false;
            }
            const {
                collectStatus
            } = await doCollect({ mindfulnessId: mindfulnessId });
            state.mindfulness.collectStatus = collectStatus;
            Toast(state.mindfulness.collectStatus === 0 ? '取消收藏' : '加入收藏');
        }
        const coverImageRef = ref(null);
        const preProgress = ref(null);


        // 取消设置
        function onTimeSetShowCancel() {
            state.timeSetShow = false

        }
        // 设置弹窗
        function onTimeSetShow() {
            state.timeSetShow = true;
        }
        // 列表弹窗
        function onAudioListShow() {
            state.audioListShow = true;
        }
        // 列表弹窗
        function onAudioListShowCancel() {
            state.audioListShow = false;
        }
        // 返回正念首页
        function backMindfulnessHome() {
            router.push({
                path: "/mindfulness",
            });
        }
        // 设置
        function handleSet() {
            if (!player.instance || !state.selectedValue) {
                return false;
            }
            if (state.selectedValue === 1) { // 播放完暂停
                player.instance.on('ended', () => {
                    console.log("执行：暂停");
                    player.instance.pause();
                    state.currentPlayInfo.status = 0;
                });
                console.log("播放完毕后，暂停");
            } else if (state.selectedValue === 99) { // 顺序播放
                player.instance.on('ended', () => {
                    const currentIndex = state.audioList.findIndex(item => item === state.currentAudio);
                    if (currentIndex + 1 < state.audioList.length) {
                        state.currentAudio = state.audioList[currentIndex + 1];
                        initAudio(state.currentAudio);
                    } else {
                        player.instance.pause();
                        state.currentPlayInfo.status = 0;
                    }
                });
            } else { // 定时播放
                const timer = setTimeout(() => {
                    player.instance.pause();
                    state.currentPlayInfo.status = 0;
                    clearTimeout(timer);
                }, state.selectedValue * 60 * 1000);
            }
            state.timeSetShow = false;
        }
        // 切换播放
        function handlePlayItem(item) {
            if (!player.instance) {
                return false;
            }
            const currentAudioIndex = state.audioList.findIndex(audio => audio.id === state.currentAudio.id);
            const newAudioIndex = state.audioList.findIndex(audio => audio.id === item.id);
            if (currentAudioIndex === newAudioIndex) {
                if (player.instance.paused) {
                    player.instance.play();
                    state.currentPlayInfo.status = 1;
                } else {
                    player.instance.pause();
                    state.currentPlayInfo.status = 0;
                }
            } else {
                state.currentAudio = item;
                initAudio(state.currentAudio);
                // 重置播放时间为 0，从开头开始播放
                player.instance.audio.currentTime = 0;
                player.instance.play();
                state.currentPlayInfo.status = 1;
            }
        }
        // 初始化
        async function initAudio(currentAudio) {
            const aplayerInstance = new APlayer({
                container: document.getElementById('aplayer'),
                lrcType: 1,
                audio: [
                    {
                        name: currentAudio.name,
                        artist: state.mindfulness.name,
                        url: currentAudio.url,
                        cover: state.mindfulness.coverImg,
                        lrc: currentAudio.lrc, // 字幕
                    },
                ],
            });
            player.instance = aplayerInstance;
            aplayerInstance.on('canplay', () => {
                aplayerInstance.play();
                state.currentPlayInfo.status = 1;
            });

            // 更新播放时间
            aplayerInstance.on('timeupdate', () => {
                const currentTime = aplayerInstance.audio.currentTime;
                const duration = aplayerInstance.audio.duration;
                state.currentPlayInfo.currentTime = currentTime;
                state.currentPlayInfo.duration = duration;
                state.progressMaxValue = parseInt(duration, 10);
                state.audioProgress = parseInt(currentTime, 10);

                sessionStorage.setItem("play_info", );

            });

            aplayerInstance.on('lrcLoaded', (lrcData) => {

            });
            // 播放结束
            aplayerInstance.on('ended', () => {
                const currentIndex = state.audioList.findIndex(item => item === currentAudio);
                if (currentIndex + 1 >= state.audioList.length) { // 最后一个，暂停
                    if (!player.instance.paused) {
                        player.instance.pause();
                        state.currentPlayInfo.status = 0;
                    }
                } else {
                    state.currentAudio = state.audioList[currentIndex + 1];
                    initAudio(state.currentAudio);
                }
            });
        }
        // 初始化
        async function init() {
            try {
                const {
                    mindfulness, // 课程详情
                    audioList, // 课程列表
                } = await getMindfulnessInfo({
                    mindfulnessId: mindfulnessId, // 课程ID
                });
                document
                    .querySelector('meta[name="description"]')
                    ?.setAttribute("content", mindfulness.name);
                document.title = mindfulness.name;
                state.mindfulness = mindfulness;
                state.audioList = audioList;
                // 当前的音频信息
                state.currentAudio = state.audioList.find((item) => item.id == audioId);
                if (state.currentAudio && state.currentAudio?.name) {
                    initAudio(state.currentAudio);
                }
            } catch (error) { }
        }
        const userInfo = computed(() => store.getters.userInfo);
        const wechatConf = computed(() => store.getters.wechatInfo || {});

        // 播放，暂停
        function handlePlay() {
            clearInterval(state.playTimer);
            if (!player.instance) {
                return false;
            }
            if (player.instance.paused) {
                player.instance.play();
                state.currentPlayInfo.status = 1;
            } else {
                player.instance.pause();
                state.currentPlayInfo.status = 0;
            }
            state.playTimer = setInterval(() => {
            }, 1000);
            return true;
        }

        // 拖动进度
        const audioSliderHander = (value) => {
            if (!player.instance) {
                return false;
            }
            player.instance.audio.currentTime = value;
            state.audioProgress = parseInt(value);
        }

        return {
            ...toRefs(state),
            backMindfulnessHome,
            handlePlay,
            handleDoCollect,
            coverImageRef,
            userInfo,
            wechatConf,
            playImg,
            backImg,
            pauseImg,
            timeImg,
            onTimeSetShowCancel,
            onTimeSetShow,
            onAudioListShow,
            onAudioListShowCancel,
            handlePlayItem,
            audioSliderHander,
            preProgress,

            handleSet,
        };
    },
};
</script>
<style lang="less">
@media screen and (min-width: @max-device-width) {
    .popup-bottom {
        width: @max-device-width;
        left: 50%;
        transform: translateX(-50%);
        max-height: 400px;
        overflow: hidden;
    }
}
</style>
<style lang="less" scoped>
@media screen and (min-width: @max-device-width) {
    .popup-content {
        width: @max-device-width;
        margin: 0 auto;
        .scroll-bar();
    }
}

.back-warper {
    bottom: 30%;
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 0 6px #6EA9FB;
    cursor: pointer;
    border-radius: 50%;
    position: fixed;
    right: calc((100vw - 355px) / 2 + 20px);
    z-index: 999;
    background-color: #6EA9FB;
    color: #F7F7F7;
}

// 底部弹窗
.popup-time-set {
    position: relative;

    .popup-content {
        width: 100%;
        color: @light-black;

        .button {
            position: relative;
            width: 90%;
            height: 40px;
            background-color: @theme-color;
            border-radius: 20px;
            text-align: center;
            color: #F7F7F7;
            font-size: 16px;
            line-height: 40px;
            margin: 0 auto;
        }
    }
}

// 音频列表弹窗
.popup-audio-list {
    position: relative;
    height: 100%;

    .audio-list-warper {
        position: relative;
        width: 100%;
        padding-top: 20px;
        padding-bottom: 50px;

        .header {
            height: 30px;
            padding-left: 20px;

            .title {
                line-height: 30px;
                display: inline-block;
                color: @light-black;
                font-size: @font-size-lg;
                font-weight: bold;
            }

            .num {
                line-height: 30px;
                display: inline-block;
                color: @gray-color;
                font-size: @font-size-sm;
            }
        }

        .item {
            position: relative;
            height: 40px;
            display: flex;
            padding: 0 15px 0px 10px;
            justify-content: space-between;
            align-items: center;
            margin-top: 30px;
            width: 100%;
            display: flex;
            justify-content: flex-start;
            font-weight: 400;

            .index {
                color: @gray-color;
                margin-left: 10px;
                font-size: 14px;
            }

            &:first-child {
                margin-top: 0;
            }

            position: relative;

            // 播放当中
            &.playing {
                .index {
                    background-color: rgba(243, 100, 131, 0.2);
                    color: @theme-color !important;
                }

                .name-warper {
                    color: @theme-color;

                    .time {
                        color: @theme-color !important;
                    }
                }

                .play {
                    color: @theme-color;

                    img {
                        animation: bounce 1s infinite alternate;
                    }
                }
            }

            .name-warper {
                margin-left: 10px;
                flex: 1;
                display: flex;
                flex-direction: row;

                .left {
                    .name {
                        font-size: @font-size-base;
                    }

                    .time {
                        color: @gray-color;
                        font-size: @font-size-sm;
                    }
                }

                .right {
                    margin-left: 20px;
                    margin-top: 10px;
                    width: 18px;
                    height: 18px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    .show-pause {
                        width: 100%;
                        height: 100%;
                        background-image: url("@/assets/images/player.png");
                        background-size: 100% auto;

                        &.playing {
                            animation: playing 800ms steps(10) infinite;
                        }
                    }

                    @keyframes playing {
                        0% {
                            background-position: 0 0
                        }

                        to {
                            background-position: 0 -1000%
                        }
                    }
                }
            }

            .index {
                width: 35px;
                height: 35px;
                border-radius: 5px;
                background-color: rgba(203, 236, 245, 0.7);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: #67C8DB;
                font-size: 16px;
            }

            .play {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: rgba(203, 236, 245, 0.3);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                // color: #67C8DB;
                color: rgb(147, 221, 241);

                i {

                    font-size: 12px;

                    &.fa-play {
                        margin-left: 3px;
                    }
                }
            }
        }
    }
}

.aplayer {
    // display: none;
}

.play-warper {
    position: relative;
    width: 100%;
    height: 100vh !important;
    overflow: hidden;

    .head-warper {
        position: relative;
        width: 100%;
        height: 40px;
        display: flex;
        padding: 0 10px;
        justify-content: space-between;
        align-items: center;

        .left {
            font-size: 22px;
        }
    }

    .content-warper {
        position: relative;
        height: 65%;
        width: 100%;
        overflow: hidden;

        // 滑动翻页
        .swipe-warper {
            width: 100%;
            height: 100%;
            overflow: hidden;
            transform: translateY(0);
            background-color: transparent !important;
            z-index: 10;

            :deep(.van-swipe__indicators) {
                bottom: 0px;
            }

            :deep(.van-swipe__indicator) {
                background-color: gray;
            }

            :deep(.van-swipe__indicator--active) {
                background-color: @theme-color;
            }

            .play-show-warper {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                .cover-warper {
                    width: 180px;
                    height: 180px;
                    border-radius: 50%;
                    transform: translateY(-30px);
                    background-color: aqua;

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;

                        &.rotating {
                            animation: rotateAnimation 10s linear infinite;
                            transition: transform 0.5s ease;
                        }
                    }
                }
            }

            .mindfulness-desc-warper {
                padding-top: 20px;

                .desc-warper {
                    width: 100%;
                    position: relative;
                    padding: 0 20px;

                    .tag-name {
                        font-size: 14px;
                        height: 16px;
                        line-height: 16px;
                        padding-left: 5px;
                        border-left: 4px solid rgba(244, 164, 96, 0.9);
                        font-weight: bold !important;
                    }

                    .desc {
                        margin-bottom: 30px;
                    }

                    .desc,
                    .fit {
                        padding-left: 25px;
                        color: @gray-color;
                        margin-top: 10px;
                        font-size: @font-size-sm;
                        line-height: 1.8;
                        font-weight: 400;

                        // border-bottom: 1px solid #ecebeb;
                    }
                }

                .lyric-warper {
                    overflow: hidden;
                    width: 100%;
                    height: auto;
                    position: absolute;
                    bottom: 80px;
                    left: 0;
                    text-align: center;
                    background-color: #EFF3F6;
                    padding: 0 10px;

                    .item {
                        font-weight: 400;
                        text-align: center;
                        font-size: @font-size-base;
                        line-height: 1.8;
                    }

                    .left,
                    .right {
                        font-size: 36px;
                        color: @gray-color;
                    }

                    .left {
                        text-align: left;
                    }

                    .right {
                        text-align: right;
                    }
                }
            }
        }
    }

    // 固定在底部区域
    .bottom-warper {
        position: absolute;
        bottom: 0px;
        left: 0;
        width: 100%;
        padding: 0 30px 30px 30px;

        .top-warper {
            width: 100%;
            height: 45px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .left {
                .name {
                    font-size: @font-size-lg;
                    line-height: 30px;
                    font-weight: bold;
                }

                .current-time {
                    font-size: @font-size-sm;
                    line-height: 15px;
                    font-weight: 100px;
                    color: #c2c1c1;
                }
            }

            .right {
                height: 45px;

                .inner {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    width: 100%;

                    img {
                        height: 45px;
                        width: 45px;
                    }

                    .play,
                    .back-home {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .back-home {
                        animation: showBackHomeAnimation 0.5s ease forwards;
                    }
                }
            }
        }



        // 进度条
        .progress-warper {
            margin-top: 25px;
            display: flex;
            width: 100%;
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .progress {
                background-color: #c2c1c1;
                flex: 1;
            }

            position: relative;
            cursor: pointer;

            .pre-progress {
                position: absolute;
                top: 0px;
                left: 50px;
                width: 0;
                height: 4px;
                // background-color: #fff;
                border-radius: 16px;
                z-index: 1;

            }

            .progress {
                background-color: #c2c1c1;
                padding: 0 !important;

                :deep(.vue-slider__tooltip) {
                    display: none !important;
                }
            }
        }

        .control-warper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 30px;
            padding: 0px 30px;

            .left,
            .right {
                i {
                    font-weight: 400;
                    font-size: 20px;
                }

                text-align: center;

                img {
                    height: 20px;
                    width: 20px;
                }

                .name {
                    color: @light-black;
                    font-weight: 400;
                    margin-top: 3px;
                    font-size: @font-size-sm;
                }
            }

            .collect-tag {
                font-size: 16px;
                color: red !important;
            }


        }
    }


}

@keyframes showBackHomeAnimation {
    from {
        transform: translateX(45px);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes rotateAnimation {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@keyframes bounce {
    from {
        transform: translateY(-5px) translateX(0);
    }

    to {
        transform: translateY(0px) translateX(0px);
    }
}
</style>