import fetch from 'utils/fetch';
import qs from 'qs';

export function list(params){
	return fetch({
		url: '/admin/wish/banner/list',
		method: 'get',
		params
	})
}
export function update(params){
	return fetch({
		url: '/admin/wish/banner/modify',
		method: 'post',
		data: qs.stringify(params)
	})
}
export function create(params){
	return fetch({
		url: '/admin/wish/banner/add',
		method: 'post',
		data: qs.stringify(params)
	})
}
export function enable(params){
	return fetch({
		url: '/admin/wish/banner/is_using',
		method: 'post',
		data: qs.stringify(params)
	})
}
export function detail(params){
	return fetch({
		url: '/admin/wish/banner/get',
		method: 'post',
		// method: 'get',
		// params
		data: qs.stringify(params)
	})
}
export function remove(params){
	return fetch({
		url: '/admin/wish/banner/remove',
		method: 'post',
		data: qs.stringify(params)
	})
}
