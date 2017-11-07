import fetch from 'utils/fetch';
import qs from 'qs';

export function list(params){
	return fetch({
		url: '/admin/withdraw/list',
		method: 'get',
		params
	})
}
export function update(params){
	return fetch({
		url: '/admin/withdraw/modify/thirdpartyno',
		method: 'post',
		data: qs.stringify(params)
	})
}

export function audit(params){
	return fetch({
		url: '/admin/withdraw/audit',
		method: 'post',
		data: qs.stringify(params)
	})
}
export function detail(params){
	return fetch({
		url: '/admin/withdraw/detail',
		method: 'get',
		params
	})
}