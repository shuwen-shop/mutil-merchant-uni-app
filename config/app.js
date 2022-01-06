// #ifdef H5
let VUE_APP_WS_URL = `ws://${location.hostname}?type=user`
// #endif

// 网络接口修改此字符 小程序域名要求https

// let httpApi = '' //测试站
// let httpApi = 'https://mer1.crmeb.net' //生产
let httpApi = 'https://api.xstiku.com'



// 聊天接口修改此字符 小程序聊天要求wss 例如：wss://mer.crmeb.net
let wsApi = 'wss://api.xstiku.com'
// let wsApi = 'wss://192.168.31.50:8324'

module.exports = {
	// 请求域名 格式： https://您的域名
	// #ifdef MP || APP-PLUS
	// HTTP_REQUEST_URL: httpApi,
	HTTP_REQUEST_URL: httpApi,
	VUE_APP_WS_URL: `${wsApi}?type=user`,
	// #endif

	// #ifdef H5
	//H5接口是浏览器地址
	HTTP_REQUEST_URL: httpApi || window.location.protocol + "//" + window.location.host,
	// 聊天长连接地址
	VUE_APP_WS_URL: wsApi ? `${wsApi}?type=user` : VUE_APP_WS_URL,
	// #endif

	HEADER: {
		'content-type': 'application/json',
		//#ifdef H5
		'Form-type': navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1 ? 'wechat' : 'h5',
		//#endif
		//#ifdef MP
		'Form-type': 'routine',
		//#endif
		//#ifdef APP-PLUS
		'Form-type': 'app',
		//#endif
	},
	// 回话密钥名称 请勿修改此配置
	TOKENNAME: 'X-Token',
	// 缓存时间 0 永久
	EXPIRE: 0,
};
