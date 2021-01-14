<template>
  <view class="wrap">
    <u-toast ref="uToast"></u-toast>

    <view class="summary">
      <u-row gutter="16">
        <u-col span="9">
          <view class="u-tips-color">净资产</view>
          <view class="big-txt">
            {{ accountOverview.net_asset }}
          </view>
        </u-col>
        <u-col span="3">
          <u-button shape="circle" size="mini" @click="create">新建</u-button>
        </u-col>
      </u-row>
      <u-row gutter="16">
        <u-col span="9">
          <view class="u-tips-color">总负债</view>
          <view class="u-content-color">
            {{ accountOverview.liabilities }}
          </view>
        </u-col>
        <u-col span="3">
          <view class="u-tips-color">总资产</view>
          <view class="u-content-color">
            {{ accountOverview.total_assets }}
          </view>
        </u-col>
      </u-row>
    </view>

    <u-dropdown>
      <u-dropdown-item
        @change="changeStatusParam"
        v-model="params.status"
        title="状态"
        :options="accountStatus"
      ></u-dropdown-item>

      <u-dropdown-item
        @change="changeTypeParam"
        v-model="params.type"
        title="类型"
        :options="accountTypes"
      ></u-dropdown-item>

      <u-dropdown-item
        @change="changeSortParam"
        v-model="params.sort"
        title="排序"
        :options="accountSorts"
      ></u-dropdown-item>
    </u-dropdown>

    <!-- <u-notice-bar mode="vertical" :list="notice"></u-notice-bar> -->

    <u-swipe-action
      :index="item.id"
      v-for="item in items"
      :key="item.id"
      @click="click"
      @open="open"
      :options="options"
      class="items"
    >
      <view class="item u-border-bottom">
        <view
          v-bind:class="[
            item.default
              ? 'u-type-primary'
              : item.status == 'active'
              ? 'u-content-color'
              : 'u-tips-color',
            'item-wrap inline',
          ]"
        >
          <view class="left inline">
            <u-icon
              :name="item.icon_name"
              custom-prefix="custom-icon"
              size="80"
            ></u-icon>
            <view class="title-wrap">
              <view class="u-font-xl">{{ item.name }}</view>
              <view class="u-tips-color u-font-sm">
                <view v-if="item.default">默认账户</view>
                <view v-if="item.status == 'unactivated'">冻结账户</view>
                <view v-if="item.exclude_from_stats">不计入统计</view>
              </view>
            </view>
          </view>
          <view class="u-text-right">
            <view class="u-font-xl">
              {{ item.currency_balance }}
            </view>
            <view class="u-tips-color u-font-sm">
              <u-tag
                :text="keyword"
                mode="dark"
                v-for="keyword in item.keywords"
                :key="keyword"
                size="mini"
                type="info"
                class="tag"
              />
            </view>
          </view>
        </view>
      </view>
    </u-swipe-action>
  </view>
</template>

<script>
export default {
  data() {
    return {
      accountOverview: {
        net_asset: 0,
        total_assets: 0,
        liabilities: 0,
        count: 0,
      },
      accountSorts: [
        { value: "", label: "默认排序" },
        { value: "-balance_cent", label: "余额倒序" },
        { value: "balance_cent", label: "余额正序" },
      ],
      accountTypes: [],
      accountStatus: [
        { value: "", label: "全部" },
        { value: "active", label: "正常" },
        { value: "unactivated", label: "冻结" },
      ],
      items: [],
      disabled: false,
      btnWidth: 180,
      show: false,
      keyword: "",
      showSearch: false,
      options: [
        {
          text: "删除",
          style: {
            backgroundColor: "#dd524d",
          },
        },
        {
          text: "修改",
          style: {
            backgroundColor: "#007aff",
          },
        },
      ],
      params: {
        pageSize: 100,
        status: "",
        sort: "",
        type: "",
      },
    };
  },
  watch: {
    params: {
      handler: "getData",
      immediate: false,
    },
  },
  async onShow() {
    this.params = { ...this.params };
    this.accountTypes = await this.getAccountTypes();
    this.accountOverview = await this.getAccountOverview();
  },
  methods: {
    click(id, index) {
      // 删除
      var that = this;
      if (index === 0) {
        uni.showModal({
          title: "确定要删除帐户吗？",
          content: "如果帐户被删除，所有涉及的交易、规则和定时配置将永远失去。",
          success: function (res) {
            if (res.confirm) {
              that.deleteAccount(id);
            }
          },
        });
      }
    },
    deleteAccount(id) {
      this.$u.api.deleteAccount(id).then((res) => {
        this.$refs.uToast.show({ title: "删除成功", type: "success" });
        this.params = { ...this.params };
      });
    },
    create() {
      this.$u.route({ url: "/pages/account/create" });
    },
    // 如果打开一个的时候，不需要关闭其他，则无需实现本方法
    open(index) {
      // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
      // 原本为'false'，再次设置为'false'会无效
      // console.log(index);
    },
    changeSortParam(index) {
      this.params.sort = index;
      this.params = { ...this.params };
    },
    changeStatusParam(index) {
      this.params.status = index;
      this.params = { ...this.params };
    },
    changeTypeParam(index) {
      this.params.type = index;
      this.params = { ...this.params };
    },
    getData(params = {}) {
      return new Promise((resolve, reject) => {
        Object.assign(this.params, params);
        this.$u.api
          .getAccounts(this.params)
          .then((res) => {
            this.items = res.items;
            resolve(res);
          })
          .catch((e) => {
            resolve([]);
          });
      });
    },
    getAccountTypes() {
      return new Promise((resolve, reject) => {
        this.$u.api
          .getAccountTypes()
          .then((res) => {
            let data = res.map((item) => ({
              value: item.type,
              label: item.name,
            }));
            resolve([{ value: "", label: "全部" }].concat(data));
          })
          .catch((e) => {
            resolve([]);
          });
      });
    },
    getAccountOverview() {
      return new Promise((resolve, reject) => {
        this.$u.api
          .getAccountOverview()
          .then((res) => {
            resolve(res);
          })
          .catch((e) => {
            resolve([]);
          });
      });
    },
  },
};
</script>

<style lang="scss">
.items {
  .item {
    padding: 15rpx 30rpx;
  }
}

.big-txt {
  font-size: 60rpx;
}

.inline {
  display: flex;
  justify-content: space-between;
}
.summary {
  padding: 20rpx 10rpx 30rpx 10rpx;
  background: $u-bg-color;
}
.title-wrap {
  padding-left: 15rpx;
}
.tag {
  margin: 0 5rpx;
}
</style>
