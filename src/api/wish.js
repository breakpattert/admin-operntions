import fetch from 'utils/fetch';
import qs from 'qs';

export function fetchWishList(params) {
	return fetch({
		url: '/admin/wish/list',
		method: 'get',
		params: params
	})
}

export function createWish(params) {
	return fetch({
		url: '/admin/wish/add',
		method: 'post',
		data: qs.stringify(params)
	})
}
export function updateWish(params){
	return fetch({
		url: '/admin/wish/modify',
		method: 'post',
		data: qs.stringify(params)
	})
}

export function changeShelfStatus(params) {
	return fetch({
		url: '/admin/wish/is_using',
		method: 'post',
		data: qs.stringify(params)
	})
}

export function fetchWishById(params){
	return fetch({
		url: '/admin/wish/get',
		method: 'post',
		data: qs.stringify(params)
	})
}

export function remove(params){
	return fetch({
		url: '/admin/wish/remove',
		method: 'post',
		data: qs.stringify(params)
	})
}