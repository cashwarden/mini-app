<template>
  <view class="content">
    <u-toast ref="uToast" />
    <u-form :model="form" ref="uForm" :error-type="errorType">
      <u-form-item prop="description">
        <u-input v-model="form.description" placeholder="请输入描述内容" />
        <u-button @click="submit" size="mini" class="button">提交</u-button>
      </u-form-item>
    </u-form>
  </view>
</template>

<script>
export default {
  name: "record-create-now",
  data() {
    return {
      errorType: ["message"],
      form: {
        description: "",
      },
      rules: {
        description: [
          {
            required: true,
            message: "请输入描述内容",
          },
        ],
      },
    };
  },
  methods: {
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          this.$u.api.transactionsByDescription(this.form).then((res) => {
            this.form.description = "";
            this.$refs.uToast.show({ title: "记账成功", type: "success" });
          });
        }
      });
    },
  },
  // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
};
</script>

<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
