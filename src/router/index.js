import Vue from 'vue';
import Router from 'vue-router';

/* layout */
import Layout from '../views/layout/Layout';

/* login */
import Login from '../views/login/';
const authRedirect = () => import('../views/login/authredirect');
const sendPWD = () => import('../views/login/sendpwd');
const reset = () => import('../views/login/reset');

/* dashboard */
const dashboard = () => import('../views/dashboard/index');

/* Introduction */
const Introduction = () => import('../views/introduction/index');

/* components */
const componentsIndex = () => import('../views/components/index');
const Tinymce = () => import('../views/components/tinymce');
// const Markdown = () => import('../views/components/markdown');
// const JsonEditor = () => import('../views/components/jsoneditor');
// const DndList = () => import('../views/components/dndlist');
// const AvatarUpload = () => import('../views/components/avatarUpload');
// const Dropzone = () => import('../views/components/dropzone');
// const Sticky = () => import('../views/components/sticky');
// const SplitPane = () => import('../views/components/splitpane');
// const CountTo = () => import('../views/components/countTo');
// const Mixin = () => import('../views/components/mixin');


/* charts */
// const chartIndex = () => import('../views/charts/index');
// const KeyboardChart = () => import('../views/charts/keyboard');
// const KeyboardChart2 = () => import('../views/charts/keyboard2');
// const LineMarker = () => import('../views/charts/line');
// const MixChart = () => import('../views/charts/mixchart');

/* error page */
const Err404 = () => import('../views/error/404');
const Err401 = () => import('../views/error/401');

/* error log */
const ErrorLog = () => import('../views/errlog/index');

/* excel */
// const ExcelDownload = () => import('../views/excel/index');

/* theme  */
// const Theme = () => import('../views/theme/index');

/* example*/
// const TableLayout = () => import('../views/example/table/index');
// const DynamicTable = () => import('../views/example/table/dynamictable');
// const Table = () => import('../views/example/table/table');
// const DragTable = () => import('../views/example/table/dragTable');
// const InlineEditTable = () => import('../views/example/table/inlineEditTable');
// const Form1 = () => import('../views/example/form1');

// 首页管理
const Deposit = () => import('../views/homepages/deposit');
// 账户管理
const Journal = () => import('../views/accounts/journal');
const AccountsList = () => import('../views/accounts/accounts');
const Withdrawals = () => import('../views/accounts/withdrawals');
// 用过户管理
const Users = () => import('../views/users/users');
// 情侣管理
const Couples = () => import('../views/couple/couples');
// 愿望管理
const WishList = () => import('../views/wishes/list');
const WishBanner = () => import('../views/wishes/banner');

/* permission */
const Permission = () => import('../views/permission/index');


Vue.use(Router);

 /**
  * icon : the icon show in the sidebar
  * hidden : if hidden:true will not show in the sidebar
  * redirect : if redirect:noredirect will not redirct in the levelbar
  * noDropdown : if noDropdown:true will not has submenu
  * meta : { role: ['admin'] }  will control the page role
  **/

export const constantRouterMap = [
    { path: '/login', component: Login, hidden: true },
    { path: '/authredirect', component: authRedirect, hidden: true },
    { path: '/sendpwd', component: sendPWD, hidden: true },
    { path: '/reset', component: reset, hidden: true },
    { path: '/404', component: Err404, hidden: true },
    { path: '/401', component: Err401, hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{ path: 'dashboard', component: dashboard }]
  },
  {
    path: '/introduction',
    component: Layout,
    redirect: '/introduction/index',
    icon: 'xinrenzhinan',
    noDropdown: true,
    children: [{ path: 'index', component: Introduction, name: '简述' }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  {
    path: '/homepages',
    component: Layout,
    name: '首页管理',
    icon: 'theme',
    children: [{
      path: 'deposit',
      component: Deposit,
      name: '近七日平均存款'
    }]
  },
  {
    path: '/accounts',
    component: Layout,
    redirect: '/accounts/journal',
    name: '账户管理',
    icon: 'theme',
    children: [{
      path: 'journal',
      component: Journal,
      name: '账户流水'
    },{
      path: 'withdrawals',
      component: Withdrawals,
      name: '提现审核'
    }]
  },
  {
    path: '/users',
    component: Layout,
    redirect: '/users/users',
    name: '用户管理',
    icon: 'theme',
    children: [{
      path: 'users',
      component: Users,
      name: '用户列表'
    }]
  },
  {
    path: '/couple',
    component: Layout,
    redirect: '/couple/couples',
    name: '情侣管理',
    icon: 'theme',
    children: [{
      path: 'couples',
      component: Couples,
      name: '情侣列表'
    }]
  },
  {
    path: '/wishes',
    component: Layout,
    name: '愿望管理',
    icon: 'theme',
    children:[{
      path: 'list',
      component: WishList,
      name: '愿望列表'
    },{
      path: 'banner',
      component: WishBanner,
      name: '愿望banner'
    }]
  },
  
  { path: '*', redirect: '/404', hidden: true }
];
