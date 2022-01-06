<template>
	<div class="CustomerList">
		<view class="popupn" v-if="type == 1">
			<view class="title line1" @click="changeStoreList">
				<image class="mer_logo" :src="storeInfo.mer_avatar" mode=""></image>
					{{storeInfo.mer_name}}					
				<text v-if="!downStatus" class="iconfont icon-xiala1 spin"></text>
				<text v-else class="iconfont icon-xiala1"></text>
			</view>			
		</view>				
		
		<view :class="{'list_count': type == 1}">
			<block v-if="type == 0 && list.length>0" v-for="(item,index) in list" :key="index">
				<div class="item acea-row" @click="goPage(item)">
					<view class="logo">
						<image :src="item.merchant.mer_avatar" mode=""></image>
					</view>
					<view class="info">
						<view class="name">{{item.merchant.mer_name}}</view>
						<view class="con line1" v-if="item.last.msn_type == 1">{{item.last.msn}}</view>
						<view class="con line1" v-if="item.last.msn_type == 2">[表情]</view>
						<view class="con line1" v-if="item.last.msn_type == 3">[图片]</view>
						<view class="con line1" v-if="item.last.msn_type == 4">[商品]</view>
						<view class="con line1" v-if="item.last.msn_type == 5 || item.last.msn_type == 6">[订单]</view>
					</view>
					<view class="right-box">
						<view class="time">{{item.last && item.last.create_time}}</view>
						<view class="num" v-if="item.num>0">{{item.num}}</view>
					</view>
				</div>
			</block>
			<block v-if="type == 1 && list.length>0" v-for="(item,index) in list" :key="index">
				<div class="item acea-row" @click="goPage(item)">
					<view class="logo">
						<image :src="item.user.avatar ? item.user.avatar : '/static/images/f.png'" mode=""></image>
					</view>
					<view class="info">
						<view class="name">{{item.user.nickname}}</view>
						<view class="con line1" v-if="item.last.msn_type == 1">{{item.last.msn}}</view>
						<view class="con line1" v-if="item.last.msn_type == 2">[表情]</view>
						<view class="con line1" v-if="item.last.msn_type == 3">[图片]</view>
						<view class="con line1" v-if="item.last.msn_type == 4 || item.last.msn_type == 7">[商品]</view>
						<view class="con line1" v-if="item.last.msn_type == 5 || item.last.msn_type == 6">[订单]</view>
					</view>
					<view class="right-box">
						<view class="time">{{item.last && item.last.create_time}}</view>
						<view class="num" v-if="item.num>0">{{item.num}}</view>
					</view>
				</div>
			</block>
			<block v-if="list.length == 0">
				<emptyPage title="暂无数据~"></emptyPage>
			</block>
		</view>
		<shopList ref="shopList" @changeStoreClose="changeStoreClose" @getStoreInfo="getStoreInfo" :id='mer_id'></shopList>
	</div>
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
	import emptyPage from '@/components/emptyPage.vue'
	import {
		serviceList,
		serviceUserList
	} from "@/api/user";
	import shopList from '@/components/shopList';
	export default {
		name: "CustomerList",
		components:{
			emptyPage, shopList
		},
		data() {
			return {
				list: [],
				productId: 0,
				orderId: "",
				type: 0 ,// 0 用户 1客服
				timer: null,
				page:1,
				limit:9999,
				storeInfo: {
					mer_name: '小米官方旗舰店',
					image: 'https://thirdwx.qlogo.cn/mmopen/vi_32/vD4bYlSpNrEJl85ia8gsgaSUUYa0vyxL7icEsl9DeWUiafcsG87icBNNpdSmibMeDjPYXxpal1jdlSvksnXEr80quQQ/132'
				},				
				mer_id: '',
				downStatus: false
			};
		},
		onLoad(optios) {
			this.type = optios.type;
			if(this.type == 1){
				this.getStoreList();
			}else{
				this.getList('')
			}
		},
		onShow(option) {
			this.$nextTick(() => {
				this.liveUpdate();
			});	
		},
		onHide(){  
		    if(this.timer) {  
		        clearInterval(this.timer);  
		        this.timer = null;  
		    }  
			
		},
		onUnload() {
			if(this.timer) {
			    clearInterval(this.timer);  
			    this.timer = null;  
			} 
		},
		methods: {
			getList(mer_id) {				
				if(this.type == 0){
					serviceList({
						page:this.page,
						limit:this.limit
					}).then(res => {
						this.list = res.data.list;
					});
				}else{
					serviceUserList(mer_id,{
						page:this.page,
						limit:this.limit
					}).then(res =>{
						this.list = res.data.list;
					})
				}				
			},
			getStoreList: function(){
				this.$nextTick(() => {
					this.$refs.shopList.getStoreList('')
				});				
			},
			// 关闭店铺弹窗
			changeStoreClose: function(){
				this.downStatus = false;
			},
			changeStoreList: function(data) {	
				this.downStatus = !this.downStatus;
				this.$refs.shopList.isShowStore()
			},
			//实时刷新列表
			liveUpdate(){
				let that = this;
				if(that.timer) {
					clearInterval(that.timer);
					that.timer = null;	
				}  
				that.timer = setInterval(function(){
					// 用户
					that.getList(that.storeInfo.mer_id);
				},5000);
				
			},
			getStoreInfo: function(data) {
				this.storeInfo = data
				this.getList(data.mer_id)
			},
			goPage(item) {
				if(this.type == 0){
					uni.navigateTo({
						url: `/pages/chat/customer_list/chat?mer_id=${item.mer_id}`
					})
				}else{
					uni.navigateTo({
						url: `/pages/chat/customer_list/chat?userId=${item.user.uid}&mer_id=${item.mer_id}`
					})
				}
			}
		},
		changeTitle(e) {
			console.log(e)
			this.mer_id = e.detail.value.toString();
		},
	};
</script>
<style lang="scss">
	.CustomerList {
		.spin {
			display: block;
			transform: rotate(180deg);
			font-size: 36rpx;
		}
		.popupn{
			position: fixed;
			width: 100%;
			text-align: center;
			top: 0;
			left: 0;
			background: #ffffff;
			height: 90rpx;
			line-height: 90rpx;
			z-index: 100;
			.title{
				max-width: 560rpx;
				margin: 0 auto;
				position: relative;
			}
			.iconfont{
				display: inline-block;
				position: relative;
				top: 4rpx;
				right: 0;
			}
			.mer_logo{
				width: 34rpx;
				height: 34rpx;
				position: relative;
				top: 6rpx;
				right: 10px;			
			}
			.mer_name{
				display: inline-block;
				max-width: 650rpx;
			}
			.invoice-content{
				background-color: #ffffff;
			}
		}
		.list_count{
			margin-top: 104rpx;
		}
		.item {
			align-items: center;
			border-bottom: 1px solid #eee;
			padding: 20rpx 30rpx;
			background-color: #fff;
			.logo image{
				width: 88rpx;
				height: 88rpx;
				border-radius: 50%;
			}
			.info{
				width: 334rpx;
				margin-left: 20rpx;
				.con{
					margin-top: 10rpx;
					color: #999999;
					font-size: 24rpx;
				}
			}
			.right-box{
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				font-size: 20rpx;
				color: #BBBBBB;
				.time{
					margin-bottom: 10rpx;
				}
				.num{
					min-width: 6px;
					background-color: $theme-color;
					border-radius: 15px;
					font-size: 10px;
					padding: 0 4px;
					font-size: 20rpx;
					color: #fff;
				}
			}
		}
	}
</style>
