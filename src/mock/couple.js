import Mock from 'mockjs';

export default {
	// 账户流水列表
	coupleList: query => ({
		code: '10000',
		msg: '成功',
		data: {
			pagination_d_t_o: {
				total_count: 35,
				datas: [{
					id: 1,
					invitor: '邀请者',
					be_invitor: '接受者',
					mate_status: 0,
					amount: 1,
					mate_lvl: 111,
					mate_coin: 1233,
					be_lover_date: '2017-10-10 14:04:17',
					breakup_date: '2017-10-10 14:04:17'
				}]
			}
		}
	})
}