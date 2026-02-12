<template>

  <div class="JFPLT-06">

    <div class="gap">
      <!-- 标题1 -->
      <LargeTitle
        :label="setting?.title1"
        :icon="setting?.title_icon_tag1"
      />

      <div class="text-content">

        根据你的测评结果，最匹配你的三个人格类型依次是： <span
          v-for="(item,index) in jifenPailieList.top3"
          :key="item.id"
        >{{`${index+1}.${item.weidu_name} `}}</span>。
        代表这三个类型的字母组合在一起就形成你的职业兴趣密码：
        <span>{{jifenPailieList.type}}</span>
      </div>

      <Hexagon :options="jifenPailieList.model1" />

      <Warning
        :data="setting?.title1_zhuyi"
        title="注意事项"
        icon="fa vaaeq fa-bullhorn"
      />
    </div>
    <div class="gap">
      <!-- 标题2 -->
      <LargeTitle
        :label="setting?.title2"
        :icon="setting?.title_icon_tag2"
      />
      <!-- 标题2说明 -->
      <RichTextBody :data="setting.title2_shuoming" />
      <TitleProgress
        :icon="item.weidu_icon"
        :title="item.weidu_name"
        :value="item.last_percent"
        :color="item.weidu_icon_color"
        v-for="item in jifenPailieList?.list"
        :key="item.id"
      >
        {{item.jianjie}}
      </TitleProgress>
    </div>
    <div class="gap">
      <!-- 标题3 -->
      <LargeTitle
        :label="setting?.title3"
        :icon="setting?.title_icon_tag3"
      />
      <!-- 标题3说明 -->
      <RichTextBody :data="setting?.title3_shuoming" />

      <Tabs v-model:active="active">
        <TabItem
          :name="index"
          v-for="(item,index) in tabs"
          :key="item.id"
        >
          {{item.weidu_name}}
        </TabItem>

      </Tabs>
      <!-- 维度详细说明 -->
      <RichTextBody :data="currentResult?.xiangxi" />

    </div>
    <div class="bottom">
      <!-- 标题4 -->
      <LargeTitle
        :label="setting?.title4"
        :icon="setting?.title_icon_tag4"
      />
      <!-- 标题3说明 -->
      <RichTextBody :data="setting?.title4_shuoming" />

      <!-- 职业列表 -->
      <div class="job-list">
        <table
          cellspacing="0"
          cellpadding="0"
          border="0"
        >
          <thead>
            <th width="50%">工作职位</th>
            <th width="25%">技能要求</th>
            <th width="25%">匹配度</th>
          </thead>
          <tbody>
            <tr
              v-for="item in jifenPailieList.jobList"
              :key="item.id"
            >
              <td>{{item.job}}</td>
              <td>{{item.comment}}</td>
              <td>
                <div class="percent">
                  <div class="progress">
                    <div
                      class="pregress-value"
                      :style="{width:`${item.pipei}%`}"
                    ></div>
                  </div>

                  <span>
                    {{item.pipei}}%
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Warning
        :data="setting?.title4_zhuyi"
        title="注意事项"
        icon="fa vaaeq fa-bullhorn"
      />
    </div>

  </div>

</template>

<script>
import { toRefs, computed, reactive } from "vue";

import RichTextBody from "../../components/RichTextBody";
import TitleProgress from "../../components/TitleProgress";
import LargeTitle from "../../components/LargeTitle";
import Tabs from "../../components/Tabs";
import TabItem from "../../components/Tabs/TabItem";
import Warning from "../../components/Warning";
import Hexagon from "../../components/Hexagon";

export default {
  name: "06",
  components: {
    RichTextBody,
    TitleProgress,
    LargeTitle,
    Tabs,
    TabItem,
    Warning,
    Hexagon,
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
    });
    // 当前tab展示的内容
    const currentResult = computed(() => {
      return props.data.jifenPailieList?.list[state.active] || {};
    });
    const tabs = computed(() => {
      return props.data.jifenPailieList?.list.slice(0, 3);
    });

    return {
      ...toRefs(props.data),
      ...toRefs(state),
      currentResult,
      tabs,
    };
  },
};
</script>

<style lang="less" scoped>

.text-content {
  font-size: @font-size-lg;
  line-height: 25px;
  color: @light-black;
  span {
    font-weight: bold;
  }
}
.job-list {
  font-size: 16px;
  table {
    width: 100%;
    thead {
      background-color: #cccccc;
    }
    th,
    td {
      height: 40px;
      text-align: left;
      border: 1px solid #cccccc;
      padding: 0 10px;
      font-size: @font-size-base;
    }
    td {
      color: @light-black;
      font-size: 13px;
      .percent {
        display: flex;
        align-items: center;
        .progress {
          height: 7px;
          width: 37px;
          background-color: #cccccc;
          position: relative;
          margin-right: 5px;
          .pregress-value {
            position: absolute;
            left: 0;
            top: 0;
            background-color: #ffa500;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>