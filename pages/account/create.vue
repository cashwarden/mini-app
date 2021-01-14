<template>
  <view class="wrap">
    <u-toast ref="uToast"></u-toast>
    <u-form :model="form" ref="uForm" :error-type="errorType" class="form">
      <u-form-item prop="name" label="账户名称" label-width="150">
        <u-input v-model="form.name" placeholder="请输入账户名称" />
      </u-form-item>

      <u-form-item prop="type" label="账户类型" label-width="150">
        <u-input
          :border="border"
          type="select"
          :select-open="showAccountType"
          v-model="account_type_name"
          placeholder="请选择账户类型"
          @click="showAccountType = true"
        ></u-input>
      </u-form-item>

      <u-form-item prop="currency_balance" label="余额" label-width="150">
        <u-input
          v-model="form.currency_balance"
          type="number"
          placeholder="请输入余额"
        />
      </u-form-item>

      <u-form-item prop="tag" label="关键词" label-width="150" class="">
        <u-tag
          :index="keyword"
          v-for="keyword in form.keywords"
          :key="keyword"
          :text="keyword"
          shape="circle"
          type="info"
          closeable
          @close="tagClick"
          class="tag"
        />
        <view class="u-flex-wrap">
          <u-form-item class="add-tag" :border-bottom="false">
            <u-input
              v-model="keyword"
              :border="false"
              placeholder="请输入新的关键词"
              class="input"
              :clearable="false"
            />
            <u-button type="success" size="mini" @click="addTag" class="button">
              添加
            </u-button>
          </u-form-item>
        </view>
      </u-form-item>

      <u-form-item prop="remark" label="备注" label-width="150">
        <u-input
          type="textarea"
          :border="border"
          placeholder="备注"
          v-model="form.remark"
        />
      </u-form-item>

      <u-form-item label="默认账号" prop="default" label-width="150">
        <u-switch v-model="form.default" slot="right"></u-switch>
      </u-form-item>

      <u-form-item
        label="不计入统计"
        prop="exclude_from_stats"
        label-width="150"
      >
        <u-switch v-model="form.exclude_from_stats" slot="right"></u-switch>
      </u-form-item>

      <u-form-item label="状态">
        <u-radio-group v-model="form.status">
          <u-radio
            v-for="(item, index) in statusList"
            :key="index"
            :name="item.value"
          >
            {{ item.name }}
          </u-radio>
        </u-radio-group>
      </u-form-item>

      <u-select
        v-model="showAccountType"
        :list="accountTypes"
        @confirm="confirmAccountType"
      ></u-select>

      <u-button @click="submit" class="button">提交</u-button>
    </u-form>
  </view>
</template>

<script>
export default {
  data() {
    return {
      errorType: ["border-bottom"],
      border: false,
      accountTypes: [],
      showAccountType: false,
      account_type_name: "一般账户",
      keyword: "",
      form: {
        name: "",
        keywords: [],
        type: "general_account",
        currency_balance: "",
        currency_code: "CNY",
        status: "active",
        default: false,
        remark: "",
        exclude_from_stats: false,
      },
      statusList: [
        {
          name: "启用",
          value: "active",
        },
        {
          name: "冻结",
          value: "unactivated",
        },
      ],
      rules: {
        currency_balance: [
          {
            required: true,
            message: "请输入余额",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"],
          },
        ],
        name: [
          {
            required: true,
            message: "请输入账户名称",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  async onShow() {
    this.accountTypes = await this.getAccountTypes();
  },
  methods: {
    confirmAccountType(e) {
      this.account_type_name = e[0].label;
      this.form.type = e[0].value;
    },
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          this.$u.api.postAccounts(this.form).then((res) => {
            this.$refs.uToast.show({ title: "提交成功", type: "success" });
            this.$u.route({ url: "/pages/account/index", type: "tab" });
          });
        }
      });
    },
    onReady() {
      this.$refs.uForm.setRules(this.rules);
    },
    tagClick(e) {
      let index = this.form.keywords.indexOf(e);
      if (index >= 0) {
        this.form.keywords.splice(index, 1);
      }
    },
    addTag() {
      if (this.form.keywords.indexOf(this.keyword) === -1) {
        this.form.keywords.push(this.keyword);
        this.keyword = "";
      } else {
        this.$refs.uToast.show({ title: "关键词重复", type: "warning" });
      }
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
            resolve(data);
          })
          .catch((e) => {
            resolve([]);
          });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.wrap {
  padding: 10rpx 30rpx;
  .swiper-item {
    color: $u-tips-color;
  }
  .active {
    color: $u-type-primary;
  }
  .add-tag {
    flex-wrap: wrap;
    .button {
    }
  }
}
</style>
