<template>
	<view>
		<skeleton :show="showSkeleton" :isNodes="isNodes" ref="skeleton" loading="chiaroscuro" selector="skeleton"
			bgcolor="#FFF"></skeleton>
		<view class="new-users skeleton" :style="{visibility: showSkeleton ? 'hidden' : 'visible'}">
			<view class="head">
				<view class="user-card">
					<view class="bg"></view>
					<view class="user-info">
						<image class="avatar skeleton-radius" :src="userInfo.avatar ? userInfo.avatar : '/static/images/f.png'" @click="goEdit()"></image>
						<!-- <image v-else class="avatar" src="/static/images/f.png" @click="goEdit()"></image> -->
						<view class="info">
							<!-- #ifdef APP-PLUS -->
							<view class="name" v-if="!userInfo.uid" @click="APPtoLogin()">
								登录/注册
							</view>
							<!-- #endif -->
							<!-- #ifdef MP -->
							<view class="name" v-if="!userInfo.uid" @tap="openAuto">
								请点击授权
							</view>
							<!-- #endif -->
							<view class="name" v-if="userInfo.uid">
								{{userInfo.nickname}}<image v-if="member_status" class="level_icon" :src="userInfo.member_icon" alt="">
								<view class="vip" v-if="userInfo.vip">
									<image :src="userInfo.vip_icon" alt="">
									<view style="margin-left: 10rpx;" class="vip-txt">{{userInfo.vip_name}}</view>
								</view>
							</view>
							<view class="num" v-if="userInfo.phone" @click="goEdit()">
								<view class="num-txt">ID：{{userInfo.uid}}</view>
								<view class="icon">
									<image src="/static/images/edit.png" mode=""></image>
								</view>
							</view>
							<view class="phone" v-if="!userInfo.phone && isLogin" @tap="bindPhone">绑定手机号</view>
						</view>
					</view>				
					<view class="num-wrapper skeleton-rect">
						<view class="num-item" @click="goMenuPage('/pages/users/user_goods_collection/index')">
							<text class="num">{{userInfo.total_collect_product || 0}}</text>
							<view class="txt">我的收藏</view>
						</view>
						<view v-if="hide_mer_status == 0" class="num-item" @click="goMenuPage('/pages/users/user_store_attention/index')">
							<text class="num">{{userInfo.total_collect_store || 0}}</text>
							<view class="txt">关注店铺</view>
						</view>
						<view class="num-item" @click="goMenuPage('/pages/users/browsingHistory/index')">
							<text class="num">{{userInfo.total_visit_product || 0}}</text>
							<view class="txt">浏览记录</view>
						</view>
						<view class="num-item" @click="goMenuPage('/pages/users/user_coupon/index')">
							<text class="num">{{userInfo.total_coupon || 0}}</text>
							<view class="txt">优惠券</view>
						</view>
					</view>
					<view class="right-btn">
						<view class="iconfont icon-shezhi" @click="goEdit()" v-if="userInfo.phone"></view>
						<navigator class="btn" url="/pages/chat/customer_list/index?type=0" hover-class="none">
							<view class="iconfont icon-xiaoxi"></view>
							<text class="iconnum" v-if="userInfo.total_unread">{{userInfo.total_unread}}</text>
						</navigator>
					</view>
				</view>
			</view>
			<view v-if="isLogin" class="wrapper">
		
				<view class="order-wrapper">
					<view class="order-hd flex skeleton-rect">
						<view class="left">我的订单</view>
						<navigator class="right flex" hover-class="none" url="/pages/users/order_list/index" open-type="navigate">
							全部订单
							<text class="iconfont icon-xiangyou"></text>
						</navigator>
					</view>
					<view class="order-bd">
						<block v-for="(item,index) in orderMenu" :key="index">
							<navigator class="order-item" hover-class="none" :url="item.url">
								<view class="pic">
									<image :src="item.img" mode="" class="skeleton-radius"></image>
									<text class="order-status-num" v-if="item.num > 0">{{ item.num }}</text>
								</view>
								<view class="txt skeleton-rect">{{item.title}}</view>
							</navigator>
						</block>
					</view>
				</view>
				<!-- 轮播 -->
				<view class="slider-wrapper skeleton-rect" v-if="imgUrls.length>0">
					<swiper indicator-dots="true" :autoplay="autoplay" :circular="circular" :interval="interval" :duration="duration"
					 indicator-color="rgba(255,255,255,0.6)" indicator-active-color="#fff">
						<block v-for="(item,index) in imgUrls" :key="index">
							<swiper-item>
								<navigator :url='item.url' class='slide-navigator acea-row row-between-wrapper' hover-class='none'>
									<image :src="item.pic" class="slide-image"></image>
								</navigator>
							</swiper-item>
						</block>
					</swiper>
				</view>
				<!-- 会员菜单 -->				
				<view class="user-menus" style="margin-top: 20rpx;">
					<view class="title skeleton-rect">我的服务</view>
					<view class="menu-box" v-if="isLogin">						
						<block v-for="(item,index) in personalMenu" :key="index">
							<view v-if="item.isShow" class="item">
								<navigator :url="item.url" class="item-count" hover-class="none">
									<image v-if="showSkeleton" class="skeleton_image skeleton-radius"></image>
									<image v-else :src="item.pic"></image>
									<text>{{item.name}}</text>
								</navigator>
							</view>
						</block>			
					</view>
				</view>

				<view v-if="merchantMenu.length > 0 && userInfo.service" class="user-menus" style="margin-top: 20rpx;">
					<view class="title skeleton-rect">商家管理</view>
					<view class="menu-box" v-if="isLogin">
						<block v-for="(item,index) in merchantMenu" :key="index">
							<view class="item skeleton-rect">
								<navigator :url="item.url" class="item-count" hover-class="none">
									<image v-if="showSkeleton" class="skeleton_image skeleton-radius"></image>
									<image v-else :src="item.pic" class="skeleton-radius"></image>
									<text class="skeleton-rect">{{item.name}}</text>
								</navigator>
							</view>						
						</block>					
					</view>
				</view>	
				
			</view>
			<!-- <view class="copy-right"> -->
				<!-- <view class="iconfont icon-crmeb"></view> -->
				<!-- <view class="text">众邦科技提供技术支持</view> -->
			<!-- </view> -->
			<view style="height: 50rpx;"></view>
			<!-- #ifdef MP -->
			<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize>
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<passwordPopup></passwordPopup>
			<!-- #endif -->
		</view>
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
	import {
		getMenuList,
		getUserInfo,
		setVisit
	} from '@/api/user.js';
	import { toLogin } from '@/libs/login.js';
	import { orderData } from '@/api/order.js'
	import { getconfig } from '@/api/public.js'
	import { mapGetters } from "vuex";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	// #ifndef H5
	import passwordPopup from '@/components/passwordPopup';
	// #endif
	const app = getApp();
	export default {
		components: {
			// #ifndef H5
			passwordPopup,
			// #endif
			// #ifdef MP
			authorize
			// #endif
		},
		computed: mapGetters(['isLogin']),
		data() {
			return {
				showSkeleton: true, //骨架屏显示隐藏
				isNodes: 0, //控制什么时候开始抓取元素节点,只要数值改变就重新抓取
				orderMenu: [{
						img: '/static/images/order1.png',
						title: '待付款',
						url: '/pages/users/order_list/index?status=0',
						num: 0
					},
					{
						img: '/static/images/order2.png',
						title: '待发货',
						url: '/pages/users/order_list/index?status=1',
						num: 0
					},
					{
						img: '/static/images/order3.png',
						title: '待收货',
						url: '/pages/users/order_list/index?status=2',
						num: 0
					},
					{
						img: '/static/images/order4.png',
						title: '待评价',
						url: '/pages/users/order_list/index?status=3',
						num: 0
					},
					{
						img: '/static/images/order5.png',
						title: '售后/退款',
						url: '/pages/users/refund/list',
						num: 0
					},
				],
				imgUrls: [{url:'',pic:''}],
				userMenu: [],
				skeletonMenu: [
					
				],
				merchantMenu: [
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true}
				],
				personalMenu: [
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true},
					{pic: '',name: '',isShow: true}
					
				],
				autoplay: true,
				circular: true,
				interval: 3000,
				duration: 500,
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				orderStatusNum: {},
				userInfo: {aratar: '/static/f.png'},
				MyMenus: [],
				balance_func_status: 0, //余额开关 1开
				is_promoter: 0, //推广人开关  1开
				extension_status: 0,
				mer_intention_open: 0,
				hide_mer_status: 1,
				integral_status: 0,
				member_status: 0,
			}
		},
		onLoad() {
			getconfig().then(res => {
				this.balance_func_status = res.data.balance_func_status
				this.mer_intention_open = res.data.mer_intention_open
				this.hide_mer_status = res.data.hide_mer_status
				this.integral_status = res.data.integral_status
				this.member_status = res.data.member_status
				try {
					uni.setStorageSync('SUBSCRIBE_MESSAGE', res.data.tempid);
				} catch (e) {
					// error
				}
				// #ifdef H5
				this.setOpenShare(res.data);
				// #endif
			}).catch(err => {})
			let that = this;

			if (that.isLogin == false) {
				// #ifdef H5
				toLogin();
				// #endif
			}
			setTimeout(() => {
				that.showSkeleton = false
			}, 500)
		},
		onReady() {
			this.isNodes++;
			uni.$on('update', (data) => {
				this.balance_func_status = data.balance_func_status
				this.mer_intention_open = data.mer_intention_open
				this.hide_mer_status = data.hide_mer_status
				this.integral_status = data.integral_status
				this.member_status = data.member_status
			})
		},
		mounted: function() {
			const app = getApp();
			this.$nextTick(() => {
				this.hide_mer_status = app.globalData.hide_mer_status
				this.balance_func_status = app.globalData.balance_func_status
				this.mer_intention_open = app.globalData.mer_intention_open
				this.hide_mer_status = app.globalData.hide_mer_status
				this.member_status = app.globalData.member_status
			});
		},
		onShow: function() {
			let that = this;
			if (that.isLogin) {
				this.getUserInfo();
				this.orderNum();
				// this.setVisit();
			} else {
				// #ifdef H5 || APP-PLUS
				toLogin();
				// #endif
				// #ifdef APP-PLUS
				this.userInfo = {}
				// #endif
			}
		},
		methods: {
			// 菜单显示
			filterMenus: function(item){
				let that = this;
				if(item.key=='balance') item.isShow =  that.balance_func_status
				if(item.key=='promoter'){
					if(that.extension_status == 0){
						item.isShow = false
					} else if(that.extension_status == 1){
						if(that.is_promoter == 1){
							item.isShow = that.is_promoter == 1 && that.extension_status == 1
							item.url="/pages/users/user_spread_user/index"
						}else if(that.is_promoter == 0 ){
							item.isShow = that.is_promoter == 0 && that.extension_status == 1
							item.url="/pages/users/distributor/index"
						}
					}					
				}
				if(item.key=='intention') item.isShow = that.mer_intention_open == 1 && that.hide_mer_status == 0
				if(item.key=='verify_order') item.isShow = that.userInfo.service && that.userInfo.service.is_verify
				if(item.key=='admin_order') item.isShow = that.userInfo.service && that.userInfo.service.customer === 1
				if(item.key=='product') item.isShow = that.userInfo.service && that.userInfo.service.is_goods === 1
				if(item.key=='member') item.isShow = that.member_status == '1' ? true : false
				if(item.key=='service'){
					item.url = '/pages/chat/customer_list/index?type=1'	
					item.isShow = that.userInfo.service 
				} 
				if(item.key=='integral') item.isShow = that.integral_status == 1 ? true : false
				if(!item.key || ['integral','service','admin_order','verify_order','intention','promoter','balance', 'member'].indexOf(item.key) === -1) item.isShow = true
				return
			},
			showMenu(menu){
				return !menu || ['integral','service','admin_order','verify_order','intention','promoter','balance'].indexOf(menu) === -1;
			},
			goUrl(url){
				uni.navigateTo({
					url
				})
			},
			// 去聊天列表
			goChat() {
				let type = this.userInfo.service ? 1 : 0
				uni.navigateTo({
					url: `/pages/chat/customer_list/index?type=${type}`
				})

			},
			// 记录会员访问
			setVisit() {
				setVisit({
					url: '/pages/user/index'
				}).then(res => {})
			},
			// 打开授权
			openAuto() {
				this.isAuto = true;
				this.isShowAuth = true
			},
			// 授权回调
			onLoadFun() {
				this.getUserInfo();
				this.getMyMenus();
				this.orderNum();
				this.isShowAuth = false
			},
			Setting: function() {
				uni.openSetting({
					success: function(res) {
						console.log(res.authSetting)
					}
				});
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			// 绑定手机
			bindPhone() {
				uni.navigateTo({
					url: '/pages/users/user_phone/index'
				})
			},
			/**
			 * 获取个人用户信息
			 */
			getUserInfo: function() {
				let that = this;
				getUserInfo().then(res => {
					that.userInfo = res.data,
					that.is_promoter = res.data.is_promoter
					that.extension_status = res.data.extension_status
					that.getMyMenus();
				});
			},
			// 订单数字
			orderNum() {
				orderData().then(({
					data
				}) => {
					this.orderMenu.forEach((item, index) => {
						console.log('item')
						switch (item.title) {
							case '待付款':
								item.num = data.noPay
								break
							case '待发货':
								item.num = data.noPostage
								break
							case '待收货':
								item.num = data.noDeliver
								break
							case '待评价':
								item.num = data.noComment
								break
							case '售后/退款':
								item.num = data.refund
								break
						}
					})
				})
			},

			/**
			 * 
			 * 获取个人中心图标
			 */
			getMyMenus: function() {
				let that = this;
				if (this.MyMenus.length) return;
				getMenuList().then(res => {
					that.merchantMenu = []
					that.personalMenu = []
					res.data.menu.forEach((item,index)=>{
						that.filterMenus(item)
						if(item.type == 1){
							that.merchantMenu.push(item)
						}else{
							that.personalMenu.push(item)
						}
					})		
					that.imgUrls = res.data.banner
				});
			},
			
			// 编辑页面
			goEdit() {
				uni.navigateTo({
					url: '/pages/users/user_info/index'
				})
			},
			// 签到
			goSignIn() {
				uni.navigateTo({
					url: '/pages/users/user_sgin/index'
				})
			},
			// goMenuPage
			goMenuPage(url) {
				if (this.isLogin) {
					uni.navigateTo({
						url
					})
				} else {
					// #ifdef MP
					this.openAuto()
					// #endif
				}
			},
			// #ifdef APP-PLUS
			APPtoLogin(){
				toLogin()
			}
			// #endif
		}
	}
</script>

<style lang="scss">
	.new-users {
		.head {
			background: #fff;

			.user-card {
				position: relative;
				width: 100%;
				padding: 35rpx 0 70rpx;
				background: linear-gradient(90deg, #EB3C3C 0%, #FF5D43 100%);

				.bg {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					background-image: url('~@/static/images/user_bg.png');
					background-size: 100% 100%;
				}

				.user-info {
					z-index: 20;
					position: relative;
					display: flex;
					padding: 0 28rpx;
					.level_icon{
						width: 34rpx;
						height: 32rpx;
						margin: 4rpx 0 0 6rpx;
						border: none;
					}
					.avatar {
						width: 120rpx;
						height: 120rpx;
						border-radius: 50%;
					}

					.info {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						margin-left: 20rpx;
						padding: 15rpx 0;

						.name {
							display: flex;
							align-items: center;
							color: #fff;
							font-size: 31rpx;

							.vip {
								display: flex;
								align-items: center;
								height: 36rpx;
								padding: 0 20rpx;
								background: rgba(0, 0, 0, 0.2);
								border-radius: 18px;
								font-size: 20rpx;
								margin-left: 12rpx;

								image {
									width: 27rpx;
									height: 27rpx;
								}
							}
						}

						.num {
							display: flex;
							align-items: center;
							font-size: 26rpx;
							color: rgba(255, 255, 255, 0.6);

							image {
								width: 22rpx;
								height: 23rpx;
								margin-left: 20rpx;
							}
						}
					}
				}

				.num-wrapper {
					z-index: 30;
					position: relative;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin: 30rpx 20rpx 0;
					color: #fff;

					.num-item {
						width: 25%;
						text-align: center;

						.num {
							font-size: 42rpx;
							font-weight: bold;
						}

						.txt {
							margin-top: 8rpx;
							font-size: 22rpx;
							color: rgba(255, 255, 255, 0.6);
						}
					}
				}

				.sign {
					z-index: 200;
					position: absolute;
					right: -12rpx;
					top: 80rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 120rpx;
					height: 60rpx;
					background: linear-gradient(90deg, rgba(255, 225, 87, 1) 0%, rgba(238, 193, 15, 1) 100%);
					border-radius: 29rpx 4rpx 4rpx 29rpx;
					color: #282828;
					font-size: 28rpx;
					font-weight: bold;
				}
			}
		}

		.wrapper {
			position: relative;
			top: -44rpx;
			padding: 0 20rpx;
		}

		.order-wrapper {
			background-color: #fff;
			border-radius: 12rpx;

			.order-hd {
				height: 80rpx;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px dashed #DDDDDD;
				padding: 0 30rpx;
				font-size: 30rpx;
				color: #282828;

				.right {
					align-items: center;
					color: #666666;
					font-size: 26rpx;

					.icon-xiangyou {
						margin-left: 5rpx;
						margin-top: 6rpx;
						font-size: 26rpx;
					}
				}
			}

			.order-bd {
				display: flex;

				// padding: 0 24rpx;
				.order-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 20%;
					height: 160rpx;

					.pic {
						position: relative;
						text-align: center;

						image {
							width: 56rpx;
							height: 56rpx;
						}
					}

					.txt {
						margin-top: 15rpx;
						font-size: 26rpx;
						color: #454545;
					}
				}
			}
		}
		.slider-wrapper {
			margin: 20rpx 0;
			height: 130rpx;
			swiper,
			swiper-item {
				height: 100%;
			}
			image {
				width: 100%;
				height: 130rpx;
			}
		}
		.user-menus {
			padding-bottom: 30rpx;
			background-color: #fff;
			border-radius: 16rpx;
			.title {
				height: 80rpx;
				line-height: 80rpx;
				padding: 0 30rpx;
				border-bottom: 1px dashed #DDDDDD;
				font-weight: bold;
			}
			.item {
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				width: 25%;
				line-height: 28rpx;
				height: 90rpx;
				margin-top: 30rpx;
				text-align: center;

				.item-count {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 100%;
				}

				image {
					width: 52rpx;
					height: 52rpx;
				}
				.skeleton_image{
					width: 80rpx;
					height: 80rpx;
				}
				text {
					margin-top: 10rpx;
					font-size: 26rpx;
					color: #282828;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
					width: 78%;
				}

				&:last-child::before {
					display: none;
				}
			}

			button {
				font-size: 28rpx;
			}
		}

		.phone {
			color: #fff;
		}

		.order-status-num {
			min-width: 12rpx;
			background-color: #fff;
			color: #ee5a52;
			border-radius: 15px;
			position: absolute;
			right: -14rpx;
			top: -15rpx;
			font-size: 20rpx;
			padding: 0 8rpx;
			border: 1px solid #ee5a52;
		}
	}

	.copy-right {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #CCCCCC;
		font-size: 22rpx;

		.iconfont {
			font-size: 60rpx;
		}
	}

	.menu-box {
		display: flex;
		flex-wrap: wrap;
	}

	.right-btn {
		z-index: 99;
		position: absolute;
		right: 30rpx;
		top: 40rpx;
		display: flex;
		align-items: center;
		color: #fff;

		.iconfont {
			font-size: 40rpx;
			margin-left: 33rpx;
		}

		.btn {
			position: relative;
		}

		.iconnum {
			min-width: 6px;
			background-color: #fff;
			color: $theme-color;
			border-radius: 15rpx;
			position: absolute;
			right: -10rpx;
			top: -10rpx;
			font-size: 10px;
			padding: 0 4px;
		}
	}
</style>
