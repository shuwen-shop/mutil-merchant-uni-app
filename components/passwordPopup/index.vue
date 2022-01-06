<template>
	<view>
		<view class='password-window' :class='window==true?"on":""'>
			<view class='passwordCount'>
				<view class="title1 acea-row row-between-wrapper">
					<image :src="userInfo.avatar" class="picture"></image>
					<text class="name line1">{{userInfo.nickname}}</text>
					给你分享了宝贝
				</view>
				<view class="banner">
					<image :src="storeInfo.image"></image>
				</view>
				<view class="pro-info">
					<view class="price acea-row">¥<text class="money">{{storeInfo.price}}</text>
						<text v-if="storeInfo.product_type == 0" class="pro_type">普通商品</text>
					</view>
					<view class="name line1">{{storeInfo.store_name}}</view>
				</view>
				<button v-if="storeInfo.product_type != 3" class="go_btn" @click="goDetail(storeInfo)">查看详情</button>
				<button v-if="storeInfo.product_type == 3" class="go_btn btn1" @click="goDetail(storeInfo)">帮他助力</button>
			</view>
			<view class='lid'>
				<view class='iconfont icon-guanbi3' @click="close"></view>
			</view>
		</view>
		
		<view class='mask' catchtouchmove="true" :hidden="window==false" style="z-index: 999;"></view>
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

	import { pwdResolution } from '@/api/user.js'
	import { mapGetters } from "vuex";
	import {toLogin} from '@/libs/login.js';
	import { goShopDetail } from '@/libs/order.js'
	import {openBargainSubscribe} from '@/utils/SubscribeMessage.js';
	import {initiateAssistApi} from '@/api/activity.js';
	export default {
		props: {
			isLogin:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				window: false,
				couponList: [],
				userInfo: {
					
				},
				storeInfo: {
					
				},
				pwdInfo: {}
			};
		},
		computed: mapGetters(["copyPwd", "uid"]),
		watch: {
			copyPwd:{
				handler(nVal,oVal){
					if(nVal)this.resolution(nVal)
				},
				immediate: true,
				deep:true
			}
		},
		mounted(){		
		},
		beforeDestroy(){
			
		},
		methods: {
			close:function(){
			    this.window = false
			},
			resolution(data){
				let com = uni.getStorageSync('pwdKey')
				pwdResolution(data).then(res => {
					if(res.data.user && res.data.user.uid != this.uid && com !=res.data.com){
						this.window = true;
						this.pwdInfo = res.data;
						this.userInfo = res.data.user;
						this.storeInfo = res.data.data;
						if(res.data.activity_id )this.storeInfo.activity_id = res.data.activity_id 
						if(res.data.product_type )this.storeInfo.product_type = res.data.product_type 
						this.$store.commit("PARSE_PWD", null)
						uni.setStorageSync('pwdKey', res.data.com);
					}
				})
			},
			goDetail(item){
				goShopDetail(item, this.uid).then(res => {
					this.$store.commit("PARSE_PWD", null)
					if (this.isLogin) {
							initiateAssistApi(item.activity_id).then(res => {
								let id = res.data.product_assist_set_id;
								uni.hideLoading();
								// #ifndef MP
								uni.navigateTo({
									url: '/pages/activity/assist_detail/index?id=' + id
								});
								// #endif
								// #ifdef MP
								openBargainSubscribe().then(res => {
									uni.hideLoading();
									uni.navigateTo({
										url: '/pages/activity/assist_detail/index?id=' + id
									});
								}).catch((err) => {
									uni.hideLoading();
								});
								// #endif					
							}).catch((err) => {
								uni.showToast({
									title: err,
									icon: 'none'
								})
							});
						} else {
							// #ifdef H5 || APP-PLUS
							toLogin();
							// #endif 
							// #ifdef MP
							this.$emit('isShowAuth', true);
							this.$emit('isAuto', true);
							// #endif
						}
					})		
			}
		}
	}
</script>

<style scoped lang="scss">
	.password-window {
		background-image: url('data:image/png;base64,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8A7vzzVqA6mYuwhTTs9pAx0N4mnXXhEivMcXrtiPJMXQzZNr5TZM86P9YQV1jRDhA7x8rulCCkuxiknMTw2lOZvEWi2VTiA20CAIET7CV67aNUopapYefGdE/6Gq6YlJ49MmECNoDIQIT6hNkh5lUYuk1ovppvVqUaEEqBWIx8sGRYjwEC9cs2dbkUSsglheCSpWqdoynT7Ks3/GRYjwTS1Ne7GJdBYP6WrLtD3cv/8eQoSv8/85717z5SfYPT+JEAEwR4gAmCNEAMwRIgDmCBEAc4QIgDlCBMAcIQJgjhABMEeIAJgjRADMESIA5ggRAHOECIA5QgTAHCECYI4Q4Y+dOhYAAAAAGORvPYw9BRHsRATsRATsRATsRATsRATsRATsRATsRATsRATsRATsRATsRATsRASxW0Y5CsMwFERW7n/mrYTwbt92qCOspkhvfqCOazdNMmCWYxEZY5ZjERljlmMRGWOWYxEZY5bzV0SxMQQZ1Rwdz29cNRLKyBgyk302J7568r+aBKc66pvMHh9RqyHdYEwzAjrJW0L4vpk51OpTD31K2Xv5yVU1zved7+z6nF89jp5JnmFyF5SedAzJoBWfPGFHFR6qh0tFxDW5xryIok9EFXnEk24RxcYCEcWL/WWTiDLaJaIoiiimRKSu+UxEUV43mNQVIsoW3SJKVEQh6NLtx46isOxQU9E4ZOLh1Rx+/n0cRjJy3FWhXnPvQBVAlTWqV7zUx6snYwlF9HttPiHAqtSzp4D80q7OKP5E8Uz1voy96Z8UTyXXqORFkbFBu0/j539K4LxaRBaRRWQRrRfR9MLVNqC2gox2tBfnxc0Y453irn5DXZ3HmB3v7tezm1m/dOxJX/2zyOqtiGKb1oQqWUS3wSL6xSKyiCb5zkNvjLkVFpExZjmPMMb8sFPHNAAAMBCE/Luuhk6XfEAE/IgI2CMiICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICciICeiY6eOBQAAAAAG+VsPY09BBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBOxEBLFTRikMAyEUJLn/oduPQqBjXARhDZn5KJs1PjTaJ9vRiERkOxqRiGyHRnR8wSUipJbDaD/9PTGzHuc7129dL+f40aNGqIkzojWogecNs6+o8a2+XMZ7u8FuFrI1Io1II9KInmdEHO5FfH9XLk4A5YZ3UMOKZ09Uu1TjCGEX0A47zb8E64yNiJWt/9rV7rLJrfu+nzItNs7jiZmsI+qLGqyOe82v9H+z3qdoivE0CTkTqML5U4U3q2o5lbxCRjmlSJsRjUgj0og0ogFGdISpuCV3koRa9Xi+XBw/VJvgSAr9pBbNE6PsNtfKp5Ktd/bt61CxQR/EJkZg+Q00aBXzK5vHnrOcfBf7O9OINCKNSCOaZ0T7qVhZPdqRydFWM/A8hkm1zKj2POfVBLZ33aKpEWlEE2uZUa1GFPAGIxKRV6IRich2NCIR+bBTxwIAAAAAg/yth7GnINqJCNiJCNiJCNiJCNiJCNiJCNiJCNiJCNiJCNiJCNiJCNiJCNiJCIh9O8ZpKIiCIDib2PEHyUhGhOb+R8TiEp1UHaKDnX05IQJyQgTkhAjICRGQEyIgJ0RAToiAnBABOSECckIE5IQIyAkRkBMiICdEQE6IgJwQATkhAnJCBOSECMgJEZATIiAnREBOiICcEAE5IQJyQgTkhAjICRGQEyIgJ0RAToiAnBABOSECckIE5IQIyAkRkBMiICdEQO3azwFIfe06AKlrrwOQeu15AFLfexyA1GP3A5C6z34PxDazGdC6tv0egNBz28cBCH1uux2A0G0eiYDWtTc/iYDSY28GfKC0f87N+GvvXnIbBIIggBaygIUXCBBeJGt8/yMmih3Hiaz4h5nNe4dolWqmZ6CcOQebCqCQTT6pq4GC+nwbK4AixkQkAorq88UJPlDOkIhEQFF9zniVCCihzQ87+EAJ+5y4Xg2UkRO3GoEy2vzlOw9gXW85cnIGFNLnkmZbAaxk2+SiugJYSZ0DhTVQSpvfrHoAa9slJhFQyPU55HMhYA1jjvREQCFtrqq7CuBlujr/8pg+8Gr7nFFZAwUMuVkjFAEvMDe5x8a+B7CwbpN77ZTWwIL6XR4xGkXAQroxj2p1RcAC5jZPad+1RcATtu9tFtBMghHwkHlqspx6mOauE46Am2y7bp6GOrf5ABG5tCPfngjKAAAAAElFTkSuQmCC');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-color: #fff;
		width: 580rpx;
		height: 910rpx;
		position: fixed;
		top: 50%;
		z-index: 1000;
		left: 50%;
		margin-left: -290rpx;
		margin-top: -455rpx;
		transform: translate3d(0, -200%, 0);
		transition: all .3s cubic-bezier(.25, .5, .5, .9);
		border-radius: 24rpx;
		padding: 25rpx 30rpx 40rpx;
	}
	
	.password-window.on {
		transform: translate3d(0, 0, 0);
	}
	.passwordCount .title1{
		width: 350rpx;
		margin: 0 auto;
		height: 42rpx;
		background: #F1F1F1;
		border-radius: 23rpx;
		padding: 0 15rpx;
		color: #666666;
		font-size: 24rpx;
		.picture{
			width: 36rpx;
			height: 36rpx;
			border-radius: 100%;
			image{
				width: 36rpx;
				height: 36rpx;
			}
		}
		.name{
			color: #282828;
			font-weight: bold;
			max-width: 100rpx;
			margin: 0 10rpx;
		}
	}
	.password-window .banner{
		width: 520rpx;
		height: 520rpx;
		margin-top: 25rpx;
		image{
			width: 520rpx;
			height: 520rpx;
			border-radius: 16rpx;
		}
	}
	.password-window .pro-info{
		margin-top: 15rpx;
		.price{
			color: #E93323;
			font-size: 26rpx;
			justify-content: left;
			align-items: center;
			.money{
				font-size: 42rpx;
			}
		}
		.pro_type{
			display: inline-block;
			width: 100rpx;
			height: 28rpx;
			text-align: center;
			line-height: 28rpx;
			background: #FDEAE8;
			margin-left: 30rpx;
			font-size: 18rpx;
			position: relative;
			&::before{
				content: "";
				display: inline-block;
				width: 0;
				height: 0;
				border-width: 15rpx 15rpx 15rpx 0;
				border-style: solid;
				border-color: transparent #FDEAE8 transparent transparent;
				position: absolute;
				left: -16rpx;
			}
			&::after{
				content: "";
				display: inline-block;
				width: 6rpx;
				height: 6rpx;
				background: #fff;
				border-radius: 100%;
				position: absolute;
				top: 12.5rpx;
				left: -4rpx;
				z-index: 10;
			}
		}
		.name{
			margin-top: 15rpx;
			color: #282828;
			font-size: 30rpx;
		}
	}
	.password-window .lid {
		position: absolute;
		bottom: -100rpx;
		left: 0;
		width: 100%;
		text-align: center;
	}
	.go_btn{
		margin-top: 50rpx;
		width: 520rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background: #E93323;
		color: #ffffff;
		border-radius: 40rpx;
		font-size: 28rpx;
		&.btn1{
			background: #FC8327
		}
	}
	.password-window .lid .iconfont {
		color: #fff;
		font-size: 60rpx;
		text-align: center;
		margin-left: -30rpx;
	}
</style>
