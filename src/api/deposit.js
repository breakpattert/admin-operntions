// 7日平均存款
import fetch from 'utils/fetch';
import qs from 'qs';

export function list(params){
	return fetch({
		url: '/admin/avg_topup/list',
		method: 'get',
		params
	})
}

export function editor(day_sort, avg_amount){
	var params = {
		day_sort, avg_amount
	}
	return fetch({
		url: '/admin/avg_topup/modify',
		method: 'post',
		data: qs.stringify(params)
	})
}
