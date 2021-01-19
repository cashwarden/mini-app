<template>
  <view>
    <u-cell-group>
      <u-cell-item icon="setting-fill" title="个人设置"></u-cell-item>
      <u-cell-item
        icon="integral-fill"
        title="会员等级"
        value="新版本"
      ></u-cell-item>
    </u-cell-group>
  </view>
</template>

<script>
export default {
  data() {
    return {
      data: [],
    };
  },
  async onShow() {
    uni.startPullDownRefresh();
  },
  onPullDownRefresh() {
    this.getOverview();
    uni.stopPullDownRefresh();
  },
  methods: {
    getOverview() {
      this.$u.api
        .getRecordOverview(this.params)
        .then((res) => {
          this.records = res;
          uni.stopPullDownRefresh();
          resolve(res);
        })
        .catch((e) => {
          uni.stopPullDownRefresh();
          resolve([]);
        });
    },
  },
};
</script>

<style lang="scss"></style>
