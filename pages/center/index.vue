<template>
  <view>
    <view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
      <view class="u-m-r-10">
        <u-avatar :src="user.avatar" size="120"></u-avatar>
      </view>
      <view class="u-flex-1">
        <view class="u-font-18 u-p-b-20">{{ user.username }}</view>
        <view class="u-font-14 u-tips-color" v-if="user.pro">
          Pro 会员有效期：{{ user.pro.ended_at }}
        </view>
        <view class="u-font-14 u-tips-color" v-if="!user.pro">
          Free 会员有效期：永久
        </view>
      </view>
      <view class="u-m-l-10 u-p-10">
        <u-icon name="arrow-right" color="#969799" size="28"></u-icon>
      </view>
    </view>

    <view class="u-m-t-20">
      <u-cell-group>
        <u-cell-item icon="rmb-circle" title="升级会员"></u-cell-item>
      </u-cell-group>
    </view>

    <view class="u-m-t-20">
      <u-cell-group>
        <u-cell-item icon="star" title="账户"></u-cell-item>
        <u-cell-item icon="photo" title="账本"></u-cell-item>
        <u-cell-item icon="coupon" title="定时"></u-cell-item>
        <u-cell-item icon="heart" title="规则"></u-cell-item>
      </u-cell-group>
    </view>

    <view class="u-m-t-20">
      <u-cell-group>
        <u-cell-item icon="setting" title="设置"></u-cell-item>
      </u-cell-group>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      user: {},
    };
  },
  async onShow() {
    this.user = await this.getUserMe();
  },
  onLoad() {},
  methods: {
    getUserMe() {
      return new Promise((resolve, reject) => {
        this.$u.api
          .getUserMe({ expand: "pro" })
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
page {
  background-color: #ededed;
}
.camera {
  width: 54px;
  height: 44px;

  &:active {
    background-color: #ededed;
  }
}
.user-box {
  background-color: #fff;
}
</style>
