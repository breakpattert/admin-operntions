import Mock from 'mockjs';
import loginAPI from './login';
import articleAPI from './article';
import article_tableAPI from './article_table';
import remoteSearchAPI from './remoteSearch';
import account from './account';
import user from './user';
import couple from './couple';
import deposit from './deposit';



// 登录相关
Mock.mock(/\/login\/loginbyemail/, 'post', loginAPI.loginByEmail);
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout);
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getInfo)

// // 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList);
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle);

// // table example相关
Mock.mock(/\/article_table\/list/, 'get', article_tableAPI.getList);
Mock.mock(/\/article_table\/p/, 'get', article_tableAPI.getPv);

// // 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser);

// 账户信息
// Mock.mock('/admin/account/list', 'get', account.journalList)
Mock.mock(/\/admin\/account\/list/, 'get', account.journalList)
Mock.mock(/\/admin\/user\/list/, 'get', user.userList)
Mock.mock(/\/admin\/mate\/list/, 'get', couple.coupleList)
Mock.mock(/\/admin\/avg_topup\/list/, 'get', deposit.depositList)

export default Mock;
