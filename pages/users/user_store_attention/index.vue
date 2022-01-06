<template>
	<view class="user_store_attention">
		<view class="item" v-for="(item,index) in storeList" :key="index">
			<view class="store_header" @click="goStore(item)">
				<image :src="item.merchant.mer_avatar" mode=""></image>
				<view class="info">
					<view class="line1">
						<text class="name line1">{{item.merchant.mer_name}}</text>
						<text v-if="item.merchant.type_name" class="font-bg-red ml8">{{item.merchant.type_name}}</text>
						<text v-else-if="item.merchant.is_trader" class="font-bg-red ml8">自营</text>
					</view>
					<view class="btn" @click.stop="bindDetele(item,index)">取消关注</view>
				</view>
			</view>
			<view class="store_recommend" v-if="item.merchant && item.merchant.showProduct.length>0">
				<block v-for="(itemn,indexn) in item.merchant.showProduct" :key="indexn" v-if="indexn < 3">
					<navigator :url="'/pages/goods_details/index?id='+itemn.product_id"
				 hover-class="none" class="list">
						<view class="picture">
							<easy-loadimage mode="widthFix" :image-src="itemn.image"></easy-loadimage>
						</view>
						<view class="price line1">¥ {{itemn.price}}</view>
					</navigator>
					
				</block>
			</view>
		</view>
		<view class="empty-txt" v-if="storeList.length == 0">暂无数据</view>
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
	let app = getApp();
	import { getMerchantLst,collectDel } from '@/api/store.js'
	import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';
	export default{
		components: {
			easyLoadimage
		},
		data(){
			return {
				storeList:[],
				isScroll:true,
				page:1,
				limit:20,
				hide_mer_status: app.globalData.hide_mer_status
			}
		},
		onLoad() {
			this.getList()
		},
		onReady(){
			uni.$on('update',(data)=>{
				this.hide_mer_status = data.hide_mer_status
			})
		},
		mounted: function() {
			const app = getApp();
			this.$nextTick(() => {
				this.hide_mer_status = app.globalData.hide_mer_status
			});
		},
		methods:{
			goStore(item){
				if(this.hide_mer_status != 1){
					uni.navigateTo({
						url:`/pages/store/home/index?id=${item.merchant.mer_id}`
					})
				}				
			},
			getList(){
				if(!this.isScroll) return
				getMerchantLst({
					page:this.page,
					limit:this.limit
				}).then(res=>{
					this.isScroll = res.data.list.length>=this.limit
					this.storeList = this.storeList.concat(res.data.list)
					this.page+=1
				})
			},
			// 删除收藏
			bindDetele(item,index){
				collectDel({
					type:10,
					type_id:item.type_id
				}).then(res=>{
					uni.showToast({
						title:'已取消',
						icon:'none'
					})
					this.storeList.splice(index,1)
				})
			}
		},
		onReachBottom() {
			this.getList()
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		}
	}
</script>

<style lang="scss">
.user_store_attention{
	padding: 20rpx;
	.item{
		background-color: #ffffff;
		background-size: 100%;
		background-repeat: no-repeat;
		border-radius: 16rpx;
		padding: 0 20rpx;
		margin-bottom: 20rpx;
		background-image: url('data:image/png;base64,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');
	}
	.store_header{
		position: relative;
		display: flex;
		padding: 30rpx 10rpx;		
		align-items: center;	
		image{
			width: 88rpx;
			height: 88rpx;
			border-radius: 50%;
		}
		.info{
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 20rpx;
			position: relative;
			.name{
				width: 410rpx;
				font-weight: bold;
			}
			.des{
				color: #666666;
				font-size: 22rpx;
			}
			.btn{
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				right: 0;
				top: 50%;
				width:150rpx;
				height:50rpx;
				transform: translateY(-50%);
				border:1px solid #BBBBBB;
				border-radius:25rpx;
				font-size: 26rpx;
			}
		}
	}
	.store_recommend{
		display: flex;
		padding-bottom: 30rpx;
		.list{
			width: 210rpx;
			.picture,/deep/image,/deep/.easy-loadimage,uni-image{
				width: 210rpx;
				height: 210rpx;
				border-radius: 10rpx;
			}
			margin-right: 20rpx;
			&:last-child{
				margin-right: 0;
			}
			.price{
				text-align: center;
				color: #E93323;
				font-size: 24rpx;
				margin-top: 10rpx;
				font-weight: bold;
			}
		}
	}
}

</style>
