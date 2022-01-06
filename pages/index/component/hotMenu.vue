<template>
	<view class="hot-img" style="margin-top:20rpx">
		<navigator :url="item.url" class="item" v-for="(item, index) in hot" :key="index" hover-class="none">
			<view class="title area-row">{{ item.title }}</view>
			<view class="msg area-row" :style="'color:' + item.color + ';'">{{ item.s_title }}</view>
			<view class="img">
				<!-- <image :src="item.pic" mode=""></image> -->
				<easy-loadimage mode="widthFix" :image-src="item.pic"></easy-loadimage>
			</view>
		</navigator>
	</view>
</template>

<script>
	export default {
		props:{
			hot:{
				type: Array,
				default:() => {
					return []
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.hot-img {
		display: flex;
		align-items: center;
		justify-content: space-between;
	
		.item {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 170rpx;
			background-color: #fefeff;
			padding: 20rpx 0 4rpx;
			border-radius: 8rpx;
			box-shadow: 2px 1px 6px 1px rgba(0, 0, 0, 0.03);
	
			.title {
				font-weight: bold;
				color: #282828;
			}
	
			.msg {
				margin-top: 5rpx;
				font-size: 20rpx;
			}
	
			.img {
				margin-top: 10rpx;
			}
	
			/deep/image,/deep/.easy-loadimage,uni-image {
				width: 130rpx;
				height: 130rpx;
			}
			
			&:first-child .msg {
				color: #8fbbe8;
			}
	
			&:nth-child(2) .msg {
				color: #d797b7;
			}
	
			&:nth-child(3) .msg {
				color: #c49bd1;
			}
	
			&:nth-child(4) .msg {
				color: #a3bf95;
			}
		}
	}
</style>
