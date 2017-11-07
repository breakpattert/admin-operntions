import Mock from 'mockjs';

export default {
	// 七日平均值列表
	depositList: queryList => ({
		code: '10000',
		msg: '成功',
		data: {
			day_avg_topup: {
				total_count: 35,
				datas: [{
					day_sort: 3,
					avg_amount: 11,
					gmt_modified: '2017-10-10 14:04:17'
				}]
			}
		}
	}),
	// 编辑
	depositEditor: query => ({
		
	})
}