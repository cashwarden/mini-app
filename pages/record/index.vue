<template>
  <view class="wrap">
    <u-toast ref="uToast"></u-toast>

    <!-- <u-button size="mini" @click="search">搜索</u-button>

    <u-popup v-model="showSearch">
      <view>出淤泥而不染，濯清涟而不妖</view>
    </u-popup> -->
    <u-notice-bar mode="vertical" :list="notice"></u-notice-bar>

    <view class="summary">
      <record-create-now v-on:refresh="onRefresh"></record-create-now>
    </view>

    <!-- <view class="filter u-content-color">
      <view @click="showDatePicker = true" size="mini" class="box">
        2020-01 <u-icon name="arrow-down" size="20"></u-icon>
      </view>
      <view @click="showDatePicker = true" size="mini" class="box right">
        全部账户 <u-icon name="arrow-down" size="20"></u-icon>
      </view>
      <view @click="showDatePicker = true" size="mini" class="box right">
        全部类型 <u-icon name="arrow-down" size="20"></u-icon>
      </view>
    </view> -->

    <u-picker
      v-model="showDatePicker"
      mode="time"
      :params="date_params"
    ></u-picker>

    <view class="records" v-for="(item, index) in records.items" :key="index">
      <view class="summary inline">
        <view class="left">{{ item.date }}</view>
        <view class="right">
          支出 {{ item.out ? item.out : 0 }} / 收入 {{ item.in ? item.in : 0 }}
        </view>
      </view>

      <u-swipe-action
        :index="record.id"
        v-for="record in item.records"
        :key="record.id"
        @click="click"
        @open="open"
        :options="options"
        class="record"
      >
        <view class="item u-border-bottom">
          <view class="item-wrap inline">
            <view class="left inline">
              <u-icon
                :name="record.category.icon_name"
                custom-prefix="custom-icon"
                size="80"
                color="#888888"
              ></u-icon>
              <view class="title-wrap">
                <view class="u-font-xl">{{ record.category.name }}</view>
                <view class="u-tips-color u-font-sm">
                  {{ record.transaction.description }}
                  <view v-if="record.transaction.remark">
                    （{{ record.transaction.remark }}）
                  </view>
                </view>
              </view>
            </view>
            <view
              v-bind:class="[
                record.direction === 'expense'
                  ? 'u-type-error'
                  : 'u-type-success',
                'right u-text-right',
              ]"
            >
              <view class="u-font-xl">
                {{ record.direction === "expense" ? "-" : "" }}
                {{ record.currency_amount }}
              </view>
              <view class="u-tips-color u-font-sm">
                {{ record.account.name }}
                <!-- <u-tag
                  :text="tag"
                  mode="dark"
                  v-for="tag in record.transaction.tags"
                  :key="tag"
                  size="mini"
                  type="info"
                  class="tag"
                /> -->
              </view>
            </view>
          </view>
        </view>
      </u-swipe-action>
    </view>
  </view>
</template>

<script>
import { USER_DEFAULT_LEDGER_ID } from "@/common/storage-keys";
import RecordCreateNow from "@/pages/record/create-now.vue";

export default {
  components: {
    RecordCreateNow,
  },
  data() {
    return {
      showDatePicker: false,
      notice: [
        "点击右上角「添加到我的小程序」，使用更方便",
        "记录左滑动可以方便删除和修改",
      ],
      records: { items: [] },
      disabled: false,
      btnWidth: 180,
      show: false,
      keyword: "",
      date_params: {
        year: true,
        month: true,
        day: false,
        hour: false,
        minute: false,
        second: false,
      },
      showSearch: false,
      options: [
        {
          text: "删除",
          style: {
            backgroundColor: "#dd524d",
          },
        },
        // {
        //   text: "修改",
        //   style: {
        //     backgroundColor: "#007aff",
        //   },
        // },
      ],
      params: {
        pageSize: 100,
        ledger_id: uni.getStorageSync(USER_DEFAULT_LEDGER_ID),
      },
    };
  },
  watch: {
    params: {
      handler: "getData",
      immediate: false,
    },
  },
  async onload() {
    uni.startPullDownRefresh();
  },
  onPullDownRefresh() {
    this.params = { ...this.params };
    uni.stopPullDownRefresh();
  },
  methods: {
    search() {
      this.showSearch = true;
    },
    onRefresh() {
      this.params = { ...this.params };
    },
    click(id, index) {
      // 删除
      if (index === 0) {
        this.$u.api.deleteRecord(id).then((res) => {
          this.$refs.uToast.show({ title: "删除成功", type: "success" });
          this.params = { ...this.params };
        });
      }
    },
    // 如果打开一个的时候，不需要关闭其他，则无需实现本方法
    open(index) {
      // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
      // 原本为'false'，再次设置为'false'会无效
      // console.log(index);
    },
    getData(params = {}) {
      return new Promise((resolve, reject) => {
        Object.assign(this.params, params);
        this.$u.api
          .getRecords(this.params)
          .then((res) => {
            this.records = res;
            uni.stopPullDownRefresh();
            resolve(res);
          })
          .catch((e) => {
            uni.stopPullDownRefresh();
            resolve([]);
          });
      });
    },
  },
};
</script>

<style lang="scss">
.filter {
  // background: $u-bg-color;
  padding: 16rpx 20rpx;
  display: flex;
  justify-content: space-between;
  .u-icon {
    padding-left: 6rpx;
    color: $u-tips-color;
  }
  .box {
    padding-right: 20rpx;
  }
}
.inline {
  display: flex;
  justify-content: space-between;
}
.summary {
  padding: 10rpx;
  background: $u-bg-color;
}
.title-wrap {
  padding-left: 15rpx;
}
.record {
  .item {
    padding: 20rpx 10rpx;
  }
}
.tag {
  margin: 0 5rpx;
}
</style>
