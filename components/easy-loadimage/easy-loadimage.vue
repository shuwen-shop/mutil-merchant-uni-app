<template>
    <view class="easy-loadimage" :id="uid">
        <image class="origin-img" :src="imageSrc" mode="aspectFill" v-if="loadImg&&!isLoadError" v-show="showImg"
        	:class="{'no-transition':!openTransition,'show-transition':showTransition&&openTransition}"
        	@load="handleImgLoad" @error="handleImgError">
        </image>
       <view class="loadfail-img" v-else-if="isLoadError" :style="{ 'background-image': `url(${domain}/static/images/loadfail.png)`}"></view>
       <view :class="['loading-img','spin-circle',loadingMode]" v-show="!showImg&&!isLoadError" :style="{ 'background-image': `url(${domain}/static/images/loading.gif)`}"></view>
    </view>
</template>
<script>
// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2024 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import { throttle } from '@/libs/uniApi';
import { HTTP_REQUEST_URL } from '@/config/app';
// 生成全局唯一id
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    })
}
export default{
    props:{
			imageSrc:{
				type: String,
			},
			mode:{
				type: String,
			},
			loadingMode:{
				type: String,
				default:'looming-gray'
			},
			openTransition:{
				type: Boolean,
				default:true,
			},
			viewHeight:{
				type:Number,
				default() {
						return uni.getSystemInfoSync().windowHeight;
				}
			}
    },
    data(){
			const that = this;
			return {
				domain: HTTP_REQUEST_URL,
				uid: 'uid-' + generateUUID(),
				loadImg: false,
				showImg: false,
				isLoadError: false,
				borderLoaded: 0,
				showTransition: false,
				scrollFn: throttle(function() {
					// 加载img时才执行滚动监听判断是否可加载
					if (that.loadImg || that.isLoadError) return;
					const id = that.uid
					const query = uni.createSelectorQuery().in(that);
					query.select('#' + id).boundingClientRect(data => {
						if (!data) return;
						
						if (data.top - that.viewHeight < 0) {
							that.loadImg = !!that.imageSrc;
							that.isLoadError = !that.loadImg;
						}
					}).exec()
				}, 200)
			}
    },
    methods:{
			init() {
				this.$nextTick(this.onScroll)
			},
			handleBorderLoad(){
				this.borderLoaded = 1;
			},
			handleBorderError(){
				this.borderLoaded = 2;
			},
			handleImgLoad(e) {
				this.showImg = true;
				setTimeout(() => {
					this.showTransition = true
				}, 50)
			},
			handleImgError(e) {
				this.isLoadError = true;
			},
			onScroll() {
				this.scrollFn();
			},
    },
    mounted() {
      this.init()
      uni.$on('scroll', this.scrollFn);
      this.onScroll()
    },
		beforeDestroy() {
			uni.$off('scroll', this.scrollFn);
		}
}
</script>

<style scoped>
    /* 官方优化图片tips */
    image{
        will-change: transform
    } 
    /* 渐变过渡效果处理 */
    image.origin-img{
			width: 100%;
			height: 100%;
			opacity: 0.3;
			max-height: 360rpx;
    }
    image.origin-img.show-transition{
			transition: opacity .5s;
			opacity: 1;
    }
    image.origin-img.no-transition{
      opacity: 1;
    }
    /* 加载失败、加载中的占位图样式控制 */
    .loadfail-img{
			 height: 100%;
			 background-repeat: no-repeat;
			 background-size: 50%;
			 background-position: center;
    }
    .loading-img{
      height: 100%;
			background-position: center;
    }
    /* 转圈 */
    .spin-circle{
			background-repeat: no-repeat;
			background-size: 60%;
    }
    /* 动态灰色若隐若现 */
    .looming-gray{
			animation: looming-gray 1s infinite linear;
			background-color: #e3e3e3;
    }
    @keyframes looming-gray{
			0%   {background-color:#e3e3e3aa;}
			50%  {background-color:#e3e3e3;}
			100% {background-color:#e3e3e3aa;}
    } 
    /* 骨架屏1 */
    .skeleton-1{
			background-color: #e3e3e3;
			background-image: linear-gradient(100deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 80%);
			background-size: 100rpx 100%;
			background-repeat: repeat-y;
			background-position:0 0;
			animation: skeleton-1 .6s infinite;
    }
    @keyframes skeleton-1 {
			to {
					background-position: 200% 0;
			}
    }
    /* 骨架屏2 */
    .skeleton-2{
			background-image: linear-gradient(-90deg, #fefefe 0%, #e6e6e6 50%,#fefefe 100%);
			background-size: 400% 400%;
			background-position:0 0;
			animation: skeleton-2 1.2s ease-in-out infinite;
    }
    @keyframes skeleton-2{
			to {
				background-position: -135% 0;
			}
    }
</style>

