<template>
  <view class="content">
    暂未开发，更多请使用电脑访问：

    <u-link
      :color="$u.color['primary']"
      href="https://cashwarden.com/"
      :under-line="true"
    >
      https://cashwarden.com/
    </u-link>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "Hello",
    };
  },
  onLoad() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}
</style>
