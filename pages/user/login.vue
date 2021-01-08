<template>
  <view class="wrap">
    <view class="top"></view>
    <view class="content">
      <view class="title">欢迎登录 CashWarden</view>
      <input
        class="u-border-bottom"
        type="text"
        v-model="email"
        placeholder="请输入邮箱"
        :border="true"
      />
      <view class="tips">未注册的邮箱自动创建账号</view>
      <input
        class="u-border-bottom"
        type="password"
        v-model="password"
        placeholder="请输入密码"
        :border="true"
      />
      <button @tap="submit" :style="[inputStyle]" class="submit">
        登录或者注册
      </button>
      <view class="alternative">
        <view class="password">找回密码</view>
      </view>
    </view>
    <view class="buttom">
      <view class="loginType">
        <view class="wechat item">
          <view class="icon">
            <u-icon
              size="70"
              name="weixin-fill"
              color="rgb(83,194,64)"
            ></u-icon>
          </view>
          微信
        </view>
      </view>
      <view class="hint">
        登录代表同意《
        <text class="link">CashWarden 用户协议、隐私政策</text>
        》。
      </view>
    </view>
  </view>
</template>

<script>
import {
  USER_INFO,
  USER_TOKEN,
  USER_DEFAULT_LEDGER,
  USER_DEFAULT_LEDGER_ID,
} from "@/common/storage-keys";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    inputStyle() {
      let style = {};
      if (this.email && this.password && this.password.length >= 6) {
        style.color = "#fff";
        style.backgroundColor = this.$u.color["warning"];
      }
      return style;
    },
  },
  methods: {
    submit() {
      this.$u.api
        .login({ username: this.email, password: this.password })
        .then((res) => {
          uni.setStorage({ key: USER_INFO, data: res.user });
          uni.setStorage({ key: USER_TOKEN, data: res.token });
          uni.setStorage({
            key: USER_DEFAULT_LEDGER,
            data: res.default_ledger,
          });
          uni.setStorage({
            key: USER_DEFAULT_LEDGER_ID,
            data: res.default_ledger.id,
          });
          this.$u.route({
            url: "/pages/record/index",
            type: "tab",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  font-size: 28rpx;

  .content {
    width: 600rpx;
    margin: 80rpx auto 0;

    .title {
      text-align: left;
      font-size: 40rpx;
      font-weight: 500;
      margin-bottom: 100rpx;
    }

    input {
      text-align: left;
      margin-bottom: 10rpx;
      padding-bottom: 6rpx;
    }

    .tips {
      color: $u-type-info;
      margin-bottom: 60rpx;
      margin-top: 8rpx;
    }

    .submit {
      background-color: rgb(253, 243, 208);
      color: $u-tips-color;
      border: none;
      font-size: 30rpx;
      margin-top: 30rpx;
      padding: 12rpx 0;

      &::after {
        border: none;
      }
    }

    .alternative {
      color: $u-tips-color;
      display: flex;
      justify-content: space-between;
      margin-top: 30rpx;
    }
  }

  .buttom {
    .loginType {
      // display: flex;
      margin: 150rpx auto 100rpx;
      justify-content: space-between;

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: $u-content-color;
        font-size: 28rpx;
      }
    }

    .hint {
      padding: 20rpx 80rpx;
      font-size: 20rpx;
      color: $u-tips-color;

      .link {
        margin-left: 1rpx;
        color: $u-type-warning;
      }
    }
  }
}
</style>
