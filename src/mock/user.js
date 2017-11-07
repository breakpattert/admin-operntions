import Mock from 'mockjs';

export default {
	// 账户流水列表
	userList: queryList => ({
		code: '10000',
		msg: '成功',
		data: {
			pagination_d_t_o: {
				total_count: 35,
				datas: [{
					user_id: 1,
					nick_name: 'yqb',
					sex: 5,
					mobile: 1397777777,
					birthday: '2017-10-10 14:04:17',
					gmt_created: '2017-10-10 14:04:17',
					gmt_modified: '2017-10-10 14:04:17'
				}]
			}
		}
	})
}