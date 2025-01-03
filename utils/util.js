// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2024 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import {
	TOKENNAME,
	HTTP_REQUEST_URL
} from '../config/app.js';
import store from '../store';
import {
	pathToBase64
} from '@/plugin/image-tools/index.js';
// #ifdef APP-PLUS
import permision from "./permission.js"
// #endif
export default {
	/**
	 * 字符串截取
	 * @obj 传入的数据
	 * @state 0 某个参数之前 1某个参数之后
	 * 
	 *
	 * **/
	stringIntercept: function(obj, state, type) {
		var index = obj.lastIndexOf(type);
		if (state == 0) {
			obj = obj.substring(0, index);
		} else {
			obj = obj.substring(index + 1, obj.length);
		}
		return obj;
	},
	/**
	 * opt  object | string
	 * to_url object | string
	 * 例:
	 * this.Tips('/pages/test/test'); 跳转不提示
	 * this.Tips({title:'提示'},'/pages/test/test'); 提示并跳转
	 * this.Tips({title:'提示'},{tab:1,url:'/pages/index/index'}); 提示并跳转值table上
	 * tab=1 一定时间后跳转至 table上
	 * tab=2 一定时间后跳转至非 table上
	 * tab=3 一定时间后返回上页面
	 * tab=4 关闭所有页面跳转至非table上
	 * tab=5 关闭当前页面跳转至table上
	 */
	Tips: function(opt, to_url) {
		if (typeof opt == 'string') {
			to_url = opt;
			opt = {};
		}
		let title = opt.title || '',
			icon = opt.icon || 'none',
			endtime = opt.endtime || 2000,
			success = opt.success;
		if (title) uni.showToast({
			title: title,
			icon: icon,
			duration: endtime,
			success
		})
		if (to_url != undefined) {
			if (typeof to_url == 'object') {
				let tab = to_url.tab || 1,
					url = to_url.url || '';
				switch (tab) {
					case 1:
						//一定时间后跳转至 table
						setTimeout(function() {
							uni.switchTab({
								url: url
							})
						}, endtime);
						break;
					case 2:
						//跳转至非table页面
						setTimeout(function() {
							uni.navigateTo({
								url: url,
							})
						}, endtime);
						break;
					case 3:
						//返回上页面
						setTimeout(function() {
							// #ifndef H5
							uni.navigateBack({
								delta: parseInt(url),
							})
							// #endif
							// #ifdef H5
							history.back();
							// #endif
						}, endtime);
						break;
					case 4:
						//关闭当前所有页面跳转至非table页面
						setTimeout(function() {
							uni.reLaunch({
								url: url,
							})
						}, endtime);
						break;
					case 5:
						//关闭当前页面跳转至非table页面
						setTimeout(function() {
							uni.redirectTo({
								url: url,
							})
						}, endtime);
						break;
				}

			} else if (typeof to_url == 'function') {
				setTimeout(function() {
					to_url && to_url();
				}, endtime);
			} else {
				//没有提示时跳转不延迟
				setTimeout(function() {
					uni.navigateTo({
						url: to_url,
					})
				}, title ? endtime : 0);
			}
		}
	},
	/**
	 * 移除数组中的某个数组并组成新的数组返回
	 * @param array array 需要移除的数组
	 * @param int index 需要移除的数组的键值
	 * @param string | int 值
	 * @return array
	 * 
	 */
	ArrayRemove: function(array, index, value) {
		const valueArray = [];
		if (array instanceof Array) {
			for (let i = 0; i < array.length; i++) {
				if (typeof index == 'number' && array[index] != i) {
					valueArray.push(array[i]);
				} else if (typeof index == 'string' && array[i][index] != value) {
					valueArray.push(array[i]);
				}
			}
		}
		return valueArray;
	},
	/**
	 * 生成海报获取文字
	 * @param string text 为传入的文本
	 * @param int num 为单行显示的字节长度
	 * @return array 
	 */
	textByteLength: function(text, num) {
		let strLength = 0;
		let rows = 1;
		let str = 0;
		let arr = [];
		for (let j = 0; j < text.length; j++) {
			if (text.charCodeAt(j) > 255) {
				strLength += 2;
				if (strLength > rows * num) {
					strLength++;
					arr.push(text.slice(str, j));
					str = j;
					rows++;
				}
			} else {
				strLength++;
				if (strLength > rows * num) {
					arr.push(text.slice(str, j));
					str = j;
					rows++;
				}
			}
		}
		arr.push(text.slice(str, text.length));
		return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
	},
/**
	 * 获取分享海报
	 * @param array arr2 海报素材
	 * @param string store_name 素材文字
	 * @param string price 价格
	 * @param function successFn 回调函数
	 * 
	 * 
	 */
	PosterCanvas: function(arr2, store_name, price, successFn, errFun) {
		let that = this;
		const ctx = uni.createCanvasContext('myCanvas');
		ctx.clearRect(0, 0, 0, 0);
		/**
		 * 只能获取合法域名下的图片信息,本地调试无法获取
		 * 
		 */
		uni.getImageInfo({			
			src: arr2[0],
			success: function(res) {
				console.log(res, 'getImageInfo')
				const WIDTH = res.width;
				const HEIGHT = res.height;
				ctx.drawImage(arr2[0], 0, 0, WIDTH, HEIGHT);
				ctx.drawImage(arr2[1], 0, 0, WIDTH, WIDTH);
				ctx.save();
				let r = 90;
				let d = r * 2;
				let cx = 40;
				let cy = 990;
				ctx.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
				// ctx.clip();
				ctx.drawImage(arr2[2], cx, cy, d, d);
				ctx.restore();
				const CONTENT_ROW_LENGTH = 40;
				let [contentLeng, contentArray, contentRows] = that.textByteLength(store_name, CONTENT_ROW_LENGTH);
				if (contentRows > 2) {
					contentRows = 2;
					let textArray = contentArray.slice(0, 2);
					textArray[textArray.length - 1] += '……';
					contentArray = textArray;
				}
				ctx.setTextAlign('center');
				ctx.setFontSize(32);
				let contentHh = 32 * 1.3;
				for (let m = 0; m < contentArray.length; m++) {
					ctx.fillText(contentArray[m], WIDTH / 2, 820 + contentHh * m);
				}
				ctx.setTextAlign('center')
				ctx.setFontSize(48);
				ctx.setFillStyle('red');
				ctx.fillText('￥' + price, WIDTH / 2, 880 + contentHh);
				ctx.draw(true, function() {
					uni.canvasToTempFilePath({
						canvasId: 'myCanvas',
						fileType: 'png',
						destWidth: WIDTH,
						destHeight: HEIGHT,
						success: function(res) {
							uni.hideLoading();
							successFn && successFn(res.tempFilePath);
						},
						fail: function(err) {
							uni.hideLoading();
							errFun && errFun(err);
						}
					})
				});
			},
			fail: function(err) {
				uni.hideLoading();
				that.Tips({
					title: '无法获取图片信息'
				});
				errFun && errFun(err);
			}
		})
	},
	/**
	 * 获取分享海报
	 * @param array arr2 海报素材
	 * @param string store_name 素材文字
	 * @param string price 价格
	 * @param function successFn 回调函数
	 * 
	 * 
	 */
	goodsPosterCanvas: function(arr2, store_name, price, site_name, ot_price, successFn, errFun) {
		let that = this;
		const ctx = uni.createCanvasContext('myCanvas');
		ctx.clearRect(0, 0, 0, 0);
		/**
		 * 只能获取合法域名下的图片信息,本地调试无法获取
		 * 
		 */
		uni.getImageInfo({			
			src: arr2[0],
			success: function(res) {
				console.log(res, 'getImageInfo')
				const WIDTH = res.width;
				const HEIGHT = res.height;
				ctx.drawImage(arr2[0], 0, 0, WIDTH, HEIGHT+50);
				ctx.save();
				let r = 90;
				let d = r * 2;
				let cx = 555;
				let cy = 910;
				let ux = 50;
				let uy = 50;	
				ctx.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
				that.handleBorderRect(ctx, 30, 30, 50, 50, 25);
				ctx.clip();
				ctx.drawImage(arr2[3], 30, 30, 50, 50);
				ctx.restore();
				ctx.drawImage(arr2[2], cx, cy-30, d-30, d-30);
				ctx.save();
				ctx.restore();
				ctx.setTextAlign('left');
				ctx.setFontSize(24);
				ctx.setFillStyle('#282828');
				ctx.fillText(site_name, r, 62);
				const CONTENT_ROW_LENGTH = 26;
				let [contentLeng, contentArray, contentRows] = that.textByteLength(store_name, CONTENT_ROW_LENGTH);
				if (contentRows > 2) {
					contentRows = 2;
					let textArray = contentArray.slice(0, 2);
					textArray[textArray.length - 1] = textArray[textArray.length - 1].slice(0,textArray[textArray.length - 1].length-1)
					textArray[textArray.length - 1] += '…';		
					contentArray = textArray;
				}
				ctx.setFontSize(32);
				let contentHh = 32 * 1.3;
				for (let m = 0; m < contentArray.length; m++) {
					ctx.fillText(contentArray[m], 30, cy + contentHh * m);
				}
				ctx.setFontSize(40);
				ctx.setFillStyle('red');
				ctx.fillText('￥' + price, 30, 990 + contentHh);
				ctx.setFontSize(26);
				ctx.setFillStyle('#999999');
				ctx.beginPath();
				const textWidth = ctx.measureText(ot_price+'￥').width + 16; //检查字体的宽度
				//绘制数字中间的矩形
				ctx.setFillStyle('#999999');
				ctx.rect(35, 1062,textWidth-10, 1);
				ctx.fill();
				ctx.closePath();
				ctx.fillText('￥' + ot_price, 35, 1030 + contentHh);
				// ctx.clip();
				// ctx.restore();
				that.handleBorderRect(ctx, 30, 108, WIDTH-60, WIDTH-20, 12);
				ctx.clip();
				ctx.drawImage(arr2[1], 30, 108, WIDTH-60, WIDTH-20);
				ctx.draw(true, function() {
					uni.canvasToTempFilePath({
						canvasId: 'myCanvas',
						fileType: 'png',
						destWidth: WIDTH,
						destHeight: HEIGHT,
						success: function(res) {
							uni.hideLoading();
							successFn && successFn(res.tempFilePath);
						},
						fail: function(err) {
							uni.hideLoading();
							errFun && errFun(err);
						}
					})
				});
			},
			fail: function(err) {
				uni.hideLoading();
				that.Tips({
					title: '无法获取图片信息'
				});
				errFun && errFun(err);
			}
		})
	},
	/**
	 * 获取视频分享海报
	 * @param array arr2 海报素材
	 * @param string store_name 素材文字
	 * @param string price 价格
	 * @param function successFn 回调函数
	 * 
	 * 
	 */
	videoPosterCanvas: function(arr2, content, nickname, successFn, errFun) {
		let that = this;
		const ctx = uni.createCanvasContext('myCanvas');
		ctx.clearRect(0, 0, 0, 0);
		/**
		 * 只能获取合法域名下的图片信息,本地调试无法获取
		 * 
		 */
		uni.getImageInfo({			
			src: arr2[0],
			success: function(res) {
				const WIDTH = res.width;
				const HEIGHT = res.height;
				let r = 90;
				let d = r * 2;
				let cx = 40;
				let cy = 760;
				let ux = 50;
				let uy = 700;
				ctx.drawImage(arr2[0], 0, 0, WIDTH, HEIGHT);
				ctx.drawImage(arr2[1], 32, 32, WIDTH-64, WIDTH-64);
				ctx.strokeStyle = "#ffffff";
				ctx.save();
				ctx.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
				ctx.drawImage(arr2[2], 530, 760, d, d);
				that.handleBorderRect(ctx, ux, uy, r, r, 45);
				ctx.clip();
				ctx.stockStyle ="#ffffff";
				ctx.drawImage(arr2[3], ux, uy, r, r);
				ctx.restore();
				ctx.setTextAlign('left')
				ctx.setFontSize(28);
				ctx.setFillStyle('#282828');
				ctx.fillText(nickname, r+60, 760);
				ctx.setTextAlign('left')
				ctx.setFontSize(28);
				ctx.setFillStyle('#282828');
				const CONTENT_ROW_LENGTH = 25;
				let [contentLeng, contentArray, contentRows] = that.textByteLength(content, CONTENT_ROW_LENGTH);
				if (contentRows > 2) {
					contentRows = 2;
					let textArray = contentArray.slice(0, 2);
					textArray[textArray.length - 1] += '……';
					contentArray = textArray;
				}
				ctx.setTextAlign('left');
				ctx.font = 'bold 32px Arial';	
				let contentHh = 32 * 1.3;
				for (let m = 0; m < contentArray.length; m++) {
					ctx.fillText(contentArray[m], 55, 850 + contentHh * m);
				}		
				ctx.draw(true, function() {
					uni.canvasToTempFilePath({
						canvasId: 'myCanvas',
						fileType: 'png',
						destWidth: WIDTH,
						destHeight: HEIGHT,
						success: function(res) {
							uni.hideLoading();
							successFn && successFn(res.tempFilePath);
						},
						fail: function(err) {
							uni.hideLoading();
							errFun && errFun(err);
						}
					})
				});
			},
			fail: function(err) {
				uni.hideLoading();
				that.Tips({
					title: '无法获取图片信息'
				});
				errFun && errFun(err);
			}
		})
	},
	/**
	  * 图片圆角设置
	  * @param string x x轴位置
	  * @param string y y轴位置
	  * @param string w 图片宽
	  * @param string y 图片高
	  * @param string r 圆角值
	  */
	 handleBorderRect(ctx, x, y, w, h, r) {
	  ctx.beginPath();
	  // 左上角
	  ctx.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI);
	  ctx.moveTo(x + r, y);
	  ctx.lineTo(x + w - r, y);
	  ctx.lineTo(x + w, y + r);
	  // 右上角
	  ctx.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2 * Math.PI);
	  ctx.lineTo(x + w, y + h - r);
	  ctx.lineTo(x + w - r, y + h);
	  // 右下角
	  ctx.arc(x + w - r, y + h - r, r, 0, 0.5 * Math.PI);
	  ctx.lineTo(x + r, y + h);
	  ctx.lineTo(x, y + h - r);
	  // 左下角
	  ctx.arc(x + r, y + h - r, r, 0.5 * Math.PI, Math.PI);
	  ctx.lineTo(x, y + r);
	  ctx.lineTo(x + r, y);
	
	  ctx.fill();
	  ctx.closePath();
	 },
	/**
	 * 用户信息分享海报
	 * @param array arr2 海报素材  1背景 0二维码
	 * @param string nickname 昵称
	 * @param string sitename 价格
	 * @param function successFn 回调函数
	 * 
	 * 
	 */
	userPosterCanvas: function(arr2, nickname, sitename, index, w, h, successFn) {
		let that = this;
		const ctx = uni.createCanvasContext('myCanvas' + index);
		ctx.clearRect(0, 0, 0, 0);
		/**
		 * 只能获取合法域名下的图片信息,本地调试无法获取
		 * 
		 */
		uni.getImageInfo({
			src: arr2[1],
			success: function(res) {
				const WIDTH = res.width;
				const HEIGHT = res.height;
				// ctx.fillStyle = '#fff';
				ctx.fillRect(0, 0, w, h);
				// ctx.drawImage(arr2[0], 0, 0, WIDTH, HEIGHT);
				ctx.drawImage(arr2[1], 0, 0, w, h);
				ctx.setTextAlign('left')
				ctx.setFontSize(12);
				ctx.setFillStyle('#333');
				let codex = 0.1906
				let codey = 0.7746
				let codeSize = 0.21666
				let namex = 0.4283
				let namey = 0.8215
				let markx = 0.4283
				let marky = 0.8685
				ctx.drawImage(arr2[0], w * codex, h * codey, w * codeSize, w * codeSize);
				if (w < 270) {
					ctx.setFontSize(8);
				} else {
					ctx.setFontSize(10);
				}
				ctx.fillText(nickname, w * namex, h * namey);
				if (w < 270) {
					ctx.setFontSize(8);
				} else {
					ctx.setFontSize(10);
				}
				const CONTENT_ROW_LENGTH = 28;
				let [contentLeng, contentArray, contentRows] = that.textByteLength(sitename, CONTENT_ROW_LENGTH);
				if (contentRows > 2) {
					contentRows = 2;
					let textArray = contentArray.slice(0, 2);
					textArray[textArray.length - 1] += '……';
					contentArray = textArray;
				}
				// ctx.setTextAlign('left');
				// ctx.font = 'bold 32px Arial';	
				let contentHh = 12 * 1.3;
				for (let m = 0; m < contentArray.length; m++) {
					ctx.fillText(contentArray[m], w * markx, h * marky + contentHh * m);
				}		
				// ctx.fillText(sitename, w * markx, h * marky);
				ctx.save();
				ctx.draw(false,setTimeout(()=>{
					uni.canvasToTempFilePath({
						canvasId: 'myCanvas' + index,
						fileType: 'png',
						destWidth: WIDTH,
						destHeight: HEIGHT,
						success: function(res) {
							successFn && successFn(res.tempFilePath);
						},
						fail: function(err) {
							console.log(err)
							uni.hideLoading();
							
						}
					})
				},1000))
			},
			fail: function(err) {

				uni.hideLoading();
				that.Tips({
					title: '无法获取图片信息'
				});
			}
		})
	},

	/*
	 * 单图上传
	 * @param object opt
	 * @param callable successCallback 成功执行方法 data 
	 * @param callable errorCallback 失败执行方法 
	 */
	uploadImageOne: function(opt, successCallback, errorCallback) {
		let that = this;
		if (typeof opt === 'string') {
			let url = opt;
			opt = {};
			opt.url = url;
		}
		let count = opt.count || 1,
			sizeType = opt.sizeType || ['compressed'],
			sourceType = opt.sourceType || ['album', 'camera'],
			is_load = opt.is_load || true,
			uploadUrl = opt.url || '',
			inputName = opt.name || 'field';
		uni.chooseImage({
			count: count, //最多可以选择的图片总数  
			sizeType: sizeType, // 可以指定是原图还是压缩图，默认二者都有  
			sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有  
			success: async (res)=> {
				let image = [];
				let filesLen = res.tempFiles.length;
				let exceeded_list = [];
				let uploadMaxSize = 10;
				let imageList = [];
				let urlPath = HTTP_REQUEST_URL + '/api/' + uploadUrl + '/' + inputName
				if (count === 1) {
					successCallback && successCallback(await that.uploadFile(urlPath, res.tempFilePaths[
						0], opt, '图片上传中'))
				} else {
					for (let i = 0; i < res.tempFiles.length; i++) {
						if (Math.ceil(res.tempFiles[i].size / 1024) < uploadMaxSize * 1024) {
							image.push(res.tempFiles[i].path);
						} else {
							exceeded_list.push(i + 1);
							filesLen = filesLen - 1;
							// #ifdef APP-PLUS
							plus.nativeUI.alert(
								`第${[...new Set(exceeded_list)].join(',')}张图片超出限制${uploadMaxSize}MB,已过滤`
							);
							// #endif
							// #ifndef APP-PLUS
							uni.showModal({
								content: `第${[...new Set(exceeded_list)].join(',')}张图片超出限制${uploadMaxSize}MB,已过滤`
							});
							// #endif
							continue;
						}
					}
					for (const key in image) {
						let data = await that.uploadFile(urlPath, image[key], opt, '图片上传中')
						imageList.push(data.data.path)
					}
					successCallback && successCallback(imageList)
				}
			}
		})
	},
	uploadFile(urlPath, localPath, opt, message) {
		let that = this;
		return new Promise(async (resolve) => {
			//启动上传等待中...
			if (message) uni.showLoading({
				title: message,
			});
			uni.uploadFile({
				url: urlPath,
				filePath: localPath,
				name: opt.name || 'field',
				header: {
					// #ifdef MP
					"Content-Type": "multipart/form-data",
					// #endif
					[TOKENNAME]: 'Bearer ' + store.state.app.token
				},
				success: function(res) {
					uni.hideLoading();
					if (res.statusCode == 403) {
						that.Tips({
							title: res.data
						});
					} else {
						let data = res.data ? JSON.parse(res.data) : {};
						if (data.status == 200) {
							resolve(data);
						} else {
							that.Tips({
								title: data.message
							});
						}
					}
				},
				fail: function(res) {
					uni.hideLoading();
					that.Tips({
						title: res
					});
				}
			})
		})
	},
/**
	 * 小程序头像获取上传
	 * @param uploadUrl 上传接口地址
	 * @param filePath 上传文件路径 
	 * @param successCallback success回调 
	 * @param errorCallback err回调
	 */
	uploadImgs(uploadUrl, filePath, successCallback, errorCallback) {
		let that = this;
		let	inputName = 'pics';
		uni.uploadFile({
			url: HTTP_REQUEST_URL + '/api/' + uploadUrl + '/' + inputName,
			filePath: filePath,
			fileType: 'image',
			name: 'pics',
			formData: {
				'filename': 'pics'
			},
			header: {
				// #ifdef MP
				"Content-Type": "multipart/form-data",
				// #endif
				[TOKENNAME]: 'Bearer ' + store.state.app.token
			},
			success: (res) => {
				uni.hideLoading();
				if (res.statusCode == 403) {
					that.Tips({
						title: res.data
					});
				} else {
					let data = res.data ? JSON
						.parse(res.data) : {};
					if (data.status == 200) {
						successCallback &&
							successCallback(data)
					} else {
						errorCallback &&
							errorCallback(data);
						that.Tips({
							title: data.message
						});
					}
				}
			},
			fail: (err) => {
				console.log(err)
				uni.hideLoading();
				that.Tips({
					title: i18n.t(`上传图片失败`)
				});
			}
		})
	},
	serialize: function(obj) {
		var str = [];
		for (var p in obj)
			if (obj.hasOwnProperty(p)) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			}
		return str.join("&");
	},
	getNowUrl: function() {
		const pages = getCurrentPages(),
		page = pages[pages.length - 1],
		query = this.serialize(page.options || {});
		return page.route + (query ? '?' + query : '');
	},
	/**
	 * 处理服务器扫码带进来的参数
	 * @param string param 扫码携带参数
	 * @param string k 整体分割符 默认为：&
	 * @param string p 单个分隔符 默认为：=
	 * @return object
	 * 
	 */
	// #ifdef MP
	getUrlParams: function(param, k, p) {
		if (typeof param != 'string') return {};
		k = k ? k : '&'; //整体参数分隔符
		p = p ? p : '='; //单个参数分隔符
		var value = {};
		if (param.indexOf(k) !== -1) {
			param = param.split(k);
			for (var val in param) {
				if (param[val].indexOf(p) !== -1) {
					var item = param[val].split(p);
					value[item[0]] = item[1];
				}
			}
		} else if (param.indexOf(p) !== -1) {
			var item = param.split(p);
			value[item[0]] = item[1];
		} else {
			return param;
		}
		return value;
	},
	// #endif
	/*
	 * 合并数组
	 */
	SplitArray(list, sp) {
		if (typeof list != 'object') return [];
		if (sp === undefined) sp = [];
		for (var i = 0; i < list.length; i++) {
			sp.push(list[i]);
		}
		return sp;
	},
	trim(str) {
		return String.prototype.trim.call(str);
	},
	$h: {
		//除法函数，用来得到精确的除法结果
		//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
		//调用：$h.Div(arg1,arg2)
		//返回值：arg1除以arg2的精确结果
		Div: function(arg1, arg2) {
			arg1 = parseFloat(arg1);
			arg2 = parseFloat(arg2);
			var t1 = 0,
				t2 = 0,
				r1, r2;
			try {
				t1 = arg1.toString().split(".")[1].length;
			} catch (e) {}
			try {
				t2 = arg2.toString().split(".")[1].length;
			} catch (e) {}
			r1 = Number(arg1.toString().replace(".", ""));
			r2 = Number(arg2.toString().replace(".", ""));
			return this.Mul(r1 / r2, Math.pow(10, t2 - t1));
		},
		//加法函数，用来得到精确的加法结果
		//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
		//调用：$h.Add(arg1,arg2)
		//返回值：arg1加上arg2的精确结果
		Add: function(arg1, arg2) {
			arg2 = parseFloat(arg2);
			var r1, r2, m;
			try {
				r1 = arg1.toString().split(".")[1].length
			} catch (e) {
				r1 = 0
			}
			try {
				r2 = arg2.toString().split(".")[1].length
			} catch (e) {
				r2 = 0
			}
			m = Math.pow(100, Math.max(r1, r2));
			return (this.Mul(arg1, m) + this.Mul(arg2, m)) / m;
		},
		//减法函数，用来得到精确的减法结果
		//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
		//调用：$h.Sub(arg1,arg2)
		//返回值：arg1减去arg2的精确结果
		Sub: function(arg1, arg2) {
			arg1 = parseFloat(arg1);
			arg2 = parseFloat(arg2);
			var r1, r2, m, n;
			try {
				r1 = arg1.toString().split(".")[1].length
			} catch (e) {
				r1 = 0
			}
			try {
				r2 = arg2.toString().split(".")[1].length
			} catch (e) {
				r2 = 0
			}
			m = Math.pow(10, Math.max(r1, r2));
			//动态控制精度长度
			n = (r1 >= r2) ? r1 : r2;
			return ((this.Mul(arg1, m) - this.Mul(arg2, m)) / m).toFixed(n);
		},
		//乘法函数，用来得到精确的乘法结果
		//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
		//调用：$h.Mul(arg1,arg2)
		//返回值：arg1乘以arg2的精确结果
		Mul: function(arg1, arg2) {
			arg1 = parseFloat(arg1);
			arg2 = parseFloat(arg2);
			var m = 0,
				s1 = arg1.toString(),
				s2 = arg2.toString();
			try {
				m += s1.split(".")[1].length
			} catch (e) {}
			try {
				m += s2.split(".")[1].length
			} catch (e) {}
			return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
		},
	},
	// 获取地理位置;
	$L: {
		async getLocation() {
			// #ifdef APP-PLUS
			let status = await this.checkPermission();
			if (status !== 1) {
				return;
			}
			// #endif
			// #ifdef MP-WEIXIN || MP-TOUTIAO || MP-QQ
			let status = await this.getSetting();
			if (status === 2) {
				this.openSetting();
				return;
			}
			// #endif
			this.doGetLocation();
		},
		doGetLocation() {
			uni.getLocation({
				success: (res) => {
					uni.removeStorageSync('CACHE_LONGITUDE');
					uni.removeStorageSync('CACHE_LATITUDE');
					uni.setStorageSync('CACHE_LONGITUDE', res.longitude);
					uni.setStorageSync('CACHE_LATITUDE', res.latitude);
				},
				fail: (err) => {
					// #ifdef MP-BAIDU
					if (err.errCode === 202 || err.errCode === 10003) { // 202模拟器 10003真机 user deny
						this.openSetting();
					}
					// #endif
					// #ifndef MP-BAIDU
					if (err.errMsg.indexOf("auth deny") >= 0) {
						uni.showToast({
							title: "访问位置被拒绝"
						})
					} else {
						uni.showToast({
							title: err.errMsg
						})
					}
					// #endif
				}
			})
		},
		getSetting: function() {
			return new Promise((resolve, reject) => {
				uni.getSetting({
					success: (res) => {
						if (res.authSetting['scope.userLocation'] === undefined) {
							resolve(0);
							return;
						}
						if (res.authSetting['scope.userLocation']) {
							resolve(1);
						} else {
							resolve(2);
						}
					}
				});
			});
		},
		openSetting: function() {
			uni.openSetting({
				success: (res) => {
					if (res.authSetting && res.authSetting['scope.userLocation']) {
						this.doGetLocation();
					}
				},
				fail: (err) => {}
			})
		},
		async checkPermission() {
			let status = permision.isIOS ? await permision.requestIOS('location') :
				await permision.requestAndroid('android.permission.ACCESS_FINE_LOCATION');
			if (status === null || status === 1) {
				status = 1;
			} else if (status === 2) {
				uni.showModal({
					content: "系统定位已关闭",
					confirmText: "确定",
					showCancel: false,
					success: function(res) {}
				})
			} else if (status.code) {
				uni.showModal({
					content: status.message
				})
			} else {
				uni.showModal({
					content: "需要定位权限",
					confirmText: "设置",
					success: function(res) {
						if (res.confirm) {
							permision.gotoAppSetting();
						}
					}
				})
			}
			return status;
		},
	},
	/**
	 * 跳转路径封装函数
	 * @param url 跳转路径
	 */
	JumpPath: function(url) {
		let arr = url.split('@APPID=');
		if (arr.length > 1) {
			//#ifdef MP
			let pathArr = arr[1].split('?')
			if(pathArr.length > 1){}
			uni.navigateToMiniProgram({
				appId: pathArr.length > 1 ? pathArr[0] : arr[arr.length-1], // 此为生活缴费appid
				path: arr[0], // 此为生活缴费首页路径
				envVersion: "release",
				success: res => {
					console.log("打开成功", res);
				},
				fail: err => {}
			})
			//#endif
			//#ifndef MP
			this.Tips({
				title: 'h5与app端不支持跳转外部小程序'
			});
			//#endif
		} else {
			if (url.indexOf("http") != -1) {
				uni.navigateTo({
					url: `/pages/annex/web_view/index?url=${url}`
				});
			} else {
				if (['/pages/goods_cate/goods_cate','/pages/plant_grass/index','/pages/order_addcart/order_addcart','/pages/user/index'
					]
					.indexOf(url) == -1) {
					uni.navigateTo({
						url
					})
				} else {
					uni.switchTab({
						url
					})
				}
			}
		}
	},
}
