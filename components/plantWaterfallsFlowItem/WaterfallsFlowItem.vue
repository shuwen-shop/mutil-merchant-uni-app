<template>  
	<view @click="goDetail(item)" class="wf-page2">
		<view v-if="item" class='pictrue skeleton-rect'>
			<!-- <image :src='item.image[0]' mode="widthFix"></image> -->
			<easy-loadimage mode="widthFix" :image-src="item.image[0]"></easy-loadimage>
			<view v-if="isAuth && tab == 0 && item.status != 1" class="approval_status">
				<view v-if="item.status == -1" class="approval_title">审核未通过</view>
				<view v-else-if="item.status == -2" class="approval_title">已下架</view>
				<view v-else-if="item.status == 0" class="approval_title">正在审核</view>
				<text v-if="item.status == -1 || item.status == -2" class="approval_info">查看未通过原因</text>
				<text v-if="item.status == 0" class="approval_info">通过后将展示在列表</text>
			</view>
		</view>
		<view v-if="item" class='text'>
			<view class='name skeleton-rect'>
				<text class="text_name line2">
					{{item.title}}
				</text>				
			</view>
			<view class="count acea-row skeleton-rect">
				<view v-if="!isAuth" class="author acea-row">
					<image class="image" :src="(item.author && item.author.avatar) || '/static/images/f.png'" mode="widthFix"></image>
					<text class="author_name line1">{{item.author && item.author.nickname}}</text>
				</view>
				<view v-else class="author acea-row">
					<text class="author_time">
					{{item.time}}
					</text>
				</view>
				<view class="like">
					<button  class="like_count" hover-class="none" @click.stop="likeToggle(item)">
						<text class="iconfont" :class="item.relevance_id ? 'icon-shoucang1' : 'icon-dianzan'"></text>
						<text class="collect">{{item.count_start}}</text>
					</button>
				</view>
			</view>
			
		</view>
		
	</view>
</template>
<script>
import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue'
export default {
	components:{easyLoadimage},
    props: {
        item: {
            type: Object,
            require: true
        },
		type: {
			type: Number,
			default: 0
		},
		isAuth: {
			type: Boolean,
			default: false
		},
		tab: {
			type: Number,
			default: 1
		},
		isFind: {
			type: Boolean,
			default: false
		},
    },
	data() {
		return {
			isShowAuth: false,
			isAuto: false
		};
	},
	
	methods: {	
		likeToggle(item){
			this.$emit('likeToggle',item)
		},
		goDetail(item){
			if(this.isFind){
				uni.navigateTo({
					url: '/pages/plantGrass/plant_featured/index?id='+item.topic_id
				});	
			}else{
				uni.navigateTo({
					url: '/pages/plantGrass/plant_detail/index?id='+item.community_id
				});
			}
		}
	}
		
}

</script>
<style lang="scss" scoped>
.wf-page2 .pictrue{
	height: 345rpx;
	border-radius: 16rpx;
	position: relative;
	/deep/image,/deep/.easy-loadimage,uni-image{
	  width: 100%;
	  max-width: 345rpx;
	  height: 345rpx;
	  border-radius: 16rpx 16rpx 0 0;
	 }
}
/deep/.wf-page2 .pictrue image,/deep/.wf-page2 .pictrue uni-image {
	width: 100%;
	max-width: 345rpx;
	height: 345rpx;
	border-radius: 16rpx 16rpx 0 0;
}
/deep/.easy-loadimage{
	width: 100%;
	max-width: 345rpx;
	height: 345rpx;
	max-height: 360rpx;
	border-radius: 16rpx 16rpx 0 0;
}
 .loadfail-img{
	width: 100%;
    height: 345rpx;
}
.wf-page2 .text{
	padding: 20rpx;
	width: 345rpx;
	.name{
		color: #333333;
		font-size: 28rpx;
		font-weight: bold;
	}
	.count{
		margin-top: 20rpx;
		justify-content: space-between;
		.author{
			align-items: center;
		}
		.author_name{
			margin-left: 10rpx;
			max-width: 120rpx;
			font-size: 24rpx;
			color: #333333;
			max-width: 200rpx;
		}
		.author_time{
			color: #666666;
		}
		.like{
			
			font-size: 24rpx;
			color: #999999;
			display: flex;
			.like_count{
				display: flex;
				align-items: center;
			}
			.iconfont{
				font-size: 30rpx;
			}
			.icon-shoucang1{
				color: #E93323;
			}
			.collect{
				font-size: 24rpx;
				margin-left: 5rpx;
			}
		}
	}
}
.wf-page2 .author .image,.wf-page2 .author uni-image{
	width: 46rpx;
	height: 46rpx;
	border-radius: 100%;
}
.approval_status{
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,.4);
	position: absolute;
	top: 0;
	left: 0;
	border-radius: 16rpx;
	color: #fff;
	text-align: center;
	z-index: 5;
	.approval_title{
		font-size: 28rpx;
		margin-top: 135rpx;
		font-weight: bold;
	}
	.approval_info{
		font-size: 24rpx;
		margin-top: 24rpx;
	}
}
</style>
