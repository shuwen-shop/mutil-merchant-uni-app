<template>
	<view style="position: relative;">
		<view v-if="type === '2'" class="verify-img-out" :style="{height: (parseInt(imgSize.height) + vSpace) + 'px'}">
			<view class="verify-img-panel" :style="{width: imgSize.width,
                                                   height: imgSize.height,}">

				<image :src="backImgBase?('data:image/png;base64,'+backImgBase):defaultImg" alt=""
					style="width:100%;height:100%;display:block"></image>
				<view class="verify-refresh" @click="refresh" v-show="showRefresh">
					<text class="iconfont icon-refresh"></text>
				</view>
				<transition name="tips">
					<text class="verify-tips" v-if="tipWords" :class="passFalg ? 'suc-bg':'err-bg'">{{tipWords}}</text>
				</transition>
			</view>
		</view>

		<!-- 公共部分 -->
		<view class="verify-bar-area" :style="{width: imgSize.width,
                                              height: '40px',
                                              'line-height':'40px'}">
			<text class="verify-msg" v-text="text"></text>
			<view class="verify-left-bar"
				:style="{width: leftBarWidth?leftBarWidth:'40px', height: '40px', 'border-color': leftBarBorderColor, transaction: transitionWidth}">
				<text class="verify-msg" v-text="finishText"></text>
				<view class="verify-move-block" @touchstart="start" @touchend="end" @touchmove="move"
					:style="{width:'40px', height: '40px', 'background-color': moveBlockBackgroundColor, left: moveBlockLeft, transition: transitionLeft}">
					<text :class="['verify-icon iconfont', iconClass]" :style="{color: iconColor}"></text>
					<view v-if="type === '2'" class="verify-sub-block" :style="{'width':Math.floor(parseInt(imgSize.width)*47/310)+ 'px' ,
                                  'height': imgSize.height,
                                  'top':'-' + (parseInt(imgSize.height) + vSpace) + 'px',
                                  }">
						<image :src="'data:image/png;base64,'+blockBackImgBase" alt=""
							style="width:100%;height:100%;display:block"></image>
					</view>
				</view>
			</view>
		</view>
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
	/**
	 * VerifySlide
	 * @description 滑块
	 * */
	import {
		aesEncrypt
	} from "./../utils/ase.js"
	import {
		getAjcaptcha,
		ajcaptchaCheck
	} from '@/api/api.js';

	export default {
		name: 'VerifySlide',
		props: {
			captchaType: {
				type: String,
			},
			type: {
				type: String,
				default: '1'
			},
			//弹出式pop，固定fixed
			mode: {
				type: String,
				default: 'fixed'
			},
			vSpace: {
				type: Number,
				default: 5
			},
			explain: {
				type: String,
				default: '向右滑动完成验证'
			},
			imgSize: {
				type: Object,
				default () {
					return {
						width: '310px',
						height: '155px'
					}
				}
			},
			blockSize: {
				type: Object,
				default () {
					return {
						width: '50px',
						height: '50px'
					}
				}
			},
			barSize: {
				type: Object,
				default () {
					return {
						width: '100%',
						height: '40px'
					}
				}
			},
			defaultImg: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				secretKey: '', //后端返回的加密秘钥 字段
				passFalg: false, //请求通过与否
				backImgBase: '', //验证码背景图片
				blockBackImgBase: '', //验证滑块的背景图片
				backToken: "", //后端返回的唯一token值
				startMoveTime: "", //移动开始的时间
				endMovetime: '', //移动结束的时间
				tipsBackColor: '', //提示词的北京颜色
				tipWords: '',
				text: '',
				finishText: '',
				setSize: {
					imgHeight: 0,
					imgWidth: 0,
					barHeight: 0,
					barWidth: 0
				},
				top: 0,
				left: 0,
				moveBlockLeft: undefined,
				leftBarWidth: undefined,
				// 移动中样式
				moveBlockBackgroundColor: undefined,
				leftBarBorderColor: '#ddd',
				iconColor: undefined,
				iconClass: 'icon-right',
				status: false, //鼠标状态
				isEnd: false, //是够验证完成
				showRefresh: true,
				transitionLeft: '',
				transitionWidth: ''
			}
		},
		methods: {
			init() {
				this.text = this.explain
				this.getPictrue();
				this.$nextTick(() => {
					this.$parent.$emit('ready', this)
				})
			},

			//鼠标按下
			start: function(e) {
				this.startMoveTime = new Date().getTime(); //开始滑动的时间
				if (this.isEnd == false) {
					this.text = ''
					this.moveBlockBackgroundColor = '#337ab7'
					this.leftBarBorderColor = '#337AB7'
					this.iconColor = '#fff'
					e.stopPropagation();
					this.status = true;
				}
			},
			//鼠标移动
			move: function(e) {
				var query = uni.createSelectorQuery().in(this);
				this.barArea = query.select('.verify-bar-area')
				var bar_area_left, barArea_offsetWidth;
				this.barArea.boundingClientRect(data => {
					bar_area_left = Math.ceil(data.left)
					barArea_offsetWidth = Math.ceil(data.width)

					if (this.status && this.isEnd == false) {
						if (!e.touches) { //兼容移动端
							var x = Math.ceil(e.clientX);
						} else { //兼容PC端
							var x = Math.ceil(e.touches[0].pageX);
						}
						// var bar_area_left = this.getLeft(this.barArea);

						var move_block_left = x - bar_area_left //小方块相对于父元素的left值
						if (this.type !== '1') { //图片滑动
							if (move_block_left >= barArea_offsetWidth - parseInt(parseInt(this.blockSize
									.width) / 2) - 2) {
								move_block_left = barArea_offsetWidth - parseInt(parseInt(this.blockSize
									.width) / 2) - 2;
							}
						}

						if (move_block_left <= 0) {
							move_block_left = parseInt(parseInt(this.blockSize.width) / 2);
						}

						//拖动后小方块的left值
						this.moveBlockLeft = (move_block_left - parseInt(parseInt(this.blockSize.width) / 2)) +
							"px"
						this.leftBarWidth = (move_block_left - parseInt(parseInt(this.blockSize.width) / 2)) +
							"px"

					}
				}).exec();
			},

			//鼠标松开
			end: function() {
				this.endMovetime = new Date().getTime();
				var _this = this;
				//                判断是否重合
				if (this.status && this.isEnd == false) {
					if (this.type !== '1') { //图片滑动
						var moveLeftDistance = parseInt((this.moveBlockLeft || '').replace('px', ''));

						moveLeftDistance = moveLeftDistance * 310 / parseInt(this.imgSize.width)

						var captchaVerification = this.secretKey ? aesEncrypt(this.backToken + '---' + JSON.stringify({
							x: moveLeftDistance,
							y: 5.0
						}), this.secretKey) : this.backToken + '---' + JSON.stringify({
							x: moveLeftDistance,
							y: 5.0
						})
						let data = {
							captchaType: this.captchaType,
							"pointJson": this.secretKey ? aesEncrypt(JSON.stringify({
								x: moveLeftDistance,
								y: 5.0
							}), this.secretKey) : JSON.stringify({
								x: moveLeftDistance,
								y: 5.0
							}),
							"token": this.backToken
						}
						ajcaptchaCheck(data).then((result) => {
							let res = result.data
							this.moveBlockBackgroundColor = '#5cb85c'
							this.leftBarBorderColor = '#5cb85c'
							this.iconColor = '#fff'
							this.iconClass = 'icon-check'
							this.showRefresh = true
							this.isEnd = true;
							setTimeout(() => {
								if (this.mode == 'pop') {
									this.$parent.clickShow = false;
								}
								this.refresh();
							}, 1500)
							this.passFalg = true
							this.tipWords =
								`${((this.endMovetime-this.startMoveTime)/1000).toFixed(2)}s验证成功`
							setTimeout(() => {
								this.tipWords = ""
								this.$emit('success', {
									captchaVerification
								})
							}, 1000)
						}).catch(res => {
							this.moveBlockBackgroundColor = '#d9534f'
							this.leftBarBorderColor = '#d9534f'
							this.iconColor = '#fff'
							this.iconClass = 'icon-close'
							this.passFalg = false
							setTimeout(() => {
								this.refresh();
							}, 1000);
							this.$parent.$emit('error', this)
							this.tipWords = "验证失败"
							setTimeout(() => {
								this.tipWords = ""
							}, 1000)
						})
					}
					this.status = false;
				}
			},
			refresh: function() {
				this.showRefresh = true
				this.finishText = ''
				this.transitionLeft = 'left .3s'
				this.moveBlockLeft = 0
				this.leftBarWidth = false
				this.transitionWidth = 'width .3s'
				this.leftBarBorderColor = '#ddd'
				this.moveBlockBackgroundColor = '#fff'
				this.iconColor = '#000'
				this.iconClass = 'icon-right'
				this.getPictrue()
				this.isEnd = false
				setTimeout(() => {
					this.transitionWidth = ''
					this.transitionLeft = ''
					this.text = this.explain
				}, 300)
			},

			//获取left值
			getLeft: function(node) {
				let leftValue = 0;
				while (node) {
					leftValue += node.offsetLeft;
					node = node.offsetParent;
				}
				let finalvalue = leftValue;
				return finalvalue;
			},

			// 请求背景图片和验证图片
			getPictrue() {
				let data = {
					captchaType: this.captchaType,
					clientUid: uni.getStorageSync('slider'),
					ts: Date.now(), // 现在的时间戳
				}
				getAjcaptcha(data).then((result) => {
					let res = result.data
					this.backImgBase = res.originalImageBase64
					this.blockBackImgBase = res.jigsawImageBase64
					this.backToken = res.token
					this.secretKey = res.secretKey
				}).catch(() => {
					this.backImgBase = null
					this.blockBackImgBase = null
				})
			},
		},
		watch: {
			// type变化则全面刷新
			type: {
				immediate: true,
				handler() {
					this.init()
				}
			}
		},
		mounted() {},
	}
</script>
<style scoped>
	.verifybox {
		position: relative;
		box-sizing: border-box;
		border-radius: 2px;
		border: 1px solid #e4e7eb;
		background-color: #fff;
		box-shadow: 0 0 10px rgba(0, 0, 0, .3);
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.verifybox-top {
		padding: 0 15px;
		height: 50px;
		line-height: 50px;
		text-align: left;
		font-size: 16px;
		color: #45494c;
		border-bottom: 1px solid #e4e7eb;
		box-sizing: border-box;
	}

	.verifybox-bottom {
		/* padding: 15px; */
		box-sizing: border-box;
	}

	.verifybox-close {
		position: absolute;
		top: 13px;
		right: 9px;
		width: 24px;
		height: 24px;
		text-align: center;
		cursor: pointer;
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1001;
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, .3);
		/* display: none; */
		transition: all .5s;
	}

	.verify-tips {
		position: absolute;
		left: 0px;
		bottom: 0px;
		width: 100%;
		height: 30px;
		background-color: rgb(231, 27, 27, .5);
		line-height: 30px;
		color: #fff;
	}

	.suc-bg {
		background-color: rgba(92, 184, 92, .5);
		filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7f5CB85C, endcolorstr=#7f5CB85C);
	}

	.err-bg {
		background-color: rgba(217, 83, 79, .5);
		filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7fD9534F, endcolorstr=#7fD9534F);
	}


	.tips-enter,
	.tips-leave-to {
		bottom: -30px;
	}

	.tips-enter-active,
	.tips-leave-active {
		transition: bottom .5s;
	}

	/* ---------------------------- */
	/*常规验证码*/
	.verify-code {
		font-size: 20px;
		text-align: center;
		cursor: pointer;
		margin-bottom: 5px;
		border: 1px solid #ddd;
	}

	.cerify-code-panel {
		height: 100%;
		overflow: hidden;
	}

	.verify-code-area {
		float: left;
	}

	.verify-input-area {
		float: left;
		width: 60%;
		padding-right: 10px;

	}

	.verify-change-area {
		line-height: 30px;
		float: left;
	}

	.varify-input-code {
		display: inline-block;
		width: 100%;
		height: 25px;
	}

	.verify-change-code {
		color: #337AB7;
		cursor: pointer;
	}

	.verify-btn {
		width: 200px;
		height: 30px;
		background-color: #337AB7;
		color: #FFFFFF;
		border: none;
		margin-top: 10px;
	}


	/*滑动验证码*/
	.verify-bar-area {
		position: relative;
		background: #FFFFFF;
		text-align: center;
		-webkit-box-sizing: content-box;
		-moz-box-sizing: content-box;
		box-sizing: content-box;
		border: 1px solid #ddd;
		-webkit-border-radius: 4px;
	}

	.verify-bar-area .verify-move-block {
		position: absolute;
		top: 0px;
		left: 0;
		background: #fff;
		cursor: pointer;
		-webkit-box-sizing: content-box;
		-moz-box-sizing: content-box;
		box-sizing: content-box;
		box-shadow: 0 0 2px #888888;
		-webkit-border-radius: 1px;
	}

	.verify-bar-area .verify-move-block:hover {
		background-color: #337ab7;
		color: #FFFFFF;
	}

	.verify-bar-area .verify-left-bar {
		position: absolute;
		top: -1px;
		left: -1px;
		background: #f0fff0;
		cursor: pointer;
		-webkit-box-sizing: content-box;
		-moz-box-sizing: content-box;
		box-sizing: content-box;
		border: 1px solid #ddd;
	}

	.verify-img-panel {
		margin: 0;
		-webkit-box-sizing: content-box;
		-moz-box-sizing: content-box;
		box-sizing: content-box;
		border-top: 1px solid #ddd;
		border-bottom: 1px solid #ddd;
		border-radius: 3px;
		position: relative;
	}

	.verify-img-panel .verify-refresh {
		width: 25px;
		height: 25px;
		text-align: center;
		padding: 5px;
		cursor: pointer;
		position: absolute;
		top: 0;
		right: 0;
		z-index: 2;
	}

	.verify-img-panel .icon-refresh {
		font-size: 20px;
		color: #fff;
	}

	.verify-img-panel .verify-gap {
		background-color: #fff;
		position: relative;
		z-index: 2;
		border: 1px solid #fff;
	}

	.verify-bar-area .verify-move-block .verify-sub-block {
		position: absolute;
		text-align: center;
		z-index: 3;
		/* border: 1px solid #fff; */
	}

	.verify-bar-area .verify-move-block .verify-icon {
		width: 80rpx;
		height: 80rpx;
		font-size: 18px;
	}

	.verify-bar-area .verify-msg {
		z-index: 3;
	}

	/*字体图标的css*/
	/*@font-face {font-family: "iconfont";*/
	/*src: url('../fonts/iconfont.eot?t=1508229193188'); !* IE9*!*/
	/*src: url('../fonts/iconfont.eot?t=1508229193188#iefix') format('embedded-opentype'), !* IE6-IE8 *!*/
	/*url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),*/
	/*url('../fonts/iconfont.ttf?t=1508229193188') format('truetype'), !* chrome, firefox, opera, Safari, Android, iOS 4.2+*!*/
	/*url('../fonts/iconfont.svg?t=1508229193188#iconfont') format('svg'); !* iOS 4.1- *!*/
	/*}*/

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-check:before {
		content: " ";
		display: block;
		width: 16px;
		height: 16px;
		position: absolute;
		margin: auto;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 9999;
		background-image: url("@/static/images/arrow-good.png");
		background-size: contain;
	}

	.icon-close:before {
		content: " ";
		display: block;
		width: 16px;
		height: 16px;
		position: absolute;
		margin: auto;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 9999;
		background-image: url("@/static/images/arrow-close.png");
		background-size: contain;
	}

	.icon-right:before {
		content: " ";
		display: block;
		width: 16px;
		height: 16px;
		position: absolute;
		margin: auto;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-size: cover;
		z-index: 9999;
		background-image: url("@/static/images/arrow-right.png");
		background-size: contain;
	}

	.icon-refresh:before {
		content: " ";
		display: block;
		width: 16px;
		height: 16px;
		position: absolute;
		margin: auto;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 9999;
		background-image: url("@/static/images/refresh.png");
		background-size: contain;
	}
</style>
