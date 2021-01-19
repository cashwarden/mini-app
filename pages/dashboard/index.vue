<template>
  <view class="content">
    <m-card
      :main="item.main"
      :left="item.left"
      :right="item.right"
      v-for="(item, index) in items"
      :key="index"
    >
    </m-card>

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
import MCard from "@/components/card.vue";

export default {
  components: {
    MCard,
  },
  data() {
    return {
      items: [
        // {
        //   main: { name: "ss", value: "ss" },
        //   left: { name: "支出", value: "" },
        //   right: { name: "收入", value: "" },
        // },
      ],
    };
  },
  async onShow() {
    uni.startPullDownRefresh();
  },
  onPullDownRefresh() {
    this.items = this.getOverview();
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
              left: { name: "支出", value: "" },
              right: { name: "收入", value: "" },
            }));
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}
</style>
