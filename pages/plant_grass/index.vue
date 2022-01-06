<template>
	<view>
		<view class="page_con">
			<view class="grass_header">
				<view v-if="!navShow" class="header">
					<view class="navTab">
						<navigator v-if="community_status == 1" url="/pages/plantGrass/plant_release/index" class="release_btn acea-row row-center-wrapper" hover-class="none">
							<text class="iconfont icon-fabu"></text></navigator>
						<view class="acea-row row-center-wrapper">
							<view :class="tabActive == 0 ? 'on' : ''" class="nav-item" @click="tabActive=0;top=200;">关注</view>
							<view :class="tabActive == 1 ? 'on' : ''" class="nav-item" @click="tabActive=1;top=300;">发现</view>	
						</view>
						<navigator v-if="isLogin && community_status == 1" :url="'/pages/plantGrass/plant_user/index?id='+userInfo.uid">
							<image class="avatar" :src="userInfo.avatar ? userInfo.avatar : '/static/images/f.png'"></image>
						</navigator>					
					</view>
					<view class="search_count">
						<navigator url="/pages/plantGrass/plant_search/index" hover-class="none" class="search"><text class="iconfont icon-xiazai5"></text>搜索想看的文章</navigator>
						<navigator class="search_topic" url="/pages/plantGrass/plant_topic/index">
							<image class="topic_icon" src="/static/images/topic_cate.png"></image>
						</navigator>
					</view>
				</view>
				<view class="longTab" v-show="tabActive === 1">
					<scroll-view scroll-x="true" style="white-space: nowrap; display: flex;" scroll-with-animation class="menu" :scroll-left="tabLeft" show-scrollbar="true">
						<view class="longItem" 
						:style="'width:' + isWidth + 'px'" 
						:data-index="index" 
						:class="index === tabClick ? 'click' : ''" 
						v-for="(item, index) in menuList" 
						:key="index" 
						:id="'id' + index" 
						@click.stop="selectMenu(item, index, true)">{{ item.cate_name }}</view>
						<view v-if="menuList.length" class="underlineBox" :style="'transform:translateX(' + isLeft + 'px);width:' + isWidth + 'px'">
							<view class="underline bg-color-white"></view>
						</view>
					</scroll-view>
				</view>
				
			</view>	
			<scroll-view class="main" scroll-y="true" @scroll="followScroll">				
				<view class="tab-cont" id="main">
					<!-- 关注 -->
					<view v-if="tabActive === 0">
						<view v-if="isLogin && followList.length > 0" class="follow_count">
							<block v-for="(item, index) in followList" :key="index">
								<view class="list_count">
									<view class="title">
										<navigator hover-class="none" :url="'/pages/plantGrass/plant_user/index?id='+item.uid" v-if="item.author" class="author">
											<easy-loadimage class="picture" mode="widthFix" :image-src="item.author.avatar || '/static/images/f.png'"></easy-loadimage>
											<text class="name">{{item.author.nickname || ''}}</text>
										</navigator>
										<view class="time">{{item.time}}</view>
									</view>
									<view class="product">
										<productConSwiper :imgUrls="item.image"></productConSwiper>
									</view>
									<view class="pro_describle">
										<view class="mentioned" v-if="item.relevance && item.relevance.length > 0" @click="openMore(item)">
											<text class="title">查看TA提到的宝贝({{item.relevance.length}})</text>
											<view class="product_more">
												<view class="item">
													<easy-loadimage v-if="indexn<4" v-for="(itemn, indexn) in item.relevance" :key="indexn" mode="widthFix" :image-src="(itemn.spu && itemn.spu.image) || itemn.image" class="more_image"></easy-loadimage>
												</view>
												<text class="iconfont icon-gengduo3"></text>
											</view>
										</view>
										<view v-if="!item.show && item.content.length > 110" class="product_info">
											<text class="text">
												{{item.content.substring(0,90)+'...'}}
											</text>
											<text @click.stop="showMore(item)" class="unfold_btn">展开</text>
										</view>
										<view v-else class="product_info">
											<text class="text">
												{{item.content}}
											</text>
										</view>
										<navigator v-if="item.topic" hover-class="none" class="product_cate" :url="'/pages/plantGrass/plant_search_list/index?id='+item.topic.topic_id">
											<view>
												<text class="icon">#</text><text class="text">{{item.topic.topic_name}}</text>
											</view>
										</navigator>
										<view class="foot_bar">
											<!-- #ifdef MP -->
											<button class="time iconfont icon-fenxiang2" open-type="share" hover-class='none' @click="shareFriend(item)"></button>
											<!-- #endif -->
											<!-- #ifndef MP -->
											<button></button>
											<!-- #endif -->
											<view class="item">
												<view class="item_count" @click.stop="likeToggle(item)">
													<text class="iconfont" :class="item.relevance_id ? 'icon-shoucang1' : 'icon-dianzan'"></text>
													<text>{{item.count_start > 0 ? item.count_start : '点赞'}}</text>
												</view>
												<view class="item_count" @click="openCommon(item,index)">
													<text class="iconfont icon-pinglun"></text>
													<text>{{item.count_reply > 0 ? item.count_reply : '评论'}}</text>
												</view>
											</view>
										</view>
									</view>
								</view>
							</block>						
						</view>
						<view v-if="followList.length == 0 && !focusLoading && isLogin" class="empty">
							<image src="/static/images/no_thing.png"></image>
							<text>暂无内容~</text>
						</view>
						<view v-if="!isLogin" class="empty no_login">
							<image src="/static/images/no_login.png"></image>						
							<view class="title">暂未登录</view>
							<text>登录后可查看关注用户的发布哦~</text>
							<button class="login_btn" @click="authOpen">立即登录</button>
						</view>
					</view>
					<!-- 发现 -->
					<view v-show="tabActive === 1">	
						<!-- 商品 -->
						<swiper :interval="interval" indicator-color="rgba(255,255,255,0.6)" :current="swiperCurrent" @change="swiperChange" :style="'height:'+swiperHeight+'px'" >
							<block v-for="(item,index) in menuList" :key="index">
								<swiper-item :item-id="`${item.category_id}`">
									<scroll-view @scroll="scrollLeft" scroll-y="true" :style="'height:'+swiperHeight+'px'">
										<view v-if="cateGoods[item.category_id] &&  cateGoods[item.category_id].goods.length" class="goods-wrap" id="goods">
											<view class="goods">
												<WaterfallsFlow :wfList='cateGoods[item.category_id].goods' :isFind="true" @likeToggle="likeToggle"/>
											</view>
										</view>
										<view :hidden="cateGoods[item.category_id] && !cateGoods[item.category_id].goodsLoading" class="acea-row row-center-wrapper loadingicon">
											<text class="iconfont icon-jiazai loading"></text>{{!cateGoods[item.category_id] ? 0 : cateGoods[item.category_id].goodsLoading}}
										</view>
										<view v-if="cateGoods[item.category_id] && cateGoods[item.category_id].goods.length == 0 && !cateGoods[item.category_id].goodsLoading" class="empty">
											<image src="/static/images/no_thing.png"></image>
											<text>暂无文章~</text>
										</view>
									</scroll-view>
								</swiper-item>
							</block>
						</swiper>
					</view>
				</view>
			</scroll-view>
		</view>		
		<!-- 他提到的宝贝弹窗 -->
		<mentioned ref="mentioned" @close="closePopup" :list="moreList" :uid="authorUid"></mentioned>
		<!-- 评论弹窗 -->
		<comment ref="comment" :isShow="showComment" @successFul="commentSucces" @close="close"></comment>		
		<!-- #ifdef MP -->
		<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize>
		<!-- #endif -->
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
	import WaterfallsFlow from '@/components/plantWaterfallsFlow/WaterfallsFlow.vue'
	import mentioned from '@/components/mentioned.vue';
	import comment from '@/components/comment.vue';
	import { graphicLstApi, getTopicList, graphicStartApi, focusArticleLst } from '@/api/community.js';
	import { getconfig } from '@/api/public.js';
	import { getUserInfo } from '@/api/user.js';
	import { mapGetters } from "vuex";
	import { toLogin } from '@/libs/login.js';
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	import productConSwiper from '@/components/plantConSwiper';
	import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';
	const app = getApp();
	export default {
		components: {
			// #ifdef MP
			authorize,
			// #endif
			WaterfallsFlow,
			productConSwiper,
			mentioned,
			comment,
			easyLoadimage
		},
		data() {
			return {
				systemInfo: app.globalData.statusBarHeight,
				// #ifdef MP
				menuButtonInfo: uni.getMenuButtonBoundingClientRect(),
				// #endif
				tabClick: 0,
				tabLeft: 0,
				isLeft: 0, //导航栏下划线位置
				isWidth: 0, //每个导航栏占位
				windowHeight: 0,
				swiperHeight: 0,
				childIndex: 0,	
				showComment: false,
				userInfo: {},
				goods: [], // 商铺商品	
				followList: [], //关注列表
				menuList: [],
				moreList: [],
				commList: [], //评论列表
				goodsList: [
					
				],
				navShow: false,
				navActive: 0,
				tabActive: 1, // 底部切换
				keyword: '',
				sortPrice: true, // 价格排序
				focusLoading: false,
				goodsLoading: false,
				goodsLoaded: false,
				focusLoaded: false,
				loadTitle: '加载更多',
				isShowAuth: false, //是否隐藏授权
				isAuto: false, //没有授权的不会自动授权
				where: {
					category_id: 0,
					page: 1,
					limit: 30
				},
				focusWhere: {
					page: 1,
					limit: 30
				},
				storeScroll: true,
				storeTop: 0,
				storeHeight: 0,
				navHeight: 0,
				avatar: '',
				hederBg: '../static/images/plant_header.png',
				top: 300,
				shareInfo: {},
				actionSheetHidden: true,
				community_status: 0,
				authorUid: 0,
				swiperCur: 0,
				circular: true,
				isScroll: false,
				interval: 3000,
				currentItemId: 0,
				swiperCurrent: 0,
				cateGoods:{}
			}
		},
		// 滚动监听
		onPageScroll({scrollTop}) {
			uni.$emit('scroll');	
		},
		created() {
			var that = this;
			// 获取设备宽度
			uni.getSystemInfo({
				success(e) {
					that.isWidth = e.windowWidth / 6;
					that.windowHeight = e.windowHeight;
					that.swiperHeight = that.windowHeight - 205
					that.$set(that, 'swiperHeight', that.windowHeight - 55);
				}
			});
		},
		computed: {		
			...mapGetters(['isLogin', 'uid']),
		},
		watch: {
				
		},
		onLoad: function(options) {
			
		},
		onShow() {
			this.getCateList();
			this.getGoods();
			this.getConfig()
			let that = this;
			if (that.isLogin) {
				this.getUserInfo();
				this.getFocusArtical();
			} else {
				this.userInfo = {}
			}
		},
		mounted: function() {
			const query = uni.createSelectorQuery().in(this);
			query.select('#main').boundingClientRect(data => {
				this.storeHeight = data.height;
				this.storeTop = data.top;
			}).exec();
		},
		/**
		 * 用户点击右上角分享
		 */
		// #ifdef MP
		onShareAppMessage: function() {
			let that = this;
			that.$set(that, 'actionSheetHidden', !that.actionSheetHidden);
			return {
				title: that.shareInfo.title || '',
				imageUrl: that.shareInfo.image[0] || '',
				path: '/pages/plantGrass/plant_detail/index?id=' + that.shareInfo.community_id + '&spid=' + that.uid,
			}
		},
		onShareTimeline: function() {
			let that = this;
			that.$set(that, 'actionSheetHidden', !that.actionSheetHidden);
			return {
				title: that.shareInfo.title || '',
				query: {
					id: that.shareInfo.community_id,
					spid: that.uid
				},
				imageUrl: that.shareInfo.image[0] || ''
			}
		},
		// #endif
		methods: {	
			followScroll(){
				uni.$emit('scroll');
			},
			//分享信息
			shareFriend(item){
				this.shareInfo = item
			},
			// 授权回调
			onLoadFun() {
				this.isShowAuth = false
				this.getUserInfo();
				this.getFocusArtical();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			// 打开授权			
			authOpen: function() {
				let that = this;
				if (that.isLogin === false) {
					// #ifdef H5 || APP-PLUS
					toLogin();
					// #endif
					// #ifdef MP
					that.$set(that, 'isAuto', true);
					that.$set(that, 'isShowAuth', true);
					// #endif
				}
			},
			getConfig() {
				// 获取配置
				getconfig().then(res => {
					this.community_status = res.data.community_status;	
				}).catch(err => {});
			},			
			/**
			 * 获取个人用户信息
			 */
			getUserInfo: function() {
				let that = this;
				getUserInfo().then(res => {
					that.userInfo = res.data
				});
			},
			/*获取分类列表*/
			getCateList(){
				getTopicList().then(res => {
					this.menuList = res.data;
				})	
			},
			swiperChange(e) {
				let { current, source, currentItemId } = e.detail;
				if (source === 'autoplay' || source === 'touch') {
					this.currentItemId = currentItemId;
					this.swiperCur = current
					this.selectMenu(this.menuList[this.swiperCur],this.swiperCur,false)
					if (this.menuList.length > 6) {
						var tempIndex = this.swiperCur - 2;
						tempIndex = tempIndex <= 0 ? 0 : tempIndex;
						let tabLeft = (this.swiperCur - 2) * this.isWidth; //设置下划线位置
						this.$nextTick(function() {
							this.$set(this, 'tabLeft', tabLeft);
						});
					}
				}
			},
			// 点击列表头部
			selectMenu(item, index, isScroll) {
				this.currentItemId = item.category_id;
				this.swiperCurrent = index;
				this.swiperCur = index
				this.isScroll = isScroll;
				this.tabClick = index; //设置导航点击了哪一个
				this.isLeft = index * this.isWidth; //设置下划线位置
				this.setMenuLeft(index);
			},
			/*导航栏移动位置*/
			setMenuLeft(index) {
				// if (this.menuList.length > 6) {
				// 	var tempIndex = index - 2;
				// 	tempIndex = tempIndex <= 0 ? 0 : tempIndex;
				// 	let tabLeft = (index - 2) * this.isWidth; //设置下划线位置
				// 	// this.$nextTick(function() {
				// 	// 	this.$set(this, 'tabLeft', tabLeft);
				// 	// });
				// }
				// this.tabClick = index; //设置导航点击了哪一个
				// this.isLeft = index * this.isWidth; //设置下划线位置
				this.getGoods();
			},
			showMore(item){
				this.$set(item,'show', true);
			},
			scrollLeft: function(e){
				uni.$emit('scroll');
				this.navShow = e.detail.scrollTop >= this.storeHeight - 200;
				this.swiperHeight = this.windowHeight - 55
			},
			// 获取发现商品
			getGoods: function() {
				let that = this;
				if(!this.cateGoods[this.currentItemId]) {
					this.$set(this.cateGoods, this.currentItemId, {
						where: {...this.where, category_id: this.currentItemId},
						goods: []
					})
				}
				const data = this.cateGoods[this.currentItemId];
				const cateId = this.currentItemId;
				
				if (data.goodsLoading || data.goodsLoaded) return;
				data.goodsLoading = true;
				data.loadTitle = "";
				graphicLstApi(data.where).then(res => {
					data.goodsLoading = false;
					data.goodsLoaded = res.data.list.length < that.where.limit;
					if(data.where.page == 1 ){
						data.goods = [];
					}
					data.goods.push.apply(data.goods, res.data.list);
					
					data.where.page = data.where.page + 1;
					this.$set(this.cateGoods,cateId, {...data});
				}).catch(err => {
					data.goodsLoading = false;
					uni.showToast({
						title: err,
						icon: 'none'
					})
					this.$set(this.cateGoods,cateId, data);
				});
			},
			/*获取关注的人的文章列表*/
			getFocusArtical(){
				let that = this;
				if (that.focusLoading || that.focusLoaded) return;
				that.focusLoading = true;
				that.loadTitle = "";
				focusArticleLst(that.focusWhere).then(res => {
					that.focusLoading = false;
					that.focusLoaded = res.data.list.length < that.focusWhere.limit;
					res.data.list.forEach((item)=>{
						item.show = false
					})
					that.followList.push.apply(that.followList, res.data.list);
					that.focusWhere.page = that.focusWhere.page + 1;
				}).catch(err => {
					that.focusLoading = false;
					uni.showToast({
						title: err,
						icon: 'none'
					})
				});
			},
			// 商铺首页滚动 navbar 吸顶
			scrollHome: function(e) {
				this.navShow = e.detail.scrollTop >= this.storeHeight - 20;
			},
			likeToggle(item){
				let status = item.relevance_id ? 0 : 1
				graphicStartApi(item.community_id,{status: status}).then(res => {
					if(item.relevance_id){
						item.count_start--;
						item.count_start = item.count_start == 0 ? 0 : item.count_start
						item.relevance_id = false
					}else{
						item.count_start++;
						item.relevance_id = true
					}
				});
			},
			/*查看提到的宝贝*/
			openMore(item){
				this.$refs.mentioned.showPopup()
				this.moreList = item.relevance;
				this.authorUid = item.uid
			},
			openCommon(item,index){
				this.showComment = true
				this.$refs.comment.getData(item,index);
			},
			commentSucces(index){
				this.followList[index]['count_reply']++
				
			},
			closePopup(){
				this.$refs.mentioned.closePopup()
			},
			close(){
				this.showComment = false;
			}	
		},
		onReachBottom() {	
			if(this.tabActive == 1){
				this.getGoods();
			}else{
				this.getFocusArtical();
			}
		},
	
	}
</script>

<style lang="scss">
page{
	background: #fff;
}
.page_con{
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	flex-direction: column;
}

.longTab {
	display: flex;
	width: 100%;
	background: #fff;
	border-radius: 16rpx 16rpx 0 0;
	padding: 20rpx 0;
	.longItem {
		height: 50upx;
		display: inline-block;
		line-height: 50upx;
		text-align: center;
		font-size: 30rpx;
		color: #999999;
		max-width: 160rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		overflow-x: scroll;
		overflow-y: hidden;
		/*解决ios上滑动不流畅*/
		-webkit-overflow-scrolling: touch;
		position: relative;
		&.click {
			font-weight: bold;
			font-size: 34rpx;
			color: #e93323;
			&::after{
				content: "";
				display: block;
				width: 60rpx;
				height: 4rpx;
				background-color: #e93323;
				display: flex;
				position: absolute;
				left: 50%;
				margin-left: -32rpx;
				bottom: 0rpx;
			}
			.underline {
				opacity: 1;
			}
		}
	}
	.underlineBox {
		height: 3px;
		width: 20%;
		display: flex;
		align-content: center;
		justify-content: center;
		.underline {
			opacity: 0;
			width: 60rpx;
			height: 4rpx;
			background-color: #e93323;
		}
	}
}
uni-swiper,swiper{
	
}
uni-swiper-item{
	
}
.tab-cont{
	border-radius: 16rpx 16rpx 0 0;
}
.follow_count{
	/* #ifndef MP */
	padding: 20rpx 20rpx 100rpx;
	/* #endif */
	/* #ifdef MP */
	padding: 20rpx 20rpx 0;
	/* #endif */
	.title{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.author{
		display: flex;
		align-items: center;
		/deep/.picture, /deep/uni-image{
			width: 78rpx;
			height: 78rpx;
			border-radius: 100%;
			overflow: hidden;
		}
		.name{
			margin-left: 20rpx;
			color: #333333;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
	.time{
		color: #999999;
		font-size: 24rpx;
	}
	.product{
		margin-top: 20rpx;
		border-radius: 16rpx;
	}
	.icon-fenxiang2{
		color: #282828;
		font-size: 46rpx;
	}
}
.list_count{
	margin-bottom: 70rpx;
	&:last-child{
		margin-bottom: 0;
	}
}
.pro_describle{
	.mentioned{
		padding: 20rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #F5F5F5;
		.title{
			color: #666666;
			font-size: 26rpx;
		}
	}
	.product_more{
		max-width: 360rpx;
		display: flex;
		align-items: center;
		.more_image{
			width: 58rpx;
			height: 58rpx;
			border-radius: 5rpx;
			border: 1rpx solid #BBBBBB;
			margin-right: 12rpx;
			display: inline-block;
		}
		.iconfont{
			color: #CCCCCC;
			margin-left: 10rpx;
		}
	}
	.product_info{
		line-height: 45rpx;
		margin: 20rpx 0;
		.text{
			font-size: 28rpx;
			color: #282828;
		}
		.unfold_btn{
			margin-left: 30rpx;
			font-size: 30rpx;
			color: #282828;
			font-weight: bold;
		}
	}
	.product_cate{
		margin: 20rpx 0;
		display: inline-block;
		>view{
			display: flex;
			align-items: center;
			background: #FFF3F2;
			border-radius: 30rpx;
			padding: 0 25rpx;
			line-height: 56rpx;
			height: 56rpx;
			color: #E93323;
			.text{
				font-size: 28rpx;
			}
			.icon{
				font-size: 35rpx;
				font-weight: bold;
				margin-right: 10rpx;
			}
		}
			
	}
	.foot_bar{
		display: flex;
		align-items: center;
		justify-content: space-between;
		.item{
			display: flex;
			align-items: center;
			color: #282828;
			&.icon-fenxiang2{
				font-size: 46rpx;
			}
		}
		.item_count{	
			font-size: 26rpx;
			display: flex;
			align-items: center;
			&:first-child{
				margin-right: 30rpx;
			}
			.iconfont{
				font-size: 40rpx;
				margin-right: 5rpx;
			}
			.icon-shoucang1{
				color: #E93323;
			}
		}
	}
}
.grass_header {
	display: flex;
	flex-direction: column;
	background-image: url('data:image/jpg;base64,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');
	background-size: cover;
	background-color: #ffffff;
	width: 100%;
	z-index: 10;
}
.header {
	padding: 0 30rpx 20rpx;
	.navTab{
		position: relative;
		padding: 20rpx 0 40rpx 0;
		.nav-item{
			font-size: 32rpx;
			color: #666666;
			&:first-child{
				margin-right: 70rpx;
			}
			&.on{
				font-size: 38rpx;
				color: #282828;
				font-weight: bold;
			}
		}
		.release_btn{
			width: 58rpx;
			height: 58rpx;
			border-radius: 100%;
			background: linear-gradient(126deg, #E92F2F 0%, #FF6C29 100%);
			color: #fff;
			position: absolute;
			top: 20rpx;
			left: 0;
			.iconfont{
				font-size: 28rpx;
			}				
		}
		.avatar{
			width: 58rpx;
			height: 58rpx;
			border-radius: 100%;
			border: 3rpx solid rgba(0,0,0,.05);
			position: absolute;
			top: 20rpx;
			right: 0;
		}
	}
	.search_count{
		display: flex;
		align-items: center;
		justify-content: space-between;
		.search_topic{
			width: 46rpx;
			height: 46rpx;
			image,.topic_icon,uni-image{
				width: 46rpx;
				height: 46rpx;
			}
		}
	}
	.search {
		display: flex;
		align-items: center;
		min-width: 0;
		height: 58rpx;
		border-radius: 29rpx;
		background-color: #FFFFFF;
		font-weight: 500;
		font-size: 24rpx;
		color: #999999;
		width: 609rpx;
		.iconfont {
			margin-right: 13rpx;
			margin-left: 30rpx;
			font-size: 24rpx;
		}
	}
}
.main_count{
	background-color: #ffffff;
	padding: 30rpx 20rpx;
	.list{
		width: 710rpx;
		height: 280rpx;
		margin-bottom: 30rpx;
		position: relative;
		.picture{
			width: 710rpx;
			height: 280rpx;
			border-radius: 16rpx;
		}
	}
}
.main {
	flex: 1;
	min-height: 60vh;
	height: auto;
}
.nav.fixed {
	position: fixed;
	left: 0;
	width: 100%;
	.nav-cont {
		position: absolute;
		width: 100%;
	}
}
.goods {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 0 20rpx;
	background: #ffffff;
	width: 750rpx;
	/* #ifdef H5 */
	padding-bottom: 10rpx;
	/* #endif */
	.item {
		width: 345rpx;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		background-color: #FFFFFF;
		overflow: hidden;
		/deep/.image,/deep/.easy-loadimage,uni-image {
			width: 345rpx;
			height: 345rpx;
			image {
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		.text {
			padding: 20rpx 20rpx 25rpx;
			.name {			
				font-weight: 500;
				font-size: 30rpx;
				line-height: 1;
				color: #222222;
				display: flex;
				align-items: center;
				.name_text{
					display: inline-block;
					max-width: 400rpx;
				}
			}
			.money-wrap {
				display: flex;
				align-items: center;
				margin-top: 43rpx;
				.money {
					font-weight: bold;
					font-size: 26rpx;
					color: $theme-color;
					text {
						font-size: 34rpx;
						line-height: 1;
					}
				}
				.ticket {
					height: 26rpx;
					padding-right: 9rpx;
					padding-left: 9rpx;
					border: 1rpx solid $theme-color;
					border-radius: 4rpx;
					margin-left: 10rpx;
					font-weight: 500;
					font-size: 20rpx;
					line-height: 24rpx;
					color: $theme-color;
				}
			}
			.score {
				margin-top: 20rpx;
				font-weight: 500;
				font-size: 20rpx;
				line-height: 1;
				color: #737373;
			}
		}
		.foot {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 52rpx;
			background: linear-gradient(to right, #F11B09, #F67A38);
			font-weight: 500;
			font-size: 24rpx;
			color: #FFFFFF;
			.iconfont {
				margin-right: 10rpx;
				font-size: 22rpx;
				line-height: 1;
			}
		}
	}
}	
.empty{
	width: 100%;
	text-align: center;
	margin-top: 200rpx;
	/* #ifdef MP */
	margin-top: 100rpx;
	/* #endif */
	image,uni-image{
		display: inline-block;
		width: 414rpx;
		height: 305rpx;
	}
	.title{
		font-size: 28rpx;
		color: #282828;
		font-weight: bold;
		margin-bottom: 14rpx;
	}
	text{
		display: block;
		color: #999999;
		font-size: 26rpx;
	}
	.login_btn{
		width: 440rpx;
		text-align: center;
		height: 76rpx;
		line-height: 76rpx;
		color: #E93323;
		border: 1rpx solid #E93323;
		border-radius: 40rpx;
		margin: 44rpx auto 0;
		font-size: 32rpx;
	}
}
</style>
