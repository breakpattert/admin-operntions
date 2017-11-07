// 账户管理
import fetch from 'utils/fetch';
import qs from 'qs';

export function list(params){
	return fetch({
		url: '/admin/mate/list',
		method: 'get',
		params
	})
}