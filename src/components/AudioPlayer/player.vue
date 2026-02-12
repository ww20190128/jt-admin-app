<template>
    <div class="player-wraper">
        <div class="head-warper">
            <!-- 将播放器推到后台 -->
            <div class="left" @click="() => gbPlayerState.show = false">
                <!-- <img src="@/assets/images/icon/back.png"> -->
                <!-- <i class="fa fa-angle-down"></i> -->
                <img src="@/assets/images/icon/mindfulness-home.png">
            </div>
            <div class="center" v-if="gbPlayerState?.currentItem?.mindfulnessId" @click="handleItem(gbPlayerState?.currentItem?.mindfulnessId)" >《{{
                gbPlayerState?.currentItem?.mindfulnessName }}》</div>
            <!-- 关闭播放器<i class="fa fa-close" ></i> -->
            <div class="right" @click="handleClosePlayer"><span>关闭</span></div>
        </div>
        <div id="aplayer"></div>
    </div>
</template>

<script>
import { reactive, toRefs, ref, onMounted, inject, computed } from "vue";
import { useRouter } from "vue-router";
import 'aplayer/dist/APlayer.min.css';
import APlayer from 'aplayer';
import backImg from "@/assets/images/icon/back.png";

export default {
    name: "player",
    components: {},
    setup() {
        const router = useRouter();
        const state = reactive({});
        let gbPlayer = inject("gbPlayer");
        let gbPlayerState = inject("gbPlayerState");
        onMounted(() => {
            gbPlayer.value = new APlayer({
                container: document.querySelector('#aplayer'),
                mini: false,
                lrcType: 2,
                loop: 'none',
            });

            /* 播放状态传递给全局 */
            gbPlayer.value.on('play', () => {
                let currentItem = gbPlayer.value.list.audios[gbPlayer.value.list.index];
                gbPlayerState.value.currentItem = currentItem;
                gbPlayerState.value.state = "playing";
            });
            // 播放中
            gbPlayer.value.on('playing', () => {
                gbPlayerState.value.state = "playing";
            });
            // 
            gbPlayer.value.on('timeupdate', () => {
                gbPlayerState.value.state = "playing";
            });
            // 等待
            gbPlayer.value.on('waiting', () => {
                gbPlayerState.value.state = "waiting";
            });

            // 暂停
            gbPlayer.value.on('pause', () => {
                gbPlayerState.value.state = "pause";

            });
            // 结束
            gbPlayer.value.on('ended', () => {
                gbPlayerState.value.state = "ended";
            });
            // 错误
            gbPlayer.value.on('error', () => {
                gbPlayerState.value.state = "error";
            });

            /* 播放事件传递给全局
                listshow
                listhide
                listadd
                listremove
                listswitch
                listclear
                lrcshow
                lrchide
            */
            gbPlayer.value.on('listswitch', (item) => {
                console.log("当前播放索引", item);
            });
        });

        // 关闭播放器
        function handleClosePlayer() {
            gbPlayer.value.pause();
            gbPlayerState.value.show = false;
            // gbPlayer.value.destroy();

            gbPlayerState.value.currentItem = {};
            gbPlayerState.value.state = "destroy";
            gbPlayerState.value = {};
        }
        function handleItem(mindfulnessId) {
            router.push({
                path: "/mindfulness/detail",
                query: {
                    mindfulnessId: mindfulnessId,
                },
            });
            gbPlayerState.value.show = false;
        }
        return {
            ...toRefs(state),
            backImg,
            handleClosePlayer,
            gbPlayer,
            gbPlayerState,
            handleItem
        };
    }
}

</script>

<style lang="less" scoped>
.player-wraper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    height: auto;
    background: #fff;
    padding: 0.2rem;
    box-shadow: 0 -0.2rem 0.4rem rgba(0, 0, 0, 0.1);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding-bottom: 10px;

    .head-warper {
        position: relative;
        width: 100%;
        height: 30px;
        display: flex;
        padding: 0 5px;
        justify-content: space-between;
        align-items: center;

        .left {
            font-weight: 400;
            cursor: pointer;
            // color: rgb(110, 110, 110);
            position: relative;

            img {
                height: 30px;
                width: auto;
            }
            i {
                font-size: 24px;
            }
        }
        .center {
            font-size: 16px;
        }
        .right {
            cursor: pointer;

            span {
                font-size: 14px;
                font-weight: 400;
                color: rgb(179, 178, 178);
            }
        }
    }

    .aplayer {
        .aplayer-body {
            .aplayer-pic {}

            .aplayer-info {}

        }

        .aplayer-list {
            margin-top: 50px !important;

            .aplayer-list-light {
                height: 80px !important;
                line-height: 80px !important;
            }
        }
    }

}
</style>