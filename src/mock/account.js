import Mock from 'mockjs';

export default {
	// 账户流水列表
	journalList: queryList => ({
		code: '10000',
		msg: '成功',
		data: {
			total_count: 35,
			datas: [{
				user_id: 1,
				user_name: 'yqb',
				mate_id: 333,
				type: 0,
				transaction_type: 0,
				thirdparty_no: 1233,
				amount: 999,
				gmt_created: '2017-10-10 14:04:17'
			}]
		}
	})
}