<template>
	<view class="explosion">
		<view class="common-hd"><view class="title">品牌好店</view></view>
		<view class="mer-box">
			<view class="mer-item" v-for="(item, index) in brandList" :key="index">
				<view class="mer-hd" @click="goStore(item.mer_id)">
					<image :src="item.mer_banner"></image>

					<view class="mer-name">
						<image :src="item.mer_avatar"></image>
						<view class="txt line1">{{ item.mer_name }}</view>
						<text v-if="item.type_name" class="store_type">{{ item.type_name }}</text>
						<text v-else-if="item.is_trader" class="store_type">自营</text>
					</view>
				</view>
				<view class="pro-box">
					<navigator
						:url="`/pages/goods_details/index?id=${itemn.product_id}`"
						hover-class="none"
						class="pro-item"
						v-for="(itemn, indexn) in item.recommend"
						:key="indexn"
						v-if="item.recommend.length <= 3"
					>
						<easy-loadimage mode="widthFix" :image-src="itemn.image"></easy-loadimage>
						<view class="price">
							<text>￥</text>
							{{ itemn.price }}
						</view>
					</navigator>
				</view>
			</view>
			<view class="more-shop" @click="moreShop">
				<text>更多店铺</text>
				<text class="iconfont icon-xiangyou"></text>
			</view>
		</view>
	</view>
</template>

<script>
import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';

export default {
	components: {
		easyLoadimage
	},
	props: {
		// 店铺列表
		brandList: {
			type: Array,
			default: () => {
				return [];
			}
		},
		// 产品 code 不为1时可进行操作
		hide_mer_status: {
			// type: Number || String,
			// default: ''
		}
	},
	methods: {
		// 进店看看
		goStore(id) {
			if (this.hide_mer_status != 1) {
				uni.navigateTo({
					url: `/pages/store/home/index?id=${id}`
				});
			}
		},
		// 更多店铺
		moreShop() {
			uni.navigateTo({
				url: `/pages/store/shopStreet/index`
			});
		}
	}
};
</script>

<style scoped lang="scss">
.explosion {
	.common-hd {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 118rpx;

		.title {
			padding: 0 80rpx;
			font-size: 34rpx;
			color: $theme-color;
			font-weight: bold;
			background-image: url('~@/static/images/index-title.png');
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: left center;
		}
	}
	.mer-box {
		.mer-item {
			margin-bottom: 20rpx;
			background-color: #fff;
			border-radius: 16rpx;
			text-align: center;
			.mer-hd {
				position: relative;
				width: 100%;
				height: 200rpx;
				border-radius: 16rpx 16rpx 0 0;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}

				.mer-name {
					position: absolute;
					left: 20rpx;
					top: 20rpx;
					display: flex;
					max-width: 60%;
					padding: 8rpx 20rpx;
					border-radius: 26rpx;
					background: #fff;
					font-weight: bold;
					font-size: 12px;
					image {
						width: 38rpx;
						height: 38rpx;
						margin-right: 10rpx;
						border-radius: 50%;
					}

					.txt {
						flex: 1;
						line-height: 19px;
						height: 19px;
					}
					.store_type {
					    font-size: 10px;
					    color: #fff;
					    background-color: #e93323;
					    padding: 0 5px;
					    line-height: 19px;
					    height: 19px;
						margin-left: 20px;
						border-radius: 30rpx;
					}
				}
			}
			/deep/.easy-loadimage,/deep/uni-image,image{
				width: 100%;
				height: 214rpx;
			}
			.pro-box {
				display: flex;
				align-items: center;
				padding: 20rpx 20rpx 30rpx;

				.pro-item {
					width: 218rpx;
					margin-right: 14rpx;

					/deep/image {
						width: 100%;
						height: 214rpx;
					}

					.price {
						margin-top: 5rpx;
						font-size: 28rpx;
						color: $theme-color;
						font-weight: bold;

						text {
							font-size: 28rpx;
						}
					}

					&:last-child {
						margin-right: 0;
					}
				}
			}
		}

		.more-shop {
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #ffffff;
			padding: 27rpx 0;
			color: #999999;
			font-size: 26rpx;

			.icon-xiangyou {
				font-size: 22rpx;
			}
		}
	}
}
</style>
