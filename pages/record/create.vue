<template>
  <view class="wrap">
    <u-toast ref="uToast"></u-toast>
    <view>
      <u-tabs-swiper
        ref="uTabs"
        :list="typeList"
        :current="currentType"
        @change="tabsChange"
        :is-scroll="false"
        swiperWidth="750"
      ></u-tabs-swiper>
    </view>
    <swiper
      :current="swiperCurrent"
      @transition="transition"
      @animationfinish="animationfinish"
    >
      <swiper-item
        class="swiper-item"
        v-for="(item, index) in typeList"
        :key="index"
      >
        <u-grid :col="5" :border="false" @click="clickType">
          <u-grid-item
            v-for="(category, i) in ledgerCategories[form.type]"
            :key="i"
            :index="category.id"
            v-bind:class="{ active: category.id == form.category_id }"
          >
            <u-icon
              :name="category.icon_name"
              custom-prefix="custom-icon"
              size="46"
            ></u-icon>
            <view class="grid-text">{{ category.name }}</view>
          </u-grid-item>
        </u-grid>
      </swiper-item>
    </swiper>

    <u-form :model="form" ref="uForm" class="form" :error-type="errorType">
      <u-form-item
        prop="from_account_id"
        v-if="['expense', 'transfer'].includes(form.type)"
      >
        <u-input
          :border="border"
          type="select"
          :select-open="showFromAccount"
          v-model="from_account_name"
          placeholder="请选择支付账户"
          @click="showFromAccount = true"
        ></u-input>
      </u-form-item>

      <u-form-item
        prop="to_account_id"
        v-if="['income', 'transfer'].includes(form.type)"
      >
        <u-input
          :border="border"
          type="select"
          :select-open="showToAccount"
          v-model="to_account_name"
          placeholder="请选择收款账户"
          @click="showToAccount = true"
        ></u-input>
      </u-form-item>

      <u-form-item prop="date">
        <u-input
          :border="border"
          :select-open="showDate"
          v-model="form.date"
          placeholder="时间"
          @click="showDate = true"
        ></u-input>
      </u-form-item>

      <!-- <view class="item" @tap="showDate = true">
        <input
          disabled
          type="text"
          placeholder-class="line"
          v-model="form.date"
          placeholder="时间"
        />
      </view> -->

      <u-form-item prop="currency_amount">
        <u-input
          v-model="form.currency_amount"
          type="number"
          placeholder="交易金额"
        />
      </u-form-item>

      <u-form-item
        label="不计入统计"
        prop="exclude_from_stats"
        label-width="150"
        :label-style="labelStyle"
        v-if="form.type != 'transfer'"
      >
        <u-switch v-model="form.exclude_from_stats" slot="right"></u-switch>
      </u-form-item>

      <u-form-item
        :label-position="labelPosition"
        label="报销状态"
        prop="reimbursement_status"
        label-width="150"
        :label-style="labelStyle"
        v-if="form.type != 'transfer'"
      >
        <u-radio-group
          v-model="form.reimbursement_status"
          @change="radioGroupChange"
          width="auto"
          :wrap="false"
        >
          <u-radio
            shape="circle"
            v-for="(item, index) in reimbursementStatusList"
            :key="index"
            :name="item.value"
            >{{ item.name }}</u-radio
          >
        </u-radio-group>
      </u-form-item>

      <u-form-item :label-position="labelPosition" prop="remark">
        <u-input
          type="textarea"
          :border="border"
          placeholder="备注"
          v-model="form.remark"
        />
      </u-form-item>

      <u-button @click="submit" class="button">提交</u-button>
    </u-form>

    <u-calendar
      v-model="showDate"
      mode="date"
      @change="changeDate"
    ></u-calendar>

    <u-select
      v-model="showFromAccount"
      :list="accounts"
      @confirm="confirmFromAccount"
    ></u-select>

    <u-select
      v-model="showToAccount"
      :list="accounts"
      @confirm="confirmToAccount"
    ></u-select>
  </view>
</template>

<script>
import { USER_DEFAULT_LEDGER_ID } from "@/common/storage-keys";

export default {
  data() {
    return {
      errorType: ["border-bottom"],
      border: false,
      labelPosition: "left",
      ledgerCategories: [],
      showToAccount: false,
      showFromAccount: false,
      showDate: false,
      from_account_name: "",
      to_account_name: "",
      labelStyle: {
        color: "#c8c9cc",
      },
      form: {
        type: "expense",
        from_account_id: "",
        to_account_id: "",
        currency_amount: "",
        currency_code: "CNY",
        category_id: "",
        tags: [],
        description: "",
        remark: "",
        date: this.$u.timeFormat("", "yyyy-mm-dd"),
        reimbursement_status: "none",
        exclude_from_stats: false,
        status: "done",
      },
      rules: {
        currency_amount: [
          {
            required: true,
            message: "请输入金额",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"],
          },
        ],
      },
      // 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
      currentType: 0, // tabs组件的current值，表示当前活动的tab选项
      swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
      typeList: [
        { name: "支出", value: "expense" },
        { name: "收入", value: "income" },
        { name: "转账", value: "transfer" },
      ],
      reimbursementStatusList: [
        { name: "不需要", value: "none" },
        { name: "待报销", value: "todo" },
        { name: "已报销", value: "done" },
      ],
      accounts: [],
    };
  },
  async onShow() {
    this.ledgerCategories = await this.getLedgerCategories();
    this.accounts = await this.getAccounts();
  },
  methods: {
    clickType(index) {
      this.form.category_id = index;
      this.$refs.uToast.show({
        title: `点击了第${index + 1}宫格`,
        type: "warning",
      });
    },
    showAccountPicker() {
      this.showAccount = true;
    },
    showDatePicker() {
      this.showDate = true;
    },
    changeDate(e) {
      this.form.date = e.result;
      console.log(e);
    },
    confirmFromAccount(e) {
      this.from_account_name = e[0].label;
      this.form.from_account_id = e[0].value;
    },
    confirmToAccount(e) {
      this.to_account_name = e[0].label;
      this.form.to_account_id = e[0].value;
    },
    getLedgerCategories() {
      return new Promise((resolve, reject) => {
        let params = { ledger_id: uni.getStorageSync(USER_DEFAULT_LEDGER_ID) };
        this.$u.api
          .getLedgersCategories(params)
          .then((res) => {
            resolve(res[0].categories);
          })
          .catch((e) => {
            resolve([]);
          });
      });
    },
    getAccounts() {
      return new Promise((resolve, reject) => {
        this.$u.api
          .getAccounts()
          .then((res) => {
            let accounts = res.items.map((item) => ({
              value: item.id,
              label: item.name,
            }));
            console.log(accounts);
            resolve(accounts);
          })
          .catch((e) => {
            resolve([]);
          });
      });
    },
    // tabs通知swiper切换
    tabsChange(index) {
      this.swiperCurrent = index;
    },
    // swiper-item左右移动，通知tabs的滑块跟随移动
    transition(e) {
      let dx = e.detail.dx;
      this.$refs.uTabs.setDx(dx);
    },
    // 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
    // swiper滑动结束，分别设置tabs和swiper的状态
    animationfinish(e) {
      let current = e.detail.current;
      this.$refs.uTabs.setFinishCurrent(current);
      this.swiperCurrent = current;
      this.form.type = this.typeList[current].value;
      this.currentType = current;
    },
    onReady() {
      this.$refs.uForm.setRules(this.rules);
    },
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
};
</script>

<style lang="scss" scoped>
.wrap {
  .form {
    padding: 30rpx;
  }
  .swiper-item {
    color: $u-tips-color;
  }
  .active {
    color: $u-type-primary;
  }
}
</style>
