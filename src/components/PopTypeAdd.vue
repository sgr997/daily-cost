<template>
  <van-popup
    v-model:show="show"
    position="bottom"
    round
  >
    <div class="add-wrap">
      <header class="header">
        <span class="close" @click="show = false"><van-icon name="cross" /></span>
        <van-button class="add-btn" type="primary" size="small" @click="addBill">确定</van-button>
      </header>
      <div class="filter">
        <div class="type">
          <span @click="changeType('expense')" :class="{ expense: true, active: payType == 'expense' }">支出</span>
          <span @click="changeType('income')" :class="{ income: true, active: payType == 'income' }">收入</span>
        </div>
      </div>
      <div class="money">
        <van-cell-group inset>
          <van-field v-model="typeName" placeholder="请输入类型名" />
        </van-cell-group>
      </div>
      <div class="type-warp">
        <div class="type-body" v-if="payType == 'expense'">
          <div class="type-item" v-for="item in expense" :key="item.id" @click="choseType(item)">
            <span :class="{'iconfont-wrap': true, 'expense': true, active: currentType.id == item.id}"><i class="iconfont" :class="item.icon" /></span>
            <span>{{ item.name }}</span>
          </div>
        </div>
        <div class="type-body" v-else>
          <div class="type-item" v-for="item in income" :key="item.id" @click="choseType(item)">
            <span :class="{'iconfont-wrap': true, 'income': true, active: currentType.id == item.id}"><i class="iconfont" :class="item.icon" /></span>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { reactive, toRefs, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { typeMap } from '../utils'
import axios from '../utils/axios'
import { Toast } from 'vant'
export default {
  name: 'PopTypeAdd',
  props: {
    refresh: Function,
    detail: {
      type: Object,
      default: {}
    }
  },
  setup(props, ctx) {
    const id = props.detail && props.detail.id // 外部传进来的账单详情 id
    const remarkVisible = ref(false)
    const state = reactive({
      show: false, // 显示隐藏添加账单弹窗
      typeName: id ? props.detail.typeName : '', // 账单价格
      payType: id ? (props.detail.pay_type == 1 ? 'expense' : 'income') : 'expense', // 支出或收入类型
      expense: [], // 支出类型数组
      income: [], // 收入类型数组
      typeMap: typeMap, // 类型key-value键值对
      currentType: id ? {
        id: props.detail.type_id,
        name: props.detail.type_name,
        payType: props.detail.type_name,
        icon: props.detail.icon
      } : {}, // 当前选择的类型对象
    })

    onMounted(async () => {
      // const { data: { list } } = await axios.get('/type/list')
      await onRefresh()
    })

    const onRefresh = async () => {
      // const { data: { list } } = await axios.get('/type/list')
      const { data } = await axios.get('/type/list')
      const resData = data.map(item => {
        return {
          id: item.id,
          type: item.payType,
          icon: item.icon,
          name: item.typeName
        }
      })
      const list = resData
      state.expense = list.filter(i => i.type == 1)
      state.income = list.filter(i => i.type == 2)
      // 没有 id 的情况下，说明是新建账单。
      if (!id) {
        state.currentType = state.expense[0] 
      }
    }

    const toggle = () => {
      state.show = !state.show
    }

    // 删除输入框内容
    const remove = () => {
      state.amount = state.amount.slice(0, state.amount.length - 1)
    }

    // 选择花销类型
    const choseType = (item) => {
      state.currentType = item
    }

    // 切换收入还是支出
    const changeType = (type) => {
      state.payType = type
      state.currentType = state[type][0]
    }

    const addBill = async () => {
      if (!state.typeName) {
        Toast.fail('请输入类型名')
        return
      }
      const params = {
        typeName: state.typeName,
        payType: state.payType == 'expense' ? 1 : 2,
        icon: state.currentType.icon || 'qita'
      }
      if (id) {
        params.id = id
        // 如果有 id 需要调用详情更新接口
        const result = await axios.put('/type', params)
        state.show = false
        Toast.success('修改成功')
        ctx.emit('refresh')
      } else {
        const result = await axios.post('/type', params)
        state.amount = ''
        state.payType = 'expense'
        state.currentType = state.expense[0]
        state.show = false
        state.date = new Date()
        state.remark = ''
        Toast.success('添加成功')
        ctx.emit('refresh')
      }
      await onRefresh()
    }

    return {
      ...toRefs(state),
      toggle,
      remove,
      choseType,
      changeType,
      addBill
    }
  }
}
</script>

<style lang="less" scoped>
  @import url('../config/custom.less');
  .add-wrap {
    padding-top: 12px;
    .header {
      display: flex;
      justify-content: space-between;
      padding: 0 24px;
      .van-icon-cross {
        font-size: 20px;
        color: @color-text-secondary;
      }
      .close {
        display: flex;
        align-items: center;
      }
      .add-btn {
        padding: 0 12px;
        background-color: @primary;
        border-color: @primary;
        border-radius: 24px;
      }
    }
    .filter {
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .type {
        span {
          display: inline-block;
          background: #f5f5f5;
          color: @color-text-caption;
          padding: 4px 12px;
          font-size: 12px;
          border-radius: 24px;
          border: 1px solid #f5f5f5;
        }
        .expense {
          margin-right: 6px;
          &.active {
            background-color: #eafbf6;
            border-color: @primary;
            color: @primary;
          }
        }
        .income {
          &.active {
            background-color: #fbf8f0;
            border-color:@text-warning;
            color: @text-warning;
          }
        }
      }
      .time {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 4px 12px;
        background-color: #f0f0f0;
        border-radius: 20px;
        color: @color-text-base;
        .sort-down {
          font-size: 12px;
          margin-left: 5px;
        }
      }
    }
    .money {
      padding-bottom: 12px;
      border-bottom: 1px solid #e9e9e9;
      margin: 0 24px;
      .sufix {
        font-size: 36px;
        font-weight: bold;
        vertical-align: top;
      }
      .amount {
        font-size: 40px;
        padding-left: 10px;
      }
    }
    .animation::after {
      content:'';
      display: inline-block;
      margin-left: 5px;
      width: 2px;
      height: 28px;
      animation: blink 1s infinite steps(1, start);
    }
    @keyframes blink {
      0% {
        background-color: white;
      }
      50% {
        background-color: @color-text-secondary;
      }
      100% {
        background-color: white;
      }
    }
    .type-warp {
      display: flex;
      overflow-x: auto;
      margin: 0 24px;
      margin-bottom: 20px;
      * {
        touch-action: pan-x;
      }
      .type-body {
        display: flex;
        white-space: nowrap;
        .type-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 16px 12px 10px 12px;
          .iconfont-wrap {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f5f5f5;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            margin-bottom: 5px;
            .iconfont {
              color: @color-text-caption;
              font-size: 20px;
            }
          }
          .expense {
             &.active {
              background-color: @primary;
              .iconfont {
                color: #fff;
              }
            }
          }
          .income {
             &.active {
              background-color: @text-warning;
              .iconfont {
                color: #fff;
              }
            }
          }
        }
      }
    }
    .remark {
      padding: 0 24px;
      padding-bottom: 12px;
      color: #4b67e2;
    }
    .van-number-keyboard {
      position: unset;
    }
    .van-dialog__confirm {
      color: @primary;
    }
  }
</style>