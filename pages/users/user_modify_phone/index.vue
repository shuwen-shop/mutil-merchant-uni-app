<template>
	<view :style="viewColor">
		<form report-submit='true'>
			<view>
				<view class="ChangePassword">
					<view class="list">
						<view class="item">
							<text class="phone">{{userInfo.phone}}</text>
						</view>
						<view class="item">
							<input type='number' placeholder='新手机号' placeholder-class='placeholder' v-model="phone"></input>
						</view>
						<view class="item acea-row row-between-wrapper">
							<input type='number' placeholder='验证码' placeholder-class='placeholder' class="codeIput" v-model="captcha"></input>
							<button class="code" :class="disabled === true ? 'on' : ''"  :disabled='disabled' @click="handleVerify">
								{{ text }}
							</button>
						</view>
						<view v-if="isShowCode" class="item acea-row row-between-wrapper" >
							<input type="text" placeholder-class='placeholder' placeholder="填写验证码" class="codeIput" v-model="codeVal" />
							<view class="code" @click=""><image class="code-img" :src="codeUrl" /></view>
						</view>
					</view>
				</view>
				<button form-type="submit" @click="confirmSubmit" class="confirmBnt">确认</button>
			</view>
		</form>
    <Verify @success="success" :captchaType="'blockPuzzle'" :imgSize="{ width: '330px', height: '155px' }" ref="verify"></Verify>
	</view>
</template>

<script>
	// +----------------------------------------------------------------------
	// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
	// +----------------------------------------------------------------------
	// | Copyright (c) 2016~2024 https://www.crmeb.com All rights reserved.
	// +----------------------------------------------------------------------
	// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
	// +----------------------------------------------------------------------
	// | Author: CRMEB Team <admin@crmeb.com>
	// +----------------------------------------------------------------------
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	import { modifyPhone, verifyCode } from '@/api/api.js';
	import { getUserInfo, getCaptcha } from '@/api/user.js';
	import { registerVerify } from '@/api/user.js'
	import { mapGetters } from "vuex";
	import { toLogin } from '@/libs/login.js';
  import Verify from '@/components/verify/verify.vue';
	export default {
		mixins: [sendVerifyCode],
		components: {
      Verify
		},
		data() {
			return {
				userInfo: {},
				phone:'',
				captcha:'',
				key: '',
				codeVal: '',
				codeUrl: "",
				disabled: false,
				isShowCode: false
			};
		},
		computed: mapGetters(['isLogin', 'viewColor']),
		onLoad() {
			let that = this
			if (this.isLogin) {
				this.getUserInfo()
			} else {
				toLogin()
			}
			// #ifdef MP
			wx.login({
			  success (res) {
			    if (res.code) {
			     that.codeVal = res.code
			    } else {
			      console.log('登录失败！' + res.errMsg)
			    }
			  }
			})
			// #endif
		},
		methods: {
			/**
			 * 获取个人用户信息
			 */
			getUserInfo: function() {
				let that = this;
				getUserInfo().then(res => {
					that.userInfo = res.data
				});
			},
			confirmSubmit: function() {
				let that = this;
				if (!that.phone) return that.$util.Tips({
					title: '请填写手机号码！'
				});
				if (!(/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.phone))) return that.$util.Tips({
					title: '请输入正确的手机号码！'
				});
				if (!that.captcha) return that.$util.Tips({
					title: '请填写验证码'
				});
				modifyPhone({
					phone: that.phone,
					sms_code: that.captcha

				}).then(res => {
					return that.$util.Tips({
						title: '修改成功！',
						icon: 'success'
					}, {
						tab: 5,
						url: '/pages/users/user_info/index'
					});
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				})
			},
			/**
			 * 发送验证码
			 *
			 */
			async code(data) {
				let that = this;
				if (!that.phone) return that.$util.Tips({
					title: '请填写手机号码！'
				});
				if (!(/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.phone))) return that.$util.Tips({
					title: '请输入正确的手机号码！'
				});
				that.disabled = true
				await registerVerify({
					phone:that.phone,
					code:that.captcha,
					type: 'change_phone',
          captchaType: 'blockPuzzle',
					captchaVerification: data.captchaVerification
				}).then(res => {
					that.disabled = false
					that.$util.Tips({
						title: res.message
					});
					that.sendCode();
				}).catch(err => {
					that.disabled = false
					// that.getcaptcha();
					return that.$util.Tips({
						title: err
					});
				});
			},
			getcaptcha() {
				let that = this
				getCaptcha().then(data => {
					that.codeUrl = data.data.captcha;
				})
				that.isShowCode = true;
			},
      success(data) {
				this.$refs.verify.hide();
				this.code(data);
			},
			handleVerify() {
				this.$refs.verify.show();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ChangePassword{
		background: #ffffff;
		padding-top: 53rpx;
	}
	.ChangePassword .phone {
		font-size: 32rpx;
	}
	.ChangePassword .list {
		width: 580rpx;
		margin: 0 auto;
	}
	.ChangePassword .list .item {
		width: 100%;
		height: 110rpx;
		display: flex;
		align-items: center;
		border-bottom: 2rpx solid #f0f0f0;
	}
	.ChangePassword .list .item input {
		width: 100%;
		height: 100%;
		font-size: 32rpx;
	}
	.ChangePassword .list .item .placeholder {
		color: #b9b9bc;
	}
	.ChangePassword .list .item input.codeIput {
		width: 340rpx;
	}
	.ChangePassword .list .item .code {
		font-size: 32rpx;
		position: relative;
		padding-left: 26rpx;
		color: var(--view-theme);
		&::before{
			content: "";
			width: 1rpx;
			height: 30rpx;
			position: absolute;
			top: 10rpx;
			left: 0;
			background: #DDDDDD;
			display: inline-block;
		}
	}
	.ChangePassword .list .item .code[disabled]{
		background: transparent;
	}
	.ChangePassword .list .item .code.on {
		color: #b9b9bc !important;
	}
	.ChangePassword .list .item .code-img{
		width: 100rpx;
		height: 50rpx;
	}
	 .confirmBnt {
		font-size: 32rpx;
		width: 580rpx;
		height: 90rpx;
		border-radius: 45rpx;
		color: #fff;
		margin: 70rpx auto 0 auto;
		text-align: center;
		line-height: 90rpx;
		background-color: var(--view-theme);
	}
</style>
