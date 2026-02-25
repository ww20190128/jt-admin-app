<template>
    <div class="train-page">
      <!-- 训练类型列表（可折叠） -->
      <div class="train-type-list">
        <div
          v-for="trainType in trainTypeList"
          :key="trainType.id"
          class="train-type-item"
        >
          <!-- 训练类型标题栏 -->
          <div class="train-type-header" @click="toggleTrainType(trainType.id)">
            <van-checkbox
              v-model="trainType.checked"
              @click.stop="toggleTrainTypeCheck(trainType)"
            />
            <span class="train-type-name">{{ trainType.name }}</span>
            <van-icon
              :name="trainType.expanded ? 'arrow-up' : 'arrow-down'"
              class="expand-icon"
            />
          </div>
  
          <!-- 展开时显示类型 Tab 和方案列表 -->
          <div v-if="trainType.expanded" class="train-type-content">
            <!-- 类型横向 Tab -->
            <van-tabs
              v-model:active="activeTab[trainType.id]"
              class="type-tabs"
              sticky
              scrollspy
            >
              <van-tab
                v-for="type in trainType.types"
                :key="type.id"
                :title="type.name"
              >
                <!-- 方案列表（多选） -->
                <div class="plan-list">
                  <van-checkbox-group
                    v-model="type.selectedPlans"
                    @change="handlePlanChange(trainType.id, type.id)"
                  >
                    <van-cell-group>
                      <van-cell
                        v-for="plan in type.plans"
                        :key="plan.id"
                        clickable
                        @click="togglePlan(type, plan)"
                      >
                        <template #icon>
                          <van-checkbox
                            :name="plan.id"
                            :checked="type.selectedPlans.includes(plan.id)"
                          />
                        </template>
                        {{ plan.name }}
                      </van-cell>
                    </van-cell-group>
                  </van-checkbox-group>
                </div>
              </van-tab>
            </van-tabs>
          </div>
        </div>
      </div>
  
      <!-- 底部确认栏 -->
      <div class="bottom-bar">
        <div class="selected-info">
          已选方案：{{ totalSelectedPlans }} 个
        </div>
        <van-button type="primary" size="small" @click="handleConfirm">
          确认
        </van-button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useToast } from 'vant'
  
  export default {
    name: 'TrainSelection',
    setup() {
      const toast = useToast()
  
      // 训练类型数据（可根据实际接口替换）
      const trainTypeList = reactive([
        {
          id: 'stimulate',
          name: '刺激训练',
          checked: false,
          expanded: true,
          types: [
            {
              id: 'game',
              name: '游戏',
              selectedPlans: [],
              plans: [
                { id: 'watermelon', name: '合成大西瓜' },
                { id: 'car', name: '移车高手' },
                { id: 'candy', name: '糖果刺客' },
                { id: 'card', name: '卡片消除' },
                { id: 'line', name: '连线高手' },
                { id: 'screw', name: '拆卸螺丝' },
                { id: 'climb', name: '向上攀爬' },
                { id: 'doll', name: '打扮娃娃' },
                { id: 'search', name: '精准搜索' },
                { id: 'balloon', name: '气球射手' },
                { id: 'sheep', name: '羊羊收菜' },
                { id: 'hundred', name: '百发百中' },
                { id: 'bridge', name: '搭桥闯关' },
                { id: 'building', name: '盖大楼' },
                { id: 'mole', name: '打地鼠' },
                { id: 'rotate', name: '旋转匹配' },
                { id: 'circle', name: '套圈圈' },
                { id: 'cross', name: '无限穿越' },
                { id: 'bee', name: '蜜蜂在哪里' },
                { id: 'synthesis13', name: '合成13(要换图)' },
                { id: 'math', name: '数字加减(要换图)' },
                { id: 'word', name: '单词点读' },
                { id: 'cup', name: '彩色水杯' },
                { id: 'vegetable', name: '蔬菜消消乐' },
                { id: 'bubble', name: '刺破泡泡' },
                { id: 'tetris', name: '俄罗斯方块' },
                { id: 'color', name: '颜色跳跃' },
                { id: 'music', name: '音乐球球' },
                { id: 'bird', name: '方块鸟' },
                { id: 'escape', name: '密室逃脱' },
                { id: 'drift', name: '弯道漂移' },
                { id: 'fly', name: '一飞冲天' },
                { id: 'squirrel', name: '松鼠跳跳' },
                { id: 'tank', name: '坦克大战' },
                { id: 'circleFix', name: '圆之修复' },
                { id: 'candyLink', name: '糖果连连看' },
                { id: 'shoot', name: '射击天才' },
                { id: 'thunder', name: '雷霆战机' },
                { id: 'cow', name: '勇敢的牛牛' },
                { id: 'chicken', name: '小鸡跳高高' },
                { id: 'cheese', name: '喵星人的奶酪' },
                { id: 'candyGrab', name: '抓糖果' },
                { id: 'hunt', name: '狩猎高手' },
                { id: 'chess', name: '中国象棋' },
                { id: 'pigIn', name: '猪猪进圈' },
                { id: 'frog', name: '青蛙王子' },
                { id: 'cowSet', name: '套牛' },
                { id: 'pigPush', name: '猪猪推菜' }
              ]
            },
            {
              id: 'enlighten',
              name: '启蒙',
              selectedPlans: [],
              plans: [
                { id: 'idiom', name: '成语故事' }
              ]
            },
            {
              id: 'video',
              name: '视频',
              selectedPlans: [],
              plans: [
                { id: 'deep1', name: '深海小英雄第1章' },
                { id: 'deep2', name: '深海小英雄第2章' },
                { id: 'deep3', name: '深海小英雄第3章' },
                { id: 'deep4', name: '深海小英雄第4章' },
                { id: 'chicken1', name: '萌鸡小队第1季' },
                { id: 'chicken2', name: '萌鸡小队第2季' },
                { id: 'super1', name: '超级飞侠第1季' },
                { id: 'super2', name: '超级飞侠第2季' },
                { id: 'super3', name: '超级飞侠第3季' },
                { id: 'super4', name: '超级飞侠第4季' },
                { id: 'super5', name: '超级飞侠第5季' },
                { id: 'super6', name: '超级飞侠第6季' },
                { id: 'super11', name: '超级飞侠第11季' },
                { id: 'super12', name: '超级飞侠第12季' },
                { id: 'super13', name: '超级飞侠第13季' },
                { id: 'super14', name: '超级飞侠第14季' },
                { id: 'super15', name: '超级飞侠第15季' },
                { id: 'super16', name: '超级飞侠第16季' },
                { id: 'wangwang', name: '汪汪队立大功第1季' },
                { id: 'doudou', name: '豆小鸭第1季' },
                { id: 'project', name: '工程车好伙伴第1季' },
                { id: 'threeKing', name: '三国演义' },
                { id: 'bigEar', name: '大耳朵图图' },
                { id: 'sunzi', name: '孙子兵法' },
                { id: 'sheepGuard', name: '羊村守护者' },
                { id: 'blue1', name: '布鲁伊第1季' },
                { id: 'blue2', name: '布鲁伊第2季' },
                { id: 'blue3', name: '布鲁伊第3季' },
                { id: 'sea1', name: '海底小纵队第1季' },
                { id: 'sea2', name: '海底小纵队第2季' },
                { id: 'dream', name: '红楼梦' },
                { id: 'hundredWhy', name: '十万个为什么' },
                { id: 'song', name: '儿歌' },
                { id: 'thirtySix', name: '三十六计' },
                { id: 'dragon', name: '奶龙大战暴暴龙' },
                { id: 'shell', name: '舒克贝塔生命水之战' },
                { id: 'bear5', name: '贝肯熊第5季' },
                { id: 'wave', name: '浪浪山小妖怪' },
                { id: 'crazy', name: '疯狂动物城大小事' },
                { id: 'newLiang', name: '新梁山伯与祝英台' },
                { id: 'threeCharacter', name: '三字经' },
                { id: 'seaBottom', name: '海底总动员' },
                { id: 'toy4', name: '玩具总动员4' },
                { id: 'little1', name: '小马宝莉第1季' },
                { id: 'little2', name: '小马宝莉第2季' },
                { id: 'little3', name: '小马宝莉第3季' },
                { id: 'little4', name: '小马宝莉第4季' },
                { id: 'little5', name: '小马宝莉第5季' },
                { id: 'ice1', name: '冰川时代' },
                { id: 'ice2', name: '冰川时代2' },
                { id: 'bearMission', name: '贝肯熊之星火任务' },
                { id: 'bearGold', name: '贝肯熊之金牌特工' },
                { id: 'bearSound', name: '贝肯熊之欢乐好声音' },
                { id: 'bearSound2', name: '欢乐好声音2' },
                { id: 'ice5', name: '冰川时代5' },
                { id: 'ruiqi1', name: '瑞奇宝宝第1季' },
                { id: 'ruiqi2', name: '瑞奇宝宝第2季' },
                { id: 'ruiqi3', name: '瑞奇宝宝第3季' },
                { id: 'ruiqi4', name: '瑞奇宝宝第4季' },
                { id: 'superman', name: '开心超人之谜之城' },
                { id: 'doraemon', name: '哆啦A梦' },
                { id: 'catMouse', name: '猫和老鼠' },
                { id: 'pig1', name: '小猪佩奇第1季' },
                { id: 'flower', name: '花木兰' },
                { id: 'pig9', name: '小猪佩奇第9季' },
                { id: 'pig10', name: '小猪佩奇第10季' },
                { id: 'pig11', name: '小猪佩奇第11季' },
                { id: 'pigHero', name: '猪猪侠之竞球小英雄2' },
                { id: 'pigHero3', name: '猪猪侠之竞球小英雄3' },
                { id: 'pigHero4', name: '猪猪侠之竞球小英雄4' }
              ]
            }
          ]
        },
        {
          id: 'frequency',
          name: '变频红光',
          checked: false,
          expanded: false,
          types: [
            {
              id: 'game',
              name: '游戏',
              selectedPlans: [],
              plans: [
                { id: 'car2', name: '移车高手' },
                { id: 'card2', name: '卡片消除' },
                { id: 'screw2', name: '拆卸螺丝' },
                { id: 'petLine', name: '萌宠连线' },
                { id: 'shape', name: '形状匹配' },
                { id: 'flyDish', name: '打飞碟' },
                { id: 'bee2', name: '蜜蜂在哪里' },
                { id: 'word2', name: '单词点读' },
                { id: 'vegetable2', name: '蔬菜消消乐' },
                { id: 'frog2', name: '青蛙王子' },
                { id: 'cowSet2', name: '套牛' },
                { id: 'pigPush2', name: '猪猪推菜' }
              ]
            },
            {
              id: 'enlighten',
              name: '启蒙',
              selectedPlans: [],
              plans: [
                { id: 'idiom2', name: '成语故事' }
              ]
            },
            {
              id: 'video',
              name: '视频',
              selectedPlans: [],
              plans: [
                { id: 'deep1_2', name: '深海小英雄第1章' },
                { id: 'deep2_2', name: '深海小英雄第2章' },
                { id: 'super1_2', name: '超级飞侠第1季' },
                { id: 'super2_2', name: '超级飞侠第2季' },
                { id: 'super11_2', name: '超级飞侠第11季' },
                { id: 'super12_2', name: '超级飞侠第12季' },
                { id: 'wangwang_2', name: '汪汪队立大功第1季' },
                { id: 'doudou_2', name: '豆小鸭第1季' },
                { id: 'project_2', name: '工程车好伙伴第1季' },
                { id: 'sheepGuard_2', name: '羊村守护者' },
                { id: 'blue1_2', name: '布鲁伊第1季' },
                { id: 'blue2_2', name: '布鲁伊第2季' },
                { id: 'blue3_2', name: '布鲁伊第3季' },
                { id: 'dream_2', name: '红楼梦' },
                { id: 'hundredWhy_2', name: '十万个为什么' },
                { id: 'song_2', name: '儿歌' },
                { id: 'bear5_2', name: '贝肯熊第5季' },
                { id: 'wave_2', name: '浪浪山小妖怪' },
                { id: 'crazy_2', name: '疯狂动物城大小事' },
                { id: 'newLiang_2', name: '新梁山伯与祝英台' },
                { id: 'threeCharacter_2', name: '三字经' },
                { id: 'toy4_2', name: '玩具总动员4' },
                { id: 'little1_2', name: '小马宝莉第1季' },
                { id: 'little2_2', name: '小马宝莉第2季' },
                { id: 'little3_2', name: '小马宝莉第3季' },
                { id: 'little4_2', name: '小马宝莉第4季' },
                { id: 'little5_2', name: '小马宝莉第5季' },
                { id: 'ice1_2', name: '冰川时代' },
                { id: 'ice2_2', name: '冰川时代2' },
                { id: 'bearMission_2', name: '贝肯熊之星火任务' },
                { id: 'bearGold_2', name: '贝肯熊之金牌特工' },
                { id: 'bearSound_2', name: '贝肯熊之欢乐好声音' },
                { id: 'bearSound2_2', name: '欢乐好声音2' },
                { id: 'ice5_2', name: '冰川时代5' },
                { id: 'ruiqi1_2', name: '瑞奇宝宝第1季' },
                { id: 'ruiqi2_2', name: '瑞奇宝宝第2季' },
                { id: 'ruiqi3_2', name: '瑞奇宝宝第3季' },
                { id: 'ruiqi4_2', name: '瑞奇宝宝第4季' },
                { id: 'superman_2', name: '开心超人之谜之城' },
                { id: 'doraemon_2', name: '哆啦A梦' },
                { id: 'catMouse_2', name: '猫和老鼠' },
                { id: 'pig1_2', name: '小猪佩奇第1季' },
                { id: 'flower_2', name: '花木兰' },
                { id: 'pig9_2', name: '小猪佩奇第9季' },
                { id: 'pig10_2', name: '小猪佩奇第10季' },
                { id: 'pig11_2', name: '小猪佩奇第11季' },
                { id: 'pigHero_2', name: '猪猪侠之竞球小英雄2' },
                { id: 'pigHero3_2', name: '猪猪侠之竞球小英雄3' },
                { id: 'pigHero4_2', name: '猪猪侠之竞球小英雄4' }
              ]
            }
          ]
        }
      ])
  
      // 当前激活的 Tab
      const activeTab = ref({})
  
      // 统计所有已选方案数量
      const totalSelectedPlans = computed(() => {
        let count = 0
        trainTypeList.forEach(trainType => {
          trainType.types.forEach(type => {
            count += type.selectedPlans.length
          })
        })
        return count
      })
  
      // 切换训练类型展开/收起
      const toggleTrainType = (trainTypeId) => {
        const trainType = trainTypeList.find(item => item.id === trainTypeId)
        if (trainType) {
          trainType.expanded = !trainType.expanded
        }
      }
  
      // 切换训练类型全选/取消全选
      const toggleTrainTypeCheck = (trainType) => {
        const allPlans = []
        trainType.types.forEach(type => {
          type.plans.forEach(plan => allPlans.push(plan.id))
        })
  
        if (trainType.checked) {
          // 取消全选
          trainType.types.forEach(type => {
            type.selectedPlans = []
          })
        } else {
          // 全选
          trainType.types.forEach(type => {
            type.selectedPlans = type.plans.map(plan => plan.id)
          })
        }
        trainType.checked = !trainType.checked
      }
  
      // 切换单个方案选中状态
      const togglePlan = (type, plan) => {
        const index = type.selectedPlans.indexOf(plan.id)
        if (index > -1) {
          type.selectedPlans.splice(index, 1)
        } else {
          type.selectedPlans.push(plan.id)
        }
      }
  
      // 方案选择变化时，更新训练类型的全选状态
      const handlePlanChange = (trainTypeId, typeId) => {
        const trainType = trainTypeList.find(item => item.id === trainTypeId)
        if (!trainType) return
  
        let allSelected = true
        trainType.types.forEach(type => {
          if (type.selectedPlans.length !== type.plans.length) {
            allSelected = false
          }
        })
        trainType.checked = allSelected
      }
  
      // 确认提交
      const handleConfirm = () => {
        if (totalSelectedPlans.value === 0) {
          toast('请至少选择一个方案')
          return
        }
  
        // 组装提交数据
        const result = trainTypeList
          .filter(trainType => trainType.checked || trainType.types.some(t => t.selectedPlans.length > 0))
          .map(trainType => ({
            trainTypeId: trainType.id,
            trainTypeName: trainType.name,
            types: trainType.types
              .filter(type => type.selectedPlans.length > 0)
              .map(type => ({
                typeId: type.id,
                typeName: type.name,
                planIds: type.selectedPlans,
                plans: type.plans.filter(plan => type.selectedPlans.includes(plan.id))
              }))
          }))
  
        console.log('提交数据', result)
        toast.success(`已选择 ${totalSelectedPlans.value} 个方案`)
        // 这里可以调用接口提交数据
      }
  
      onMounted(() => {
        // 初始化每个训练类型的默认激活 Tab
        trainTypeList.forEach(trainType => {
          activeTab.value[trainType.id] = 0
        })
      })
  
      return {
        trainTypeList,
        activeTab,
        totalSelectedPlans,
        toggleTrainType,
        toggleTrainTypeCheck,
        togglePlan,
        handlePlanChange,
        handleConfirm
      }
    }
  }
  </script>
  
  <style lang="less" scoped>
  .train-page {
    min-height: 100vh;
    background-color: #f7f8fa;
    padding-bottom: 60px;
  }
  
  .train-type-list {
    padding: 12px;
  }
  
  .train-type-item {
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 12px;
    overflow: hidden;
  }
  
  .train-type-header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
  
    .train-type-name {
      flex: 1;
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-left: 8px;
    }
  
    .expand-icon {
      color: #969799;
      font-size: 16px;
    }
  }
  
  .train-type-content {
    padding: 0;
  
    .type-tabs {
      :deep(.van-tabs__wrap) {
        background-color: #fff;
      }
  
      :deep(.van-tab__content) {
        padding: 0;
      }
    }
  
    .plan-list {
      padding: 8px 0;
    }
  }
  
  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background-color: #fff;
    border-top: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    z-index: 99;
  
    .selected-info {
      font-size: 14px;
      color: #666;
    }
  }
  </style>