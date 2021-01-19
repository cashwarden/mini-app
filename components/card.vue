<template name="m-card">
  <view class="summary">
    <view class="top">
      <view class="left">
        <view class="u-tips-color">{{ main.name }}</view>
        <view class="big-txt">
          {{ main.value }}
        </view>
      </view>
    </view>
    <u-row gutter="16">
      <u-col span="9">
        <view class="u-tips-color">{{ left.name }}</view>
        <view class="u-content-color">
          {{ left.value }}
        </view>
      </u-col>
      <u-col span="3">
        <view class="u-tips-color">{{ right.name }}</view>
        <view class="u-content-color">
          {{ right.value }}
        </view>
      </u-col>
    </u-row>
  </view>
</template>

<script>
export default {
  name: "m-card",
  data() {},
  props: {
    main: {
      type: Object,
      require: true,
    },
    left: {
      type: Object,
      default: 0,
      require: true,
    },
    right: {
      type: Object,
      default: 0,
      require: true,
    },
  },
};
</script>

<style scoped lang="scss">
.summary {
  padding: 20rpx 10rpx 30rpx 10rpx;
  background: $u-bg-color;
  .top {
    display: flex;
    align-items: flex-end;
    .left {
      padding: 0px 4px;
      margin-left: 0%;
      flex: 0 0 75%;
      align-items: center;
      justify-content: flex-start;
      text-align: left;
    }
    .button {
      padding-bottom: 20rpx;
    }
  }
}
</style>
