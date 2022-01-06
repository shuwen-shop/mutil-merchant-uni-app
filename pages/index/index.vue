<template>
	<view :style="{height: showSkeleton ? '90vh' : 'auto'}">
		<skeleton :show="showSkeleton" :isNodes="isNodes" ref="skeleton" loading="chiaroscuro" selector="skeleton" bgcolor="#FFF"></skeleton>
		<view v-if="!errorNetwork" :style="{visibility: showSkeleton ? 'hidden' : 'visible'}">
			<view class="page-index skeleton" :class="{ bgf: navIndex > 0 }">
				<!-- 首页头部搜索部分 -->
				<!-- #ifdef H5 -->
				<view class="header">
					<view class="serch-wrapper flex acea-row row-between-wrapper">
						<view class="logo skeleton-rect">
							<image :src="logoUrl" mode=""></image>
						</view>
						<navigator url="/pages/columnGoods/goods_search/index" :class="logoUrl ? 'input' : 'uninput'" hover-class="none">
							<text class="iconfont icon-xiazai5"></text>
							搜索商品
						</navigator>
						<navigator class="btn" url="/pages/chat/customer_list/index?type=0" hover-class="none">
							<view class="iconfont icon-xiaoxi"></view>
							<text class="iconnum bg-color-red" v-if="userInfo.total_unread">{{ userInfo.total_unread }}</text>
						</navigator>
					</view>

					<tabNav class="tabNav" :class="{ fixed: isFixed }" :tabTitle="navTop" @changeTab="changeTab" :style="{display: showSkeleton ? 'none' : 'block'}"></tabNav>
				</view>
				<!-- #endif -->

				<!-- #ifdef MP || APP-PLUS -->
				<view class="mp-header">
					<view class="sys-head skeleton-rect" view :style="{ height: statusBarHeight }"></view>
					<view class="serch-box skeleton-rect" view style="height: 43px;">
						<view class="serch-wrapper flex">
							<view class="logo skeleton-rect"><image :src="logoUrl" mode=""></image></view>
							<navigator url="/pages/columnGoods/goods_search/index" :class="logoUrl ? 'input' : 'uninput'" hover-class="none" class="skeleton-rect">
								<text class="iconfont icon-xiazai5"></text>
								搜索商品
							</navigator>
						</view>
					</view>
					<tabNav class="tabNav" :tabTitle="navTop" @changeTab="changeTab" :style="{display: showSkeleton ? 'none' : 'block'}"></tabNav>
				</view>
				<!-- #endif -->

				<!-- 首页头部搜索部分结束 -->

				<!-- 首页展示 -->
				<view class="page_content skeleton" v-if="navIndex == 0" :style="{ paddingTop: mpHeight + 'px' }">
					<view class="page_bg">
						<!-- #ifdef MP -->
						<!-- <view class="mp-bg"></view> -->
						<!-- #endif -->
						<!-- banner 开始 -->
						<view class="swiper page_swiper" v-if="imgUrls.length">
							<swiper
								indicator-dots="true"
								:autoplay="true"
								:circular="circular"
								:interval="interval"
								:duration="duration"
								indicator-color="#E4E4E4"
								indicator-active-color="#E93323"
								previous-margin="40rpx"
								next-margin="40rpx"
								:current="swiperCur"
								@change="swiperChange"
							>
								<block v-for="(item, index) in imgUrls" :key="index">
									<swiper-item :class="{ active: index == swiperCur }">
										<view @click="goUrl(item.url)" class="slide-navigator acea-row row-between-wrapper"><image :src="item.pic" class="slide-image skeleton-rect"></image></view>
									</swiper-item>
								</block>
							</swiper>
						</view>
						<!-- banner 结束 -->
						<!-- menu 商品品类列表开始-->
						<view class="nav acea-row">
							<block v-for="(item, index) in menus" :key="index">
								<view class="item" @click="goMenuDetail(item)">
									<view class="pictrue"><image :src="item.pic" class="skeleton-radius"></image></view>
									<view class="menu-txt area-row skeleton-rect">{{ item.name }}</view>
								</view>
							</block>
						</view>
						<!-- menu 商品品类列表结束-->
						<!-- 后端配置跳转用宣传图片 -->
						<view class="ad" v-if="ad.home_ad_pic">
							<navigator class="ad skeleton-rect" :url="ad.home_ad_url" hover-class="none">

								<image mode="" :src="ad.home_ad_pic"></image>
							</navigator>
						</view>

						<!-- 后端配置跳转用宣传图片结束 -->
						<!--秒杀 开始-->
						<view class="main">
							<view v-if="spikeList.length > 0" class="skeleton-rect skeleton-rect">
								<view class="seckill-count">
									<view class="spike-bd">
										<view class="acea-row row-middle">
											<image class="title-img" src="/static/images/spike_title.png"></image>
											<view class="spike-distance">
												<text class="text bg-red">距结束</text>
												<countDown :is-day="false" :tip-text="' '" :day-text="' '" :hour-text="':'" :minute-text="':'" :second-text="' '" :datatime="datatime"></countDown>
											</view>
										</view>

										<navigator url="/pages/activity/goods_seckill/index" class="more-btn" hover-class="none">
											更多惊喜
											<text class="iconfont icon-jiantou" hover-class="none"></text>
										</navigator>
									</view>
									<view class="spike-wrapper">
										<scroll-view scroll-x="true" style="white-space: nowrap; display: flex" show-scrollbar="false">
											<navigator
												class="spike-item"
												v-for="(item, index) in spikeList"
												:key="index"
												:url="'/pages/activity/goods_seckill_details/index?id=' + item.product_id + '&time=' + item.stop + ''"
												hover-class="none"
											>
												<view class="img-box"><image :src="item.image" mode=""></image></view>
												<view class="info">
													<view class="name line1">{{ item.store_name }}</view>
													<view class="stock-box">
														<view class="grabbed" :style="'width:' + item.percent + ';'"></view>
														<text class="stock-sales">{{ item.percent }}</text>
													</view>
													<view class="price-box">
														<text class="price">
															<text>￥</text>
															{{ item.price }}
														</text>
														<text class="old-price">
															<text>￥</text>
															{{ item.ot_price }}
														</text>
													</view>
												</view>
											</navigator>
										</scroll-view>
									</view>
								</view>
							</view>

						</view>
						<!--秒杀 结束-->

						<!-- 拼团 开始-->
						<view class="main">
							<view class="skeleton-rect">
								<view v-if="combinationList.length > 0" class="combination-count">
									<view class="spike-bd">
										<view class="title line1"><image class="title-img" src="/static/images/group_title.png"></image></view>
										<navigator url="/pages/activity/combination/index" class="more-btn" hover-class="none">
											超值团购
											<text class="iconfont icon-jiantou" hover-class="none"></text>
										</navigator>
									</view>
									<view class="combination_wrapper">
										<view class="spike-wrapper">
											<block class="acea-row row-between-wrapper combination">
												<view class="combination-item" v-for="(item, index) in combinationList" :key="index" hover-class="none" @click="goCombinDetail(item)">
													<view class="info">
														<view class="price-box combination-price">
															<view class="name line1">{{ item.product.store_name }}</view>
															<text class="price">
																<text>￥</text>
																{{ item.price }}
															</text>
															<text class="gocom_btn">
																去拼团
																<text class="iconfont icon-jiantou"></text>
															</text>
														</view>
													</view>
													<view class="img-box">
														<!-- <image :src="item.product.image" mode=""></image> -->
														<easy-loadimage mode="widthFix" :image-src="item.product.image"></easy-loadimage>
													</view>
												</view>
												<view v-if="combinationList.length == 1" class="combination-item" @click="goCombinDetail(combinationList[0])">
													<view class="info">
														<view class="price-box combination-price">
															<view class="name line1">{{ combinationList[0].product.store_name }}</view>
															<text class="price">
																<text>￥</text>
																{{ combinationList[0].price }}
															</text>
															<text class="gocom_btn">
																去拼团
																<text class="iconfont icon-jiantou"></text>
															</text>
														</view>
													</view>
													<view class="img-box">
														<!-- <image :src="combinationList[0].product.image" mode=""></image> -->
														<easy-loadimage mode="widthFix" :image-src="combinationList[0].product.image"></easy-loadimage>
													</view>
												</view>
												<view v-if="combinationList.length == 1" class="combination-item" @click="goCombinDetail(combinationList[0])">
													<view class="info">
														<view class="price-box combination-price">
															<view class="name line1">{{ combinationList[0].product.store_name }}</view>
															<text class="price">
																<text>￥</text>
																{{ combinationList[0].price }}
															</text>
															<text class="gocom_btn">
																去拼团
																<text class="iconfont icon-jiantou"></text>
															</text>
														</view>
													</view>
													<view class="img-box">
														<!-- <image :src="combinationList[0].product.image" mode=""></image> -->
														<easy-loadimage mode="widthFix" :image-src="combinationList[0].product.image"></easy-loadimage>
													</view>
												</view>
												<view v-if="combinationList.length == 2" class="combination-item" @click="goCombinDetail(combinationList[1])">
													<view class="info">
														<view class="price-box combination-price">
															<view class="name line1">{{ combinationList[1].product.store_name }}</view>
															<text class="price">
																<text>￥</text>
																{{ combinationList[1].price }}
															</text>
															<text class="gocom_btn">
																去拼团
																<text class="iconfont icon-jiantou"></text>
															</text>
														</view>
													</view>
													<view class="img-box">
														<!-- <image :src="combinationList[1].product.image" mode=""></image> -->
														<easy-loadimage mode="widthFix" :image-src="combinationList[1].product.image"></easy-loadimage>
													</view>
												</view>
											</block>
										</view>
									</view>
								</view>
							</view>

						</view>
						<!-- 拼团 结束-->
					</view>

					<!--活动专题-->
					<view class="main">

						<view class="skeleton-rect">

							<view v-if="activityData.length > 0" class="activity_count">
								<view class="spike-bd">
									<view class="title line1">
										<image class="title-img" src="/static/images/topic_title.png"></image>
									</view>
									<navigator url="/pages/activity/topic/index" class="more-btn" hover-class="none">
										进入专题
										<text class="iconfont icon-jiantou" hover-class="none"></text>
									</navigator>
								</view>

								<view class="topic_swiper" v-if="activityData.length">
									<swiper indicator-dots="true" :autoplay="autoplay" :circular="circular" :interval="interval" :duration="duration"
									 indicator-color="rgba(255,255,255,0.6)" indicator-active-color="#fff">
										<block v-for="(item,index) in activityData" :key="index">
											<swiper-item>
												<navigator :url="'/pages/activity/topic_detail/index?id='+item.group_data_id" class='slide-navigator acea-row row-between-wrapper' hover-class='none'>
													<image :src="item.pic" class="slide-image"></image>

												</navigator>
											</swiper-item>
										</block>
									</swiper>
								</view>
							</view>
						</view>

					</view>
					<!-- #ifdef MP -->
					<!--直播 开始 -->
					<view class="main" v-if="liveList.length > 0">
						<view class="live-count">
							<view>
								<!-- 直播 -->
								<block>
									<view class="spike-bd" style="padding-left: 10rpx;">
										<view class="title line1"><image class="title-img" src="/static/images/broadcast_title.png"></image></view>
										<navigator url="/pages/activity/liveBroadcast/index" class="more-btn" hover-class="none">
											进入频道
											<text class="iconfont icon-jiantou" hover-class="none"></text>
										</navigator>
									</view>

									<view class="live-wrapper mores">
										<scroll-view scroll-x="true" style="white-space: nowrap; display: flex">
											<view class="item" v-for="(item, index) in liveList" :key="index">
												<navigator hover-class="none" :url="item.link">
													<view
														class="live-top"
														:style="'background:' + (item.live_status == 101 ? playBg : item.live_status != 101 && item.live_status != 102 ? endBg : notBg) + ';'"
														:class="item.live_status == 102 ? 'playRadius' : 'notPlayRadius'"
													>
														<block v-if="item.live_status == 101">
															<image src="/static/images/live-01.png" mode=""></image>
															<text>直播中</text>
														</block>
														<block v-if="item.live_status == 103 && item.replay_status === 1">
															<image src="/static/images/live-02.png" mode=""></image>
															<text>回放</text>
														</block>
														<block v-if="(item.live_status != 101 && item.live_status != 102 && item.live_status != 103) || (item.live_status == 103 && item.replay_status == 0)">
															<image src="/static/images/live-02.png" mode=""></image>
															<text>已结束</text>
														</block>
														<block v-if="item.live_status == 102">
															<image src="/static/images/live-03.png" mode=""></image>
															<text>预告</text>
														</block>
													</view>
													<view v-if="item.live_status == 101 || item.live_status == 102" class="broadcast-time">{{ item.show_time }}</view>
													<easy-loadimage mode="widthFix" :image-src="item.share_img"></easy-loadimage>
													<!-- <view class="live-title">{{ item.live_status }}</view> -->
												</navigator>
											</view>
										</scroll-view>
									</view>
								</block>

							</view>
						</view>

					</view>
					<!-- 直播模块 结束 -->
					<!-- #endif -->

					<!--预售 开始-->
					<presell :presellList="presellList" class="skeleton-rect"></presell>
					<!--预售 结束 -->

					<!--助力-->
					<view class="main" v-if="assistList.length > 0">
						<view class="skeleton-rect">
							<view class="assist-count">
								<view class="spike-bd">
									<view class="title line1"><image class="title-img" src="/static/images/assist_title.png"></image></view>
									<view v-if="assistUserList.length > 0" class="activity_pic">
										<view v-for="(item, index) in assistUserList" class="picture">
											<text v-if="item.avatar_img" class="avatar" :style="'background-image: url(' + item.avatar_img + ')'"></text>
											<text v-else class="avatar" style="background-image: url('/static/images/f.png')"></text>
										</view>
										<text class="pic_count">{{ assistUserCount }}人助力成功</text>
									</view>
									<navigator url="/pages/activity/assist/index" class="more-btn" hover-class="none">
										更多活动
										<text class="iconfont icon-jiantou" hover-class="none"></text>
									</navigator>
								</view>
								<view class="wapper_count">
									<view class="spike-wrapper">
										<scroll-view scroll-x="true" style="white-space: nowrap; display: flex" show-scrollbar="false">
											<view class="spike-item assist-item" v-for="(item, index) in assistList" :key="index" @click="handleAssist(item.product_assist_id)">
												<view class="img-box">
													<easy-loadimage mode="widthFix" :image-src="item.product.image"></easy-loadimage>
													<text class="participants">{{ item.user_count }}人参与</text>
												</view>
												<view class="assist-info">
													<view class="price-box presell-price">
														<view class="name line1">{{ item.store_name }}</view>
														<text class="price">
															<text class="assist_price">助力价</text>
															<text>￥</text>
															{{ item.assistSku[0].assist_price }}
														</text>
													</view>
													<button class="initiate_btn">发起助力</button>
												</view>
											</view>
										</scroll-view>
									</view>
								</view>
							</view>
						</view>

					</view>
					<!--助力结束-->
					<!--种草 开始 -->
					<view class="main">
						<view class="plant-count skeleton-rect">
							<block v-if="community_status == 1">
								<view class="spike-bd plant_bg">
									<view class="title line1"><image class="title-img" src="/static/images/plant_title.png"></image></view>
									<navigator open-type='switchTab' url="/pages/plant_grass/index" class="more-btn" hover-class="none">
										好物分享
										<text class="iconfont icon-jiantou" hover-class="none"></text>
									</navigator>
								</view>
								<view class="live-wrapper plant" style="border-radius: 0;">
									<scroll-view scroll-x="true" style="white-space: nowrap; display: flex">
										<navigator hover-class="none" :url="'/pages/plantGrass/plant_detail/index?id='+item.community_id" v-for="(item, index) in plantList" :key="index" class="item">
											<view>
												<easy-loadimage mode="widthFix" :image-src="item.image[0]"></easy-loadimage>
												<view class="item_text">
													<text class="text_name line1">{{item.title}}</text>
													<view v-if="item.author" class="text_count acea-row">
														<image :src="item.author.avatar || '/static/images/f.png'"></image>
														<text class="name line1">{{item.author.nickname}}</text>
													</view>
												</view>
											</view>
										</navigator>
									</scroll-view>
								</view>
							</block>
						</view>
					</view>
					<!-- 种草结束 -->
					<view class="main">
						<view class="skeleton-rect">
							<!-- 热点菜单 -->
							<hot-menu :hot="hot"></hot-menu>
							<!-- 热点菜单结束 -->
							<!-- 品牌好店 -->
							<brand-store v-if="brandList.length && hide_mer_status != 1" :brandList="brandList" :hide_mer_status="hide_mer_status"></brand-store>
							<!-- 品牌好店结束 -->
							<!-- 首页推荐 -->
							<view class="index-product-wrapper">
								<!-- 首发新品 -->
								<recommend :hostProduct="hostProduct" :indexP="true" :isLogin="isLogin"></recommend>
								<view class="loadingicon acea-row row-center-wrapper" v-if="hostProduct.length > 0">
									<text class="loading iconfont icon-jiazai" :hidden="hotLoading == false"></text>
									{{ hotTitle }}
								</view>
							</view>
						</view>

					</view>
				</view>
				<!-- 分类页 -->
				<view class="productList" v-if="navIndex > 0" :style="'margin-top:' + prodeuctTop + 'px;'">
					<view class="sort acea-row" :class="sortList.length ? '' : 'no_pad'" :style="{ marginTop: sortMarTop + 'px' }">
						<navigator
							hover-class="none"
							v-if="index < 9"
							:url="'/pages/columnGoods/goods_list/index?id=' + item.store_category_id + '&title=' + item.cate_name"
							class="item"
							v-for="(item, index) in sortList"
							:key="index"
						>
							<view class="pictrue"><image :src="item.pic"></image></view>
							<view class="text">{{ item.cate_name }}</view>
						</navigator>
						<view class="item" @click="bindMore(item)" v-if="sortList.length >= 9">
							<view class="pictrues acea-row row-center-wrapper"><text class="iconfont icon-gengduo1"></text></view>
							<view class="text" style="margin-top: 22rpx;">更多</view>
						</view>
					</view>
					<block v-if="sortProduct.length > 0">
						<view class="list acea-row row-between-wrapper">
							<navigator @tap="goDetails(item)" class="item" v-for="(item, index) in sortProduct" :key="index">
								<view class="pictrue">
									<easy-loadimage mode="widthFix" :image-src="item.image"></easy-loadimage>
								</view>
								<view class="text">
									<view class="name line1">
										<text v-if="item.merchant.type_name && item.product_type == 0" class="font-bg-red">{{ item.merchant.type_name }}</text>
										<text v-else-if="item.merchant.is_trader && item.product_type == 0" class="font-bg-red">自营</text>
										<text v-if="item.product_type != 0" :class="'font_bg-red type' + item.product_type">
											{{ item.product_type == 1 ? '秒杀' : item.product_type == 2 ? '预售' : item.product_type == 3 ? '助力' : item.product_type == 4 ? '拼团' : '' }}
										</text>
										<text class="name_text line1">{{ item.store_name }}</text>
									</view>
									<view class="acea-row row-middle">
										<view class="money font-color-red">
											￥
											<text class="num">{{ item.price }}</text>
										</view>
										<text class="coupon font-color-red" v-if="item.issetCoupon">领券</text>
									</view>
								</view>
							</navigator>
							<view class="loadingicon acea-row row-center-wrapper" v-if="sortProduct.length > 0 || sortProductLoading">
								<text class="loading iconfont icon-jiazai" :hidden="loading == false"></text>
								{{ loadTitle }}
							</view>
						</view>
					</block>
					<block v-if="sortProduct.length == 0">
						<view class="noCommodity">
							<view class="pictrue" style="margin: 0 auto;"><image src="/static/images/noShopper.png"></image></view>
							<recommend :hostProduct="hostProduct"></recommend>
						</view>
					</block>
				</view>
			</view>
		</view>
		<view v-else>
			<view class="error-network">
				<image src="/static/images/error-network.png"></image>
				<view class="title">网络连接断开</view>
				<view class="con">
					<view class="label">请检查情况：</view>
					<view class="item">· 在设置中是否已开启网络权限</view>
					<view class="item">· 当前是否处于弱网环境</view>
					<view class="item">· 版本是否过低，升级试试吧</view>
				</view>
				<view class="btn" @click="reconnect">重新连接</view>
			</view>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="privacy-wrapper" v-if="privacyStatus">
			<view class="privacy-box">
				<view class="title">服务协议与隐私政策</view>
				<view class="content">
					请务必审慎阅读、充分理解“服务协议与 隐私政策”各条款，包括但不限于：为了 向你提供即时通讯、内容分享等服务，我 们需要收集你的设备信息、操作日志等个
					人信息。你可以在“设置”中查看、变更、 删除个人信息并管理你的授权。
					<br />
					你可以阅读
					<navigator url="/pages/users/privacy/index">《服务协议与隐私政策》</navigator>
					了解 详细信息。如你同意，请点击“我同意”开始接受我们的服务。
				</view>
				<view class="btn-box">
					<view class="btn-item" @click="confirmApp">我同意</view>
					<view class="btn" @click="closeModel">随便逛逛</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
		<!-- 发送给朋友图片 -->

		<view class="share-box" v-if="isIntegral">
			<image src="/static/images/share-info.png" @click="closeShare"></image>
		</view>

		<!-- #ifdef MP -->
		<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse" :isGoIndex="false"></authorize>
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<passwordPopup></passwordPopup>
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
var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
let app = getApp();
import { getUserInfo } from '@/api/user.js';
import { getIndexData, getCoupons } from '@/api/api.js';
// #ifdef MP-WEIXIN
import { getTemlIds } from '@/api/api.js';
import { SUBSCRIBE_MESSAGE, TIPS_KEY } from '@/config/cache';
import { getLiveList } from '@/api/store.js';
// #endif
import { graphicLstApi } from '@/api/community.js';
import { getShare, follow, getconfig } from '@/api/public.js';
import { getSeckillIndexTime } from '@/api/activity.js';
import goodList from '@/components/goodList';
import promotionGood from '@/components/promotionGood';
import couponWindow from '@/components/couponWindow';
import { goShopDetail } from '@/libs/order.js';
import { mapGetters } from 'vuex';
import tabNav from '@/components/tabNav.vue';
import countDown from '@/components/countDown';
import { getCategoryList, getProductslist, getProductHot, storeCategory, storeMerchantList } from '@/api/store.js';
import { getPresellList, getSeckillList, getAssistList, initiateAssistApi, assistUserData, getCombinationList } from '@/api/activity.js';
import { openBargainSubscribe } from '@/utils/SubscribeMessage.js';
import { setVisit, spread } from '@/api/user.js';
import recommend from '@/components/recommend';
// #ifndef H5
import passwordPopup from '@/components/passwordPopup';
// #endif
// #ifdef MP
import authorize from '@/components/Authorize';
// #endif
import { silenceBindingSpread } from '@/utils';
import history from '@/mixins/history';
import { toLogin } from '@/libs/login.js';
import shareScence from '@/libs/spread';
import presell from './component/presell.vue';
import hotMenu from './component/hotMenu.vue';
import brandStore from './component/brandStore.vue';
import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';


export default {
	computed: mapGetters(['isLogin', 'uid']),
	mixins: [history],
	components: {
		easyLoadimage,
		presell, // 预售组件
		hotMenu, // 热点菜单组件
		brandStore, // 热门店铺
		tabNav,
		goodList,
		promotionGood,
		couponWindow,
		countDown,
		recommend,
		// #ifndef H5
		passwordPopup,
		// #endif
		// #ifdef MP
		authorize
		// #endif
	},
	data() {
		return {
			showSkeleton: true, //骨架屏显示隐藏
			isNodes: 0, //控制什么时候开始抓取元素节点,只要数值改变就重新抓取
			privacyStatus: false,
			errorNetwork: false,
			countDownHour: '00',
			countDownMinute: '00',
			countDownSecond: '00',
			datatime: '',
			ad: {home_ad_pic: ''},
			userInfo: '',
			loading: false,
			isAuto: false, //没有授权的不会自动授权
			isShowAuth: false, //是否隐藏授权
			statusBarHeight: statusBarHeight,
			navIndex: 0,
			navTop: [],
			subscribe: false,
			followUrl: '',
			followHid: true,
			followCode: false,
			logoUrl: app.globalData.site_logo,
			// logoUrl: "",
			imgUrls: [{url:'',pic:'',id: '',name:''}],
			hot: [],
			sortList: [],
			itemNew: [],
			menus: [{url:'',pic:'',id: '',name:''},{url:'',pic:'',id: '',name:''},{url:'',pic:'',id: '',name:''},{url:'',pic:'',id: '',name:''},{url:'',pic:'',id: '',name:''},{url:'',pic:'',id: '',name:''},{url:'',pic:'',id: '',name:''},{url:'',pic:'',id: '',name:''},{url:'',pic:'',id: '',name:''},{url:'',pic:'',id: '',name:''}],
			bastInfo: '',
			fastInfo: '',
			firstInfo: '',
			firstList: [],
			salesInfo: '',
			likeInfo: [],
			benefit: [],
			indicatorDots: false,
			circular: true,
			autoplay: true,
			interval: 3000,
			duration: 500,
			window: false,
			iShidden: false,
			navH: '',
			newGoodsBananr: '',
			couponList: [],
			lovely: [],
			spikeList: [], //秒杀
			liveList: [], //直播
			presellList: [], //预售
			assistList: [], //助力
			assistUserList: [], //已助力数据
			assistUserCount: '',
			combinationList: [],
			plantList: [],
			hotList: [
				{
					pic: '/static/images/hot_001.png'
				},
				{
					pic: '/static/images/hot_002.png'
				},
				{
					pic: '/static/images/hot_003.png'
				}
			],
			spikeList: [],
			bargList: [],
			ProductNavindex: 0,
			marTop: 0,
			datatime: 0,
			childID: 0,
			loadend: false,
			loading: false,
			loadTitle: '加载更多',
			sortProduct: [],
			where: {
				pid: 0,
				page: 1,
				limit: 6
			},
			is_switch: true,
			hostProduct: [],
			hotPage: 1,
			hotLimit: 30,
			hotScroll: true,
			hotLoading: false,
			hotTitle: '加载更多',
			explosiveMoney: [],
			prodeuctTop: 0,
			pinkInfo: '',
			searchH: 0,
			isFixed: false,
			goodScroll: true, //精品推荐开关
			params: {
				//精品推荐分页
				page: 1,
				limit: 10
			},
			tempArr: [], //精品推荐临时数组
			pageInfo: '', // 精品推荐全数据
			site_name: app.globalData.site_name, //首页title
			swiperCur: 0,
			brandList: [],
			d: '',
			h: '',
			m: '',
			s: '',
			sum_h: '',
			endBg: 'linear-gradient(#666666, #999999)',
			notBg: 'rgb(26, 163, 246)',
			playBg: 'linear-gradient(#FF0000, #FF5400)',
			hide_mer_status: 1,
			community_status: 1,
			sortMarTop: 0,
			globalDatas: {},
			// #ifdef MP || APP-PLUS
			mpHeight: 108,
			// #endif
			// #ifndef MP || APP-PLUS
			mpHeight: 0,
			// #endif
			currSpid: '',
			mer_location: '',
			share_title: '',
			_options:{},
			isIntegral: false,
			activity_banner: true,
			activityData: [],
		};
	},
	/**
	 * 用户点击右上角分享
	 */
	// #ifdef MP
	onShareAppMessage: function() {
		let that = this;
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		return {
			title: that.share_title,
			path: '/pages/index/index?spid=' + that.uid
		};
	},
	onShareTimeline: function() {
		let that = this;
		return {
			title: that.share_title,
			query: {
				spid: that.uid
			},
			imageUrl: ''
		};
	},
	// #endif
	onLoad(options) {
		this._options = options;
		// #ifdef APP-PLUS
		const pages = getCurrentPages();
		const page = pages[pages.length - 1];
		const currentWebview = page.$getAppWebview();
		currentWebview.setStyle({
		  pullToRefresh: {
		    support: !this.isSupport,
		    style: plus.os.name === 'Android' ? 'circle' : 'default'
		  }
		});
		this.isSupport = !this.isSupport;
		// #endif
		this.pageLoad(options);
		setTimeout(() => {
			this.isNodes++;
		}, 100);
	},
	onShow() {
		this.getConfig();
		this.syncHeight();
		// #ifdef H5
		if (this.$wechat.isWeixin()) {
			this.isIntegral = uni.getStorageSync('isIntegral')
		}
		// #endif

	},
	onHide() {
		uni.setStorageSync('isIntegral',false)
	},
	onReady() {
		this.syncHeight();
	},
	watch: {
		globalDatas(nVal, oVal) {
			// #ifdef H5
			this.ShareInfo(nVal);
			// #endif
		},
		privacyStatus(n) {
			if (n) {
				uni.hideTabBar();
			} else {
				uni.showTabBar();
			}
		},
	},
	onPullDownRefresh(){
		setTimeout(()=> {
			uni.stopPullDownRefresh();
		}, 100);
		this.reconnect();
	},
	methods: {
		pageLoad(options){
			let that = this;
			if (options.spid) {
				that.currSpid = options.spid;
				app.globalData.spid = options.spid;
			}
			// #ifdef APP-PLUS
			try {
				let val = uni.getStorageSync('privacyStatus') || false;
				if (!val) {
					this.privacyStatus = true;
				}
			} catch (e) {}
			this.snycNetWork();
			// #endif
			// #ifdef MP
			if (options.scene) {
				let value = that.$util.getUrlParams(decodeURIComponent(options.scene));
				if (value.id) options.id = value.id;
				//记录推广人uid
				if (value.spid) {
					that.currSpid = value.spid;
					app.globalData.spid = value.spid;
				}
			}
			// #endif
			shareScence(that.currSpid, that.isLogin);
			// #ifdef MP
			// 获取小程序头部高度
			this.navH = app.globalData.navHeight;
			let info = uni.createSelectorQuery().select('.mp-header');
			info
				.boundingClientRect(function(data) {
					that.marTop = data.height;
				})
				.exec();
			// #endif
			// #ifndef MP
			this.navH = 0;
			// #endif
			this.isLogin && silenceBindingSpread();
			// this.setVisit()
			Promise.all([
				this.getIndexConfig(),
				this.storeMerchant(),
				this.get_host_product(),
				this.getSpeckillCutTime(),
				this.getSpikeProduct(),
				this.getCombinationProduct(),
				this.getPresellProduct(),
				this.getAssistProduct(),
				this.getAssistUserCount(),
				this.getPlantList()
			]);
			// #ifdef MP
			this.getLiveList();
			// #endif
			if (this.isLogin) {
				this.getUserInfo();
				// #ifdef MP
				this.getHistory();
				// #endif
			}
		},
		/*点击轮播图跳转*/
		goUrl(url){
			let isHttp = url.substring(0,4) == 'http' ? true : false;
			 if(isHttp){
				 // #ifdef H5
				 	location.href = url;
				 // #endif
				 // #ifndef H5
				 	uni.switchTab({
				 		url: url
				 	});
				 // #endif
			 }else{
				 uni.navigateTo({
				 	url: url
				 });
			 }
		},
		goTopicList(){
			uni.navigateTo({
				url: '/pages/activity/topic/index'
			});
		},
		//点击跳转专题详情页
		goTopicDetail(id){
			uni.navigateTo({
				url: '/pages/activity/topic_detail/index?id=' + id
			});
		},
		closeShare(){
			uni.setStorageSync('isIntegral',false);
			this.isIntegral = uni.getStorageSync('isIntegral');
		},
		// 重新链接
		reconnect() {
			uni.getNetworkType({
				success: res => {
					this.errorNetwork = res.networkType === 'none';
					if(!this.errorNetwork){
						this.pageLoad(this._options);
					}
				}
			});
		},
		syncHeight() {
			let self = this;
			// #ifdef MP || APP-PLUS
			setTimeout(res => {
				let info = uni.createSelectorQuery().select('.mp-header');
				info
					.boundingClientRect(function(data) {
						//data - 各种参数
						self.mpHeight = data.height> 101 ? data.height : 101;
					})
					.exec();
			}, 800);
			// #endif
		},
		// #ifdef APP-PLUS
		snycNetWork() {
			uni.getNetworkType({
				success: res => {
					this.errorNetwork = res.networkType === 'none';
				}
			});
		},
		// 同意隐私协议
		confirmApp() {
			uni.setStorageSync('privacyStatus', true);
			this.privacyStatus = false;
		},
		// 关闭Model
		closeModel() {
			this.privacyStatus = false;
		},
		// #endif
		// 微信登录回调
		onLoadFun: function(e) {
			this.isShowAuth = false;
		},
		setViewport(content) {
			const meta = document.querySelector('meta[name=viewport]');
			if (!meta) return;
			meta.setAttribute('content', content);
		},
		// 菜单详情
		goMenuDetail(item) {
			// let url = this.$util.stringIntercept(item.url, 0, "\?")
			if (item.url == '/pages/goods_cate/goods_cate') {
				let data = this.$util.stringIntercept(item.url, 1, '\?');
				data = this.$util.stringIntercept(data, 1, '\=');
				uni.setStorageSync('storeIndex', data);
				uni.switchTab({
					url: '/pages/goods_cate/goods_cate'
				});
			} else {
				uni.navigateTo({
					url: item.url
				});
			}
		},
		getConfig() {
			// 获取配置
			getconfig()
				.then(res => {
					let self = this;
					this.globalDatas = res.data;
					this.logoUrl = res.data.site_logo;
					this.site_name = res.data.site_name;
					this.hide_mer_status = res.data.hide_mer_status;
					this.community_status = res.data.community_status;
					this.mer_location = res.data.mer_location;
					this.share_title = res.data.share_title;
					//#ifndef APP-PLUS
					uni.setNavigationBarTitle({
						title: self.site_name
					});
					//#endif
					uni.$emit('configData', res.data);
				})
				.catch(err => {});
		},
		// 分类页更多
		bindMore(item) {
			console.log(this.navTop[this.navIndex]);
			try {
				uni.setStorageSync('storeIndex', this.navTop[this.navIndex].pid);
				uni.switchTab({
					url: '/pages/goods_cate/goods_cate'
				});
			} catch (e) {}
		},
		goDetails(item) {
			goShopDetail(item, this.uid).then(res => {
				if (this.isLogin) {
					initiateAssistApi(item.activity_id)
						.then(res => {
							let id = res.data.product_assist_set_id;
							uni.hideLoading();
							// #ifndef MP
							uni.navigateTo({
								url: '/pages/activity/assist_detail/index?id=' + id
							});
							// #endif
							// #ifdef MP
							openBargainSubscribe()
								.then(res => {
									uni.hideLoading();
									uni.navigateTo({
										url: '/pages/activity/assist_detail/index?id=' + id
									});
								})
								.catch(err => {
									uni.hideLoading();
								});
							// #endif
						})
						.catch(err => {
							uni.showToast({
								title: err,
								icon: 'none'
							});
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
			});
		},
		/**
		 * 获取个人用户信息
		 */
		getUserInfo: function() {
			let that = this;
			getUserInfo().then(res => {
				that.userInfo = res.data;
			});
		},
		// 品牌好店
		storeMerchant() {
			storeMerchantList({
				page: 1,
				limit: 3,
				is_best: 1
			}).then(res => {
				this.brandList = res.data.list;
			});
		},
		// 获取秒杀截止时间
		getSpeckillCutTime() {
			getSeckillIndexTime().then(res => {
				this.datatime = res.data.seckillEndTime ? res.data.seckillEndTime : '';
			});
		},
		// 获取秒杀商品
		getSpikeProduct() {
			let that = this;
			getSeckillList({
				limit: 10
			})
				.then(res => {
					that.spikeList = res.data.list;
					that.spikeList.map(item => {
						item.percent = item.stock === 0 ? '0%' : ((item.sales * 100) / item.stock).toFixed(2) + '%';
					});
				})
				.catch(e => {});
		},
		// #ifdef MP
		// 直播
		getLiveList() {
			let that = this;
			getLiveList({
				limit: 10
			})
				.then(res => {
					that.liveList = res.data.list;
					that.liveList.forEach(val => {
						val.link =
							(val.live_status == 103 && val.replay_status) || val.live_status === 101 || val.live_status === 102
								? 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + val.room_id
								: '';
					});
				})
				.catch(e => {});
		},
		// #endif
		// 拼团
		getCombinationProduct() {
			let that = this;
			getCombinationList({
				limit: 3
			})
				.then(res => {
					that.combinationList = res.data.list;
				})
				.catch(e => {});
		},
		// 预售
		getPresellProduct() {
			let that = this;
			getPresellList({
				limit: 10
			})
				.then(res => {
					that.presellList = res.data.list;
				})
				.catch(e => {});
		},
		// 种草
		getPlantList(){
			let that = this;
			graphicLstApi({
				limit: 10
			})
				.then(res => {
					that.plantList = res.data.list;
				})
				.catch(e => {});
		},
		// 助力
		getAssistProduct() {
			let that = this;
			getAssistList({
				limit: 10
			})
				.then(res => {
					that.assistList = res.data.list;
				})
				.catch(e => {});
		},
		// 获取已助力成功数据
		getAssistUserCount() {
			let that = this;
			assistUserData()
				.then(res => {
					that.assistUserCount = res.data.count;
					that.assistUserList = res.data.list;
				})
				.catch(e => {});
		},
		handleAssist(id) {
			if (this.isLogin) {
				initiateAssistApi(id)
					.then(res => {
						let id = res.data.product_assist_set_id;
						uni.hideLoading();
						// #ifndef MP
						uni.navigateTo({
							url: '/pages/activity/assist_detail/index?id=' + id
						});
						// #endif
						// #ifdef MP
						openBargainSubscribe()
							.then(res => {
								uni.hideLoading();
								uni.navigateTo({
									url: '/pages/activity/assist_detail/index?id=' + id
								});
							})
							.catch(err => {
								uni.hideLoading();
							});
						// #endif
					})
					.catch(err => {
						uni.showToast({
							title: err,
							icon: 'none'
						});
					});
			} else {
				// #ifdef H5 || APP-PLUS
				toLogin();
				// #endif
				// #ifdef MP
				this.isAuto = true;
				this.$set(this, 'isShowAuth', true);
				// #endif
			}
		},
		// swiper
		swiperChange(e) {
			// this.swiperCur = e.detail.current
			let { current, source } = e.detail;
			if (source === 'autoplay' || source === 'touch') {
				//根据官方 source 来进行判断swiper的change事件是通过什么来触发的，autoplay是自动轮播。touch是用户手动滑动。其他的就是未知问题。抖动问题主要由于未知问题引起的，所以做了限制，只有在自动轮播和用户主动触发才去改变current值，达到规避了抖动bug
				this.swiperCur = e.detail.current;
			}
		},
		// 记录会员访问
		setVisit() {
			setVisit({
				url: '/pages/index/index'
			}).then(res => {
				console.log(res);
			});
		},
		// 导航分类切换
		changeTab(e) {
			let self = this;
			if (this.navIndex == e.index) return;
			this.navIndex = e.index;
			if (e.index > 0) {
				storeCategory({
					pid: e.pid
				}).then(res => {
					this.sortList = res.data.length > 9 ? res.data.splice(0, 9) : res.data;
					if (this.sortList.length > 0) {
						this.where.pid = e.pid;
						this.where.page = 1;
						this.loadend = false;
						this.loading = false;
						this.sortProduct = [];
						this.get_product_list();
					}
				});

				// #ifdef MP || APP-PLUS
				setTimeout(res => {
					let info = uni.createSelectorQuery().select('.mp-header');
					info.boundingClientRect(function(data) {
							//data - 各种参数
							self.sortMarTop = data.height + 10;

							console.log(self.sortMarTop, 'self.sortMarTop');
						})
						.exec();
				}, 0);
				// #endif
				// #ifdef H5
				self.sortMarTop = 10;
				// #endif
			}
		},
		//分类产品
		get_product_list: function() {
			console.log(123);
			let that = this;
			// if (!that.loadend) return;
			if (that.loading) return;
			that.loading = true;
			that.loadTitle = '';
			getProductslist(that.where)
				.then(res => {
					let list = res.data.list;
					let productList = that.$util.SplitArray(list, that.sortProduct);
					let loadend = list.length < that.where.limit;
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? '已全部加载' : '加载更多';
					that.$set(that, 'sortProduct', productList);
					that.$set(that.where, 'page', that.where.page + 1);
				})
				.catch(err => {
					that.loading = false;
					that.loadTitle = '加载更多';
				});
		},
		/**
		 * 获取我的推荐
		 */
		get_host_product: function() {
			let that = this;
			let num = that.hotLimit;
			if (!that.hotScroll) return;
			if (that.hotLoading) return;
			that.hotLoading = true;
			that.hotTitle = '';
			getProductHot(that.hotPage, that.hotLimit).then(res => {
				let list = res.data.list;
				let productList = that.$util.SplitArray(list, that.hostProduct);
				let hotScroll = list.length <= num && list.length != 0;
				that.hotScroll = hotScroll;
				that.hotLoading = false;
				that.hotTitle = !hotScroll ? '已全部加载' : '加载更多';
				that.$set(that, 'hostProduct', productList);
				that.$set(that, 'hotPage', that.hotPage + 1);
			});
		},
		// 首页数据
		getIndexConfig: function() {
			let that = this;
			getIndexData().then(res => {
				that.$set(that, 'imgUrls', res.data.banner);
				that.$set(that, 'menus', res.data.menu);
				that.$set(that, 'hot', res.data.hot);
				that.$set(that, 'ad', res.data.ad);
				that.$set(that, 'activityData', res.data.activity_lst || []);
				console.log(that.activityData)
				res.data.category.unshift({
					cate_name: '首页'
				});
				that.$set(that, 'navTop', res.data.category);

				that.lovely = res.data.lovely;
				that.$set(that, 'pageInfo', res.data);
				that.$set(that, 'likeInfo', res.data.likeInfo);
				that.$set(that, 'benefit', res.data.benefit);
				that.explosiveMoney = res.data.explosive_money;
				// #ifdef H5
				that.subscribe = res.data.subscribe;
				// #endif
				// 小程序判断用户是否授权；
				// #ifdef MP
				uni.getSetting({
					success(res) {
						if (!res.authSetting['scope.userInfo']) {
							that.window = that.couponList.length ? true : false;
						} else {
							that.window = false;
							that.iShidden = true;
						}
					}
				});
				// #endif
				// #ifndef MP
				if (that.isLogin) {
					that.window = false;
				} else {
					that.window = that.couponList.length ? true : false;
				}
				// #endif

				that.syncHeight();
				that.reloadData();
			});
		},
		reloadData() {
			setTimeout(() => {
				this.showSkeleton = false
			}, 500)
		},
		// 授权关闭
		authColse: function(e) {
			this.isShowAuth = e;
		},
		// 首发新品详情
		goDetail(item) {
			if (item.activity && item.activity.type === '2' && !this.isLogin) {
				// #ifdef H5
				uni.showModal({
					title: '提示',
					content: '您未登录，请登录！',
					success: function(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/users/login/index'
							});
						} else if (res.cancel) {
						}
					}
				});
				// #endif
				// #ifdef MP
				this.$set(this, 'isAuto', true);
				this.$set(this, 'isShowAuth', true);
				// #endif
				return;
			} else {
				goShopDetail(item, this.uid).then(res => {
					uni.navigateTo({
						url: `/pages/goods_details/index?id=${item.id}`
					});
				});
			}
		},
		// 分类详情
		godDetail(item) {
			uni.navigateTo({
				url: `/pages/goods_details/index?id=${item.id}`
			});
		},
		//拼团详情
		goCombinDetail(item) {
			uni.navigateTo({
				url: `/pages/activity/combination_details/index?id=${item.product_group_id}`
			});
		},
		countTime: function() {
			// 获取当前时间
			var date = new Date();
			var now = date.getTime();
			//设置截止时间
			var endDate = new Date('2020-10-22 23:23:23');
			var end = endDate.getTime();
			//时间差
			var leftTime = end - now;
			//定义变量 d,h,m,s保存倒计时的时间
			if (leftTime >= 0) {
				this.d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
				this.h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
				this.m = Math.floor((leftTime / 1000 / 60) % 60);
				this.s = Math.floor((leftTime / 1000) % 60);
				this.sum_h = this.d * 24 + this.h;
			}
			// console.log(this.h)
			// console.log(this.m)
			// console.log(this.s)
			// console.log(this.s);
			//递归每秒调用countTime方法，显示动态时间效果
			setTimeout(this.countTime, 1000);
		},
		//#ifdef H5
		ShareInfo(datas) {
			let data = this.storeInfo;
			let href = location.href;
			if (this.$wechat.isWeixin()) {
				if (this.isLogin) {
					href = href.indexOf('?') === -1 ? href + '?spid=' + this.uid : href + '&spid=' + this.uid;
				} else {
					href = href;
				}
				let configAppMessage = {
					desc: datas.share_info,
					title: datas.share_title,
					link: href,
					imgUrl: datas.share_pic
				};

				this.$wechat
					.wechatEvevt(['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareAppMessage', 'onMenuShareTimeline'], configAppMessage)
					.then(res => {
						console.log(res, '=============================>>WXAPI');
					})
					.catch(err => {
						console.log(err);
					});
			}
		},
		//#endif

	},
	mounted() {
		let self = this;
		// #ifdef H5
		// 获取H5 搜索框高度
		setTimeout(() => {
			let appSearchH = uni.createSelectorQuery().select('.serch-wrapper');
			appSearchH
				.boundingClientRect(function(data) {
					self.searchH = data.height;
				})
				.exec();
		}, 800);
		// #endif
	},
	// 滚动到底部
	onReachBottom() {
		console.log('到底了');
		if (this.navIndex == 0) {
			// 首页加载更多
			this.get_host_product();
		} else {
			// 分类栏目加载更多
			if (this.sortProduct.length > 0) {
				this.get_product_list();
			} else {
				this.get_host_product();
			}
		}
	},
	// 滚动监听
	onPageScroll(e) {
		// #ifdef H5
		let self = this;
		if (e.scrollTop >= (self.searchH + 5)) {
			self.isFixed = true;
		} else {
			self.isFixed = false;
		}
		// #endif
		// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
		uni.$emit('scroll');
	}
};
</script>
<style>
page {
	display: flex;
	flex-direction: column;
	height: 100%;
	/* #ifdef H5 */
	background-color: #fff;
	/* #endif */
}
</style>
<style lang="scss">
	@import './style/main.scss';
.privacy-wrapper {
	z-index: 999;
	position: fixed;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	width: 100%;
	height: 100%;
	background: #7f7f7f;
	.privacy-box {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 560rpx;
		padding: 50rpx 45rpx 0;
		background: #fff;
		border-radius: 20rpx;

		.title {
			text-align: center;
			font-size: 32rpx;
			text-align: center;
			color: #333;
			font-weight: 700;
		}

		.content {
			margin-top: 20rpx;
			line-height: 1.5;
			font-size: 26rpx;
			color: #666;

			navigator {
				display: inline-block;
				color: #e93323;
			}
		}

		.btn-box {
			margin-top: 40rpx;
			text-align: center;
			font-size: 30rpx;

			.btn-item {
				height: 82rpx;
				line-height: 82rpx;
				background: linear-gradient(90deg, #f67a38 0%, #f11b09 100%);
				color: #fff;
				border-radius: 41rpx;
			}
			.btn {
				padding: 30rpx 0;
			}
		}
	}
}
.share-box {
		z-index: 1000;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		image {
			width: 100%;
			height: 100%;
		}
	}
.error-network {
	position: fixed;
	left: 0;
	top: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 100%;
	padding-top: 40rpx;
	background: #fff;
	padding-top: 30%;

	image {
		width: 414rpx;
		height: 336rpx;
	}

	.title {
		position: relative;
		top: -40rpx;
		font-size: 32rpx;
		color: #666;
	}

	.con {
		font-size: 24rpx;
		color: #999;

		.label {
			margin-bottom: 20rpx;
		}

		.item {
			margin-bottom: 20rpx;
		}
	}

	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 508rpx;
		height: 86rpx;
		margin-top: 100rpx;
		border: 1px solid #d74432;
		color: #e93323;
		font-size: 30rpx;
		border-radius: 120rpx;
	}
}
.area-row {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	display: block;
	width: 100%;
	text-align: center;
}
.seckill-count,
.assist-count {
	background-color: #fff;
	margin-bottom: 20rpx;
	border-radius: 16rpx;
	padding: 24rpx 0 26rpx 20rpx;
	box-shadow: 4rpx 2rpx 12rpx 2rpx rgba(0, 0, 0, 0.03);
}
.seckill-count .spike-bd{
	padding-left: 10rpx;
}
.assist-count {
	padding: 20rpx 0 26rpx 0;
}
.wapper_count {
	padding: 0 0 26rpx 20rpx;
}
.combination-count {
	background-color: #fff;
	margin-bottom: 11px;
	border-radius: 16rpx;
	box-shadow: 2px 1px 6px 1px rgba(0, 0, 0, 0.03);
	padding: 25rpx 0;
	position: relative;
	.combination_wrapper{
		padding: 0 20rpx;
	}

	.spike-wrapper {
		overflow: hidden;
		width: 670rpx;
	}
}

/deep/.spike-box .styleAll {
	display: inline-block;
	width: 44rpx;
	height: 40rpx;
	line-height: 40rpx;
	padding: 0;
	text-align: center;
	border-radius: 8rpx;
}
.activity_count{
	margin-bottom: 20rpx;
	line-height: 0;
	width: 710rpx;
	background: #ffffff;
	padding: 20rpx 0;
	border-radius: 16rpx;
	position: relative;
	/deep/swiper-item,uni-swiper-item,swiper{
		height: 278rpx;
	}
	/deep/uni-image,/deep/image,/deep/.easy-loadimage{
		width: 650rpx;
		height: 278rpx;
		border-radius: 16rpx;
	}
	.more-btn{
		top: 13rpx;
	}
	/deep/.uni-swiper-wrapper{
		overflow: hidden;
	}
}
.topic_swiper{
	width: 650rpx;
	margin: 0 auto;

}
.page-index {
	display: flex;
	flex-direction: column;
	min-height: 100%;
	background: #f5f5f5;

	.ad {
		width: 710rpx;
		height: 156rpx;
		margin: 10rpx auto 20rpx auto;

		image {
			width: 100%;
			height: 100%;
		}
	}
	.header {
		width: 100%;
		background: #ffffff;
		.btn {
			position: relative;
			.iconfont {
				font-size: 45rpx;
			}
		}
		.iconnum {
			min-width: 6px;
			color: #fff;
			border-radius: 15rpx;
			position: absolute;
			right: -10rpx;
			top: -10rpx;
			font-size: 10px;
			padding: 0 4px;
		}
		.serch-wrapper {
			align-items: center;
			padding: 20rpx 30rpx 0 30rpx;
			.logo {
				width: 127rpx;
				height: 46rpx;
			}
			image {
				width: 118rpx;
				height: 42rpx;
			}

			.input,
			.uninput {
				display: flex;
				align-items: center;
				max-width: 490rpx;
				min-width: 460rpx;
				height: 64rpx;
				padding: 0 0 0 30rpx;
				background: rgba(237, 237, 237, 1);
				border: 1px solid rgba(241, 241, 241, 1);
				border-radius: 32rpx;
				color: #bbbbbb;
				font-size: 28rpx;

				.iconfont {
					margin-right: 20rpx;
				}
			}

			.uninput {
				min-width: 610rpx;
				max-width: 620rpx;
			}
		}

		.tabNav {
			padding-top: 24rpx;
		}
	}

	/*直播*/
	.live-count {
		background-color: #fff;
		margin-bottom: 20rpx;
		border-radius: 16rpx;
		padding: 20rpx 0 26rpx 20rpx;
		box-shadow: 4rpx 2rpx 12rpx 2rpx rgba(0, 0, 0, 0.03);
	}
	.plant-count{
		background: #ffffff;
		border-radius: 16rpx;
		box-shadow: 4rpx 2rpx 12rpx 2rpx rgba(0, 0, 0, 0.03);
	}
	.live-wrapper {
		position: relative;
		width: 100%;
		overflow: hidden;
		border-radius: 16rpx;

		image {
			width: 100%;
			height: 400rpx;
		}

		.live-top {
			z-index: 20;
			position: absolute;
			left: 0;
			top: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			width: 120rpx;
			height: 32rpx;

			&.playRadius {
				border-radius: 0;
			}

			&.notPlayRadius {
				border-radius: 0rpx 0px 18rpx 0px;
			}

			image {
				width: 30rpx;
				height: 30rpx;
				margin-right: 6rpx;
				/* #ifdef H5 */
				display: block;
				/* #endif */
			}
		}

		.broadcast-time {
			z-index: 20;
			position: absolute;
			left: 110rpx;
			top: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			width: 160rpx;
			height: 36rpx;
			background: rgba(0, 0, 0, 0.4);
			font-size: 22rpx;
			border-radius: 0 0 18rpx 0;
		}

		.live-title {
			position: absolute;
			left: 0;
			bottom: 6rpx;
			width: 100%;
			height: 70rpx;
			line-height: 70rpx;
			text-align: center;
			font-size: 30rpx;
			color: #fff;
			background: rgba(0, 0, 0, 0.35);
		}

		&.mores {
			width: 100%;
			.item {
				position: relative;
				width: 280rpx;
				height: 224rpx;
				display: inline-block;
				border-radius: 16rpx;
				overflow: hidden;
				margin-right: 20rpx;
				image {
					width: 320rpx;
					height: 180rpx;
					border-radius: 16rpx;
				}

				.live-title {
					height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					font-size: 22rpx;
				}

				.live-top {
					width: 110rpx;
					height: 32rpx;
					font-size: 22rpx;

					image {
						width: 20rpx;
						height: 20rpx;
					}
				}
			}
		}
		&.plant{
			padding: 20rpx;
			.item{
				position: relative;
				width: 280rpx;
				height: 280rpx;
				display: inline-block;
				border-radius: 16rpx;
				overflow: hidden;
				margin-right: 20rpx;
				/deep/image,.easy-loadimage,uni-image {
					width: 280rpx;
					height: 280rpx;
					border-radius: 16rpx;
				}
				&::before{
					content: "";
					display: block;
					width: 280rpx;
					height: 280rpx;
					background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
					position: absolute;
					top: 0;
					left: 0;
					z-index: 10;
				}
				.item_text{
					width: 260rpx;
					padding: 17rpx 15rpx;
					position: absolute;
					left: 0;
					bottom: 0;
					color: #ffffff;
					z-index: 12;
					image {
						width: 34rpx;
						height: 34rpx;
						border-radius: 100%;
					}
					.text_name{
						font-size: 24rpx;
						width: 260rpx;
						word-break: normal;
						word-wrap: break-word;
						display: block;
					}
					.text_count{
						margin-top: 12rpx;
						align-items: center;
						.name{
							font-size: 18rpx;
							margin-left: 10rpx;
							max-width: 200rpx;
						}
					}
				}
			}
		}
	}

	/* #ifdef MP || APP-PLUS */
	.mp-header {
		z-index: 999;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		/* #ifdef H5 */
		padding-bottom: 20rpx;
		/* #endif */
		// background: linear-gradient(90deg, $bg-star 50%, $bg-end 100%);
		background-color: #fff;

		.serch-wrapper {
			height: 100%;
			align-items: center;
			padding: 0 50rpx 0 53rpx;

			image {
				width: 118rpx;
				height: 42rpx;
				margin-right: 30rpx;
			}

			.input,
			.uninput {
				display: flex;
				align-items: center;
				/* #ifndef APP-PLUS */
				width: 305rpx;
				/* #endif */
				/* #ifdef APP-PLUS */
				flex: 1;
				/* #endif */
				height: 58rpx;
				padding: 0 0 0 30rpx;
				background: rgba(247, 247, 247, 1);
				border: 1px solid rgba(241, 241, 241, 1);
				border-radius: 29rpx;
				color: #bbbbbb;
				font-size: 28rpx;

				.iconfont {
					margin-right: 20rpx;
				}
			}

			.uninput {
				min-width: 460rpx;
				max-width: 480rpx;
			}
		}
	}

	/* #endif */
	.page_swiper {
		position: relative;
		width: 100%;
		/* #ifdef MP  */
		height: auto;
		/* #endif */
		/* #ifdef H5 || APP-PLUS */
		height: 320rpx;
		/* #endif */
		margin: 0 auto;
		border-radius: 10rpx;
		overflow-x: hidden;
		/* #ifdef MP */
		z-index: 10;
		/* #endif */

		.swiper-item, image, .acea-row.row-between-wrapper {
			width: 100%;
			height:100%;

			margin: 0 auto;
			border-radius: 10rpx;
		}
		image {
			transform: scale(0.93);
			transition: all 0.6s ease;
		}
		swiper-item.active {
			image {
				transform: scale(1);
			}
		}
	}
	.page_content {
		/* #ifdef MP || APP-PLUS */
		padding-top: 270rpx;

		/* #endif */
		.page_bg{
			background: linear-gradient(180deg, #fff 0%, #f5f5f5 100%);
		}


		.nav {
			padding: 0 0rpx 30rpx;
			flex-wrap: wrap;
			/* #ifdef MP */
			margin-top: 0;
			/* #endif */
			/* #ifdef H5 */
			margin-top: 0;

			/* #endif */
			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 20%;
				margin-top: 30rpx;

				image {
					width: 82rpx;
					height: 82rpx;
				}
			}
		}

		.live-wrapper {
			position: relative;
			width: 100%;
			overflow: hidden;
			border-radius: 16rpx;

			image {
				width: 100%;
				height: 400rpx;
			}

			.live-top {
				z-index: 20;
				position: absolute;
				left: 0;
				top: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
				width: 110rpx;
				height: 36rpx;

				&.playRadius {
					border-radius: 0;
				}

				&.notPlayRadius {
					border-radius: 0rpx 0px 18rpx 0px;
				}

				image {
					width: 30rpx;
					height: 30rpx;
					margin-right: 10rpx;
					/* #ifdef H5 */
					display: block;
					/* #endif */
				}
			}

			.live-title {
				position: absolute;
				left: 0;
				bottom: 6rpx;
				width: 100%;
				height: 36rpx;
				line-height: 36rpx;
				text-align: center;
				font-size: 22rpx;
				color: #fff;
				background: rgba(0, 0, 0, 0.35);
			}

			&.mores {
				width: 100%;

				.item {
					position: relative;
					width: 280rpx;
					display: inline-block;
					border-radius: 16rpx;
					overflow: hidden;
					margin-right: 20rpx;

					image {
						width: 280rpx;
						height: 224rpx;
						border-radius: 16rpx;
					}

					.live-title {
						height: 36rpx;
						line-height: 36rpx;
						text-align: center;
						font-size: 22rpx;
					}

					.live-top {
						width: 110rpx;
						height: 36rpx;
						font-size: 22rpx;

						image {
							width: 20rpx;
							height: 20rpx;
						}
					}
				}
			}
		}

		.spike-box {
			margin-top: 20rpx;
			padding: 23rpx 20rpx;
			border-radius: 24rpx;
			background-color: #fff;
			overflow: hidden;
			box-shadow: 0px 0px 16px 3px rgba(0, 0, 0, 0.04);

			.hd {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.left {
					display: flex;
					align-items: center;
					width: 500rpx;

					.icon {
						width: 38rpx;
						height: 38rpx;
						margin-right: 8rpx;
					}

					.title {
						width: 134rpx;
						height: 33rpx;
					}
				}

				.more {
					font-size: 26rpx;
					color: #999;

					.iconfont {
						margin-left: 6rpx;
						font-size: 25rpx;
					}
				}
			}

			.spike-wrapper {
				width: 100%;
				margin-top: 27rpx;

				.spike-item {
					display: inline-block;
					width: 222rpx;
					margin-right: 20rpx;

					.img-box {
						position: relative;
						height: 222rpx;

						image {
							width: 100%;
							height: 222rpx;
							border-radius: 16rpx;
						}

						.msg {
							position: absolute;
							left: 10rpx;
							bottom: 16rpx;
							width: 86rpx;
							height: 30rpx;
							background: rgba(255, 255, 255, 1);
							border: 1px solid rgba(255, 109, 96, 1);
							border-radius: 6rpx;
							font-size: 20rpx;
							color: $theme-color;
						}
					}

					.info {
						margin-top: 8rpx;
						padding: 0 10rpx;

						.name {
							font-size: 28rpx;
						}

						.price-box {
							display: flex;
							align-items: center;
							justify-content: center;

							.tips {
								display: flex;
								align-items: center;
								justify-content: center;
								width: 28rpx;
								height: 28rpx;
								background-color: $theme-color;
								color: #fff;
								font-size: 20rpx;
								border-radius: 2px;
							}

							.price {
								display: flex;
								margin-left: 10rpx;
								color: $theme-color;
								font-size: 28rpx;
								font-weight: bold;

								text {
									font-size: 18rpx;
								}
							}
						}
					}
				}
			}
		}

		.barg {
			width: 100%;
			height: 478rpx;
			margin-top: 20rpx;
			padding-left: 20rpx;
			background-size: 100% 100%;

			.title {
				display: flex;
				align-items: center;
				justify-content: center;
				padding-top: 42rpx;

				image {
					width: 463rpx;
					height: 39rpx;
				}
			}

			.barg-swiper {
				margin-top: 43rpx;
				padding-right: 20rpx;

				.wrapper {
					display: flex;
				}

				.list-box {
					flex-shrink: 0;
					width: 210rpx;
					background-color: #fff;
					border-radius: 16rpx;
					overflow: hidden;
					padding-bottom: 18rpx;
					margin-right: 20rpx;

					image {
						width: 100%;
						height: 210rpx;
					}

					.info-txt {
						width: 100%;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						padding-top: 15rpx;

						.price {
							font-weight: 700;
							color: $theme-color;
						}

						.txt {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 136rpx;
							height: 33rpx;
							margin-top: 10rpx;
							background: linear-gradient(90deg, $bg-star 0%, $bg-end 100%);
							border-radius: 17px;
							font-size: 22rpx;
							color: #fff;
						}
					}
				}

				.more-box {
					flex-shrink: 0;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 80rpx;
					background-color: #fff;
					border-radius: 16rpx;

					image {
						width: 24rpx;
						height: 24rpx;
						margin-top: 10rpx;
					}

					.txt {
						display: block;
						writing-mode: vertical-lr;
						font-size: 26rpx;
						line-height: 1.2;
					}
				}
			}
		}

		.group-wrapper {
			padding: 26rpx 20rpx;
			margin-top: 20rpx;
			background: #fff;
			border-radius: 24rpx;

			.hd {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.left {
					display: flex;
					align-items: center;

					.icon {
						width: 38rpx;
						height: 38rpx;
						margin-right: 8rpx;
					}

					.title {
						width: 134rpx;
						height: 33rpx;
					}

					.person {
						display: flex;
						align-items: center;
						margin-left: 40rpx;

						.avatar-box {
							display: flex;
							align-items: center;

							image {
								width: 30rpx;
								height: 30rpx;
								border-radius: 50%;
								margin-right: -10rpx;
							}
						}

						.num {
							margin-left: 18rpx;
							font-size: 26rpx;
							color: #999999;
						}
					}
				}

				.more {
					font-size: 26rpx;
					color: #999;

					.iconfont {
						margin-left: 6rpx;
						font-size: 25rpx;
					}
				}
			}

			.group-scroll {
				width: 100%;
				margin-top: 25rpx;

				.group-item {
					display: inline-block;
					width: 222rpx;
					margin-right: 20rpx;
					box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.03);
					border-radius: 16rpx;

					image {
						width: 100%;
						height: 222rpx;
						border-radius: 16rpx 16rpx 0 0;
					}

					.info {
						padding: 8rpx 13rpx;

						.name {
							font-size: 24rpx;
						}

						.price-box {
							display: flex;
							align-items: center;
							margin-top: 10rpx;

							.tips {
								display: flex;
								align-items: center;
								justify-content: center;
								width: 76rpx;
								height: 30rpx;
								margin-right: 6rpx;
								background: linear-gradient(90deg, rgba(255, 0, 0, 0.1) 0%, rgba(255, 84, 0, 0.1) 100%);
								border-radius: 2px;
								font-size: 20rpx;
								color: $theme-color;
							}

							.price {
								font-size: 26rpx;
								color: $theme-color;
								font-weight: 700;

								text {
									font-size: 20rpx;
								}
							}
						}
					}

					.bom-btn {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 100%;
						height: 48rpx;
						background: linear-gradient(90deg, $bg-star 0%, $bg-end 100%);
						border-radius: 0px 0px 16rpx 16rpx;
						color: #fff;
					}
				}
			}
		}

		.boutique {
			margin-top: 20rpx;

			swiper,
			swiper-item,
			.slide-image {
				width: 100%;
				height: 240rpx;
				border-radius: 12rpx;
			}
		}

		.index-product-wrapper {
			.nav-bd {
				display: flex;
				align-items: center;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 25%;

					.txt {
						font-size: 32rpx;
						color: #282828;
					}

					.label {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 124rpx;
						height: 32rpx;
						margin-top: 5rpx;
						font-size: 24rpx;
						color: #999;
					}

					&.active {
						color: $theme-color;

						.label {
							background: linear-gradient(90deg, $bg-star 0%, $bg-end 100%);
							border-radius: 16rpx;
							color: #fff;
						}
					}
				}
			}

			.list-box {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;

				.item {
					width: 345rpx;
					margin-bottom: 20rpx;
					background-color: #fff;
					border-radius: 10px;
					overflow: hidden;

					image {
						width: 100%;
						height: 345rpx;
					}

					.text-info {
						padding: 10rpx 20rpx 15rpx;

						.title {
							color: #222222;
						}

						.old-price {
							margin-top: 8rpx;
							font-size: 26rpx;
							color: #aaaaaa;
							text-decoration: line-through;

							text {
								margin-right: 2px;
								font-size: 20rpx;
							}
						}

						.price {
							display: flex;
							align-items: flex-end;
							color: $theme-color;
							font-size: 34rpx;
							font-weight: 800;

							text {
								padding-bottom: 4rpx;
								font-size: 24rpx;
								font-weight: normal;
							}

							.txt {
								display: flex;
								align-items: center;
								justify-content: center;
								width: 28rpx;
								height: 28rpx;
								margin-left: 15rpx;
								margin-bottom: 10rpx;
								border: 1px solid $theme-color;
								border-radius: 4rpx;
								font-size: 22rpx;
								font-weight: normal;
							}
						}
					}
				}

				&.on {
					display: flex;
				}
			}
		}
	}
}

.plant_bg{
	margin-bottom: 0;
	border-radius: 0;
	padding: 24rpx 20rpx 27rpx 30rpx;
	background-image: url('data:image/png;base64,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');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	.more-btn{
		top: 22rpx;
	}

}
.activity_pic {
	margin-left: 20rpx;
	padding-left: 20rpx;
	position: relative;

	&::before {
		content: '';
		display: inline-block;
		width: 2rpx;
		height: 40rpx;
		background: #dcdcdc;
		position: absolute;
		top: 0;
		left: 0;
	}

	.picture {
		display: inline-block;
	}

	.avatar {
		width: 42rpx;
		height: 42rpx;
		line-height: 20rem;
		display: inline-block;
		// background-image: url("/static/images/f.png");
		background-repeat: no-repeat;
		background-size: center/cover;
		// background: #2ddcd3 no-repeat center/cover;
		position: relative;
		text-align: center;
		color: #fff;
		font-weight: 600;
		vertical-align: bottom;
		font-size: 0.875rem;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		border-radius: 50%;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: 0 0;
		margin-right: -10rpx;
		box-shadow: 0 0 0 1px #fff;
	}

	.pic_count {
		margin-left: 30rpx;
		color: #999999;
		font-size: 26rpx;
		position: relative;
		top: -4rpx;
	}
}

.productList {
	background-color: #f1f1f1;

	.sort {
		width: 710rpx;
		max-height: 380rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 16rpx;
		padding: 0 0rpx 30rpx;
		flex-wrap: wrap;
		margin: 25rpx auto 0 auto;
		padding-top: 8rpx;

		&.no_pad {
			padding: 0;
		}
		.item {
			width: 20%;
			margin-top: 30rpx;
			text-align: center;
			.pictrues {
				width: 90rpx;
				height: 90rpx;
				background: rgba(248, 248, 248, 1);
				border-radius: 50%;
				margin: 0 auto;
			}
			image {
				width: 90rpx;
				height: 90rpx;
			}

			.text {
				color: #272727;
				font-size: 24rpx;
				margin-top: 10rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

		}
	}
}

.productList .list {
	padding: 0 20rpx;
}

.productList .list.on {
	background-color: #fff;
	border-top: 1px solid #f6f6f6;
}

.productList .list .item {
	width: 345rpx;
	margin-top: 20rpx;
	background-color: #fff;
	border-radius: 10rpx;
	.name{
		display: flex;
		align-items: center;
		.name_text{
			display: inline-block;
			max-width: 200rpx;
		}
	}
}

.productList .list .item.on {
	width: 100%;
	display: flex;
	border-bottom: 1rpx solid #f6f6f6;
	padding: 30rpx 0;
	margin: 0;
}

.productList .list .item .pictrue {
	position: relative;
	width: 100%;
	height: 345rpx;
}

.productList .list .item .pictrue.on {
	width: 180rpx;
	height: 180rpx;
}

.productList .list .item .pictrue image,
.productList .list .item .pictrue uni-image,
.productList .list .item .pictrue .easy-loadimage{
	 width: 100%;
	 height: 100%;
	 border-radius: 10rpx 10rpx 0 0;
}

.productList .list .item .pictrue image.on {
	border-radius: 6rpx;
}

.productList .list .item .text {
	padding: 14rpx 17rpx 26rpx 17rpx;
	font-size: 28rpx;
	color: #212121;
}

.productList .list .item .text.on {
	width: 508rpx;
	padding: 0 0 0 22rpx;
}

.productList .list .item .text .money {
	font-size: 26rpx;
	font-weight: bold;
	margin-top: 8rpx;
}

.productList .list .item .text .coupon {
	background: rgba(255, 248, 247, 1);
	border: 1px solid rgba(233, 51, 35, 1);
	border-radius: 4rpx;
	font-size: 20rpx;
	margin-left: 18rpx;
	padding: 1rpx 4rpx;
}

.productList .list .item .text .money.on {
	margin-top: 50rpx;
}

.productList .list .item .text .money .num {
	font-size: 34rpx;
}

.productList .list .item .text .vip {
	font-size: 22rpx;
	color: #aaa;
	margin-top: 7rpx;
}

.productList .list .item .text .vip.on {
	margin-top: 12rpx;
}

.productList .list .item .text .vip .vip-money {
	font-size: 24rpx;
	color: #282828;
	font-weight: bold;
}

.productList .list .item .text .vip .vip-money image {
	width: 46rpx;
	height: 21rpx;
	margin-left: 4rpx;
}

.pictrue {
	position: relative;
}

.fixed {
	z-index: 100;
	position: fixed;
	left: 0;
	top: 0;
	background-color: #fff;
	box-shadow: 0 10rpx 20rpx -5rpx rgba(0, 0, 0, 0.06);
	// background: linear-gradient(90deg, red 50%, #ff5400 100%);
}

.mores-txt {
	width: 100%;
	align-items: center;
	justify-content: center;
	height: 70rpx;
	color: #999;
	font-size: 24rpx;

	.iconfont {
		margin-top: 2rpx;
		font-size: 20rpx;
	}
}
.menu-txt {
	font-size: 24rpx;
	color: #454545;
}
.mp-bg {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 330rpx;
	// background: linear-gradient(90deg, #fff 50%, #fff 100%);
	// border-radius: 0 0 30rpx 30rpx;
}
.combination-item {
	width: 328rpx;
	height: 180rpx;
	display: inline-block;
	background-size: 100%;
	position: relative;
	background-size: cover;
	border-radius: 16rpx;
	.img-box {
		width: 122rpx;
		height: 122rpx;
		position: absolute;

		image,.easy-loadimage,uni-image {
			width: 122rpx;
			height: 122rpx;
		}
	}

	.name {
		font-size: 30rpx;
		color: #333333;
		font-weight: bold;
		line-height: 32rpx;
	}

	.price {
		display: block;
		font-size: 30rpx;
		font-weight: bold;
		margin-top: 8rpx;
		color: #e93323;

		text {
			font-size: 20rpx;
		}
	}

	.gocom_btn {
		display: block;
		margin-top: 6rpx;
		color: #fff;
		font-size: 22rpx;
		font-weight: bold;
		width: 100rpx;
		line-height: 30rpx;
		text-align: center;
		border-radius: 16rpx;

		text {
			font-weight: normal;
			font-size: 16rpx;
		}
	}

	&:nth-child(1) {
		height: 378rpx;
		padding: 20rpx 20rpx 28rpx;
		float: left;
		background-image: url(data:image/png;base64,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);

		.img-box {
			width: 210rpx;
			height: 210rpx;
			right: 18rpx;
			bottom: 18rpx;

			image,.easy-loadimage,uni-image {
				width: 210rpx;
				height: 210rpx;
			}
		}

		.gocom_btn {
			background: linear-gradient(90deg, #fd5d48 0%, #f63724 100%);
		}
	}

	&:nth-child(2),
	&:nth-child(3) {
		float: right;
		padding: 20rpx 18rpx;

		.name {
			width: 148rpx;
		}

		.img-box {
			right: 14rpx;
			bottom: 14rpx;
		}
	}

	&:nth-child(2) {
		background-image: url(data:image/png;base64,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);

		.gocom_btn {
			background: linear-gradient(90deg, #fdca1a 0%, #f7b21f 100%);
		}
	}

	&:nth-child(3) {
		margin-top: 18rpx;
		background-image: url(data:image/png;base64,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);

		.img-box {
			right: 14rpx;
			bottom: 14rpx;
		}

		.gocom_btn {
			background: linear-gradient(90deg, #ffb052 0%, #fe961a 100%);
		}
	}
}
</style>
