<template>
	<view>
		<view class='Popup' v-if='isShowAuth && code'>
			<view class="logo-auth">
				<image :src='logoUrl' mode="aspectFit"></image>
			</view>
			<view class='title'>授权提醒</view>
			<view class='tip'>请授权头像等信息，以便为您提供更好的服务</view>
			<view class='bottom flex'>
				<view class='item' @click='close'>随便逛逛</view>
				<!-- #ifdef APP-PLUS -->
				<button class='item grant' @click="setUserInfo">去授权</button>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<button v-if="canUseGetUserProfile" class="item grant" hover-class="none"
					@tap="getUserProfile">去授权</button>
				<button v-else class='item grant' type="primary" open-type="getUserInfo" lang="zh_CN"
					@getuserinfo="setUserInfo">去授权</button>
				<!-- #endif -->
			</view>
		</view>
		<view class='mask' v-if='isShowAuth && code' @click='close'></view>
	</view>
</template>

<script>
	// +----------------------------------------------------------------------
	// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
	// +----------------------------------------------------------------------
	// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
	// +----------------------------------------------------------------------
	// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
	// +----------------------------------------------------------------------
	// | Author: CRMEB Team <admin@crmeb.com>
	// +----------------------------------------------------------------------
	const app = getApp();
	import Cache from '../utils/cache';
	import {
		getLogo
	} from '../api/public';
	import {
		LOGO_URL
	} from '../config/cache';
	import {
		mapGetters
	} from 'vuex';
	import Routine from '../libs/routine';

	export default {
		name: 'Authorize',
		props: {
			isAuto: {
				type: Boolean,
				default: true
			},
			isGoIndex: {
				type: Boolean,
				default: true
			},
			isShowAuth: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				logoUrl: app.globalData.routine_logo,
				canUseGetUserProfile: false,
				code: null,
			}
		},
		computed: mapGetters(['isLogin', 'userInfo']),
		watch: {
			isLogin(n) {
				n === true && this.$emit('onLoadFun', this.userInfo);
			},
			isShowAuth(n) {
				if (n) {
					uni.showLoading({
						title: '正在登录中'
					});
					Routine.getCode().then(code => {
						uni.hideLoading();
						this.code = code;
					}).catch(e => {
						uni.hideLoading();
						uni.showToast({
							title: '登录失败',
							duration: 2000
						});
					})
				} else {
					this.code = null;
				}
			}
		},
		created() {
			if (wx.getUserProfile) {
				this.canUseGetUserProfile = true
			}
			this.getLogoUrl();
			this.setAuthStatus();
			uni.$on('update', (data) => {
				this.logoUrl = data.login_logo
			})
		},
		mounted: function() {
			this.$nextTick(() => {
				this.logoUrl = app.globalData.login_logo
			});
		},
		methods: {
			setAuthStatus() {
				Routine.authorize().then(res => {
					if (res.islogin === false)
						this.$emit('onLoadFun', this.userInfo);
				}).catch(res => {
					if (this.isAuto)
						this.$emit('authColse', true);
				})
			},
			getUserInfo(code) {
				Routine.getUserInfo().then(res => {
					let userInfo = res.userInfo
					userInfo.code = code;
					userInfo.spread_spid = this.$Cache.get("spread") || app.globalData.spid; //获取推广人ID
					userInfo.spread_code = app.globalData.code; //获取推广人分享二维码ID
					Routine.authUserInfo(userInfo).then(res => {
						uni.hideLoading();
						this.$emit('authColse', false);
						this.$emit('onLoadFun', this.userInfo);
					}).catch(res => {
						uni.hideLoading();
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						});
					})
				}).catch(res => {
					uni.hideLoading();
				})
			},
			getUserProfile() {
				let self = this;

				Routine.getUserProfile()
					.then(res => {
						let userInfo = res.userInfo;
						userInfo.code = this.code;
						userInfo.spread_spid = app.globalData.spid; //获取推广人ID
						userInfo.spread_code = app.globalData.code; //获取推广人分享二维码ID
						Routine.authUserInfo(userInfo)
							.then(res => {
								if (res.data.key !== undefined && res.data.key) {
									uni.hideLoading();
									self.authKey = res.data.key;
									self.isPhoneBox = true;
								} else {
									uni.hideLoading();
									let time = res.data.expires_time - self.$Cache.time();
									self.$store.commit('LOGIN', {
										token: res.data.token,
										time: time
									});
								}
							})
							.catch(res => {
								uni.hideLoading();
								uni.showToast({
									title: res.msg,
									icon: 'none',
									duration: 2000
								});
							});
					})
					.catch(res => {
						uni.hideLoading();
					});

			},

			setUserInfo() {
				uni.showLoading({
					title: '正在登录中'
				});
				this.getUserInfo(this.code);
				this.$emit('authColse', false);
			},
			getLogoUrl() {
				this.logoUrl = app.globalData.routine_logo
				// let that = this;
				// if (Cache.has(LOGO_URL)) {
				// 	this.logoUrl = Cache.get(LOGO_URL);
				// 	return;
				// }
				// getLogo().then(res=>{
				// 	that.logoUrl = res.data.logo_url
				// 	Cache.set(LOGO_URL,that.logoUrl);
				// })
			},
			close() {
				let pages = getCurrentPages(),
					currPage = pages[pages.length - 1];
				if (this.isGoIndex) {
					uni.switchTab({
						url: '/pages/index/index'
					});
				} else {
					this.$emit('authColse', false);
				}
				// if (currPage && currPage.isShowAuth != undefined){
				// 	currPage.isShowAuth = true;
				// }
			},
		}
	}
</script>

<style scoped lang='scss'>
	.Popup {
		width: 500rpx;
		background-color: #fff;
		position: fixed;
		top: 50%;
		left: 50%;
		margin-left: -250rpx;
		transform: translateY(-50%);
		z-index: 1000;
	}

	.Popup {
		.logo-auth {
			z-index: -1;
			position: absolute;
			left: 50%;
			top: 0%;
			transform: translate(-50%, -50%);
			width: 150rpx;
			height: 150rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 8rpx solid #fff;
			border-radius: 50%;
			background: #fff;
		}

		image {
			height: 42rpx;
			margin-top: -54rpx;
		}
	}

	.Popup .title {
		font-size: 28rpx;
		color: #000;
		text-align: center;
		margin-top: 30rpx
	}

	.Popup .tip {
		font-size: 22rpx;
		color: #555;
		padding: 0 24rpx;
		margin-top: 25rpx;
	}

	.Popup .bottom .item {
		width: 50%;
		height: 80rpx;
		background-color: #eeeeee;
		text-align: center;
		line-height: 80rpx;
		font-size: 24rpx;
		color: #666;
		margin-top: 54rpx;
	}

	.Popup .bottom .item.on {
		width: 100%
	}

	.flex {
		display: flex;
	}

	.Popup .bottom .item.grant {
		font-size: 28rpx;
		color: #fff;
		font-weight: bold;
		background-color: #e93323;
		border-radius: 0;
		padding: 0;
	}

	.mask {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.65);
		z-index: 999;
	}
</style>
