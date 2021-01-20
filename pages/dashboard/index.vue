<template>
  <view class="content">
    <view class="card" v-for="(item, index) in items" :key="index">
      <m-card
        :main="item['main']"
        :left="item['left']"
        :right="item['right']"
      />
    </view>

    更多请使用电脑访问：
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
import MCard from "@/components/card.vue";

export default {
  components: {
    MCard,
  },
  data() {
    return {
      items: [],
    };
  },
  onShow() {
    uni.startPullDownRefresh();
  },
  async onPullDownRefresh() {
    this.items = await this.getOverview();
    uni.stopPullDownRefresh();
  },
  methods: {
    getOverview() {
      return new Promise((resolve, reject) => {
        this.$u.api
          .getRecordOverview(this.params)
          .then((res) => {
            let items = res.map((item) => ({
              main: { name: item.text, value: item.overview.surplus },
              left: { name: "支出", value: item.overview.expense },
              right: { name: "收入", value: item.overview.income },
            }));
            console.log(items);
            uni.stopPullDownRefresh();
            resolve(items);
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

<style lang="scss" scoped>
.content {
  .card {
    margin-bottom: 10rpx;
  }
}
</style>
