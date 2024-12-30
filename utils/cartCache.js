// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2024 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import { CART_TIME,CART_ID} from '@/config/cache';
import Cache from '../utils/cache';
export function checkCart() {
	let cartTime = 0
	if(Cache.get(CART_TIME)){
		let time = Cache.get(CART_TIME)
		cartTime = time + (2 * 60 * 60 * 1000); // 计算两个小时之后的时间戳
	}
	let newTime = Date.now();
	if (cartTime < newTime) {
		Cache.clear(CART_ID);
		Cache.clear(CART_TIME);
		return false;
	} else {
		return true;
	}
}