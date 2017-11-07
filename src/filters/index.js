function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }

  if ((time + '').length === 10) {
    time = +time * 1000
  }


  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time == 'object') {
    date = time;
  } else {
    date = new Date(parseInt(time));
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}

export function formatTime(time, option) {
  time = +time * 1000;
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}



/* 数字 格式化*/
export function nFormatter(num, digits) {
  const si = [
        { value: 1E18, symbol: 'E' },
        { value: 1E15, symbol: 'P' },
        { value: 1E12, symbol: 'T' },
        { value: 1E9, symbol: 'G' },
        { value: 1E6, symbol: 'M' },
        { value: 1E3, symbol: 'k' }
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol;
    }
  }
  return num.toString();
}


export function html2Text(val) {
  const div = document.createElement('div');
  div.innerHTML = val;
  return div.textContent || div.innerText;
}


export function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

// 上下架状态map
const shelfStatusMap = {
  '1': '上架',
  '0': '下架'
}
// 审核状态map
const checkStatusMap = {
  '1': '全部',
  '2': '通过',
  '3': '未审核'
}

const shelfStatusList = [{
  status: 0,
  name: '下架',
  operationName: '上架',
  operationStatus: 1
},{
  status: 1,
  name: '上架',
  operationName: '下架',
  operationStatus: 0
}]
export function shelfStatusFilter(status, field){
  var obj = shelfStatusList.find(item => item.status == status);
  var rst = status;
  if(obj && field && obj[field]){
    return obj[field]
  }else{
    return status
  }
  // return shelfStatusList.find(item => item.status == status)
}

const bannerStatusList = [{
  id: 0,
  name: '启用'
},{
  id: 1,
  name: '停用'
}]
export function bannerStatusListFilter(id, reverst){
  return findAndReverstIt(bannerStatusList, id, reverst)
}

// 审核状态
const checkWithdrawStatusList = [{
  status: 0,
  name: '待伴侣审核'
},{
  status: 1,
  name: '伴侣审核通过'
},{
  status: 2,
  name: '伴侣审核驳回'
},{
  status: 3,
  name: '后台审核通过'
},{
  status: 4,
  name: '后台审核拒绝'
},{
  status: 5,
  name: '提现成功'
}]
// 审核状态 filter
export function checkWithdrawFilter(status){
  // return findIt(checkWithdrawStatusList, id);
  return checkWithdrawStatusList.find(item => item.status == status).name
}
const wishList = [{
  id: 3,
  name: '购物'
},{
  id: 0,
  name: '旅行'
},{
  id: 2,
  name: '纪念日'
},{
  id: 1,
  name: '约会'
},{
  id: 4,
  name: '其他'
}]


function findIt(arr, id){
  var rst = arr.find(item => item.id == id);
  if(rst){
    return rst.name;
  }else{
    return id;
  }
}
// 只有两个状态的时候使用 ，并且有需要 状态之间转换的需求
function findAndReverstIt(arr, id, reverst){
  if(arr.length !== 2) return id;

  var index = arr.findIndex(item => item.id == id);
  if(reverst && index >= 0){
    index = (index == 0) ? 1 : 0;
  }

  if(index >= 0){
    return arr[index].name
  }else{
    return id
  }
}

export function wishListFilter(id){
  return findIt(wishList, id);
}

// 上下架状态
export function shelfStatus(status, opposite){
  // 取反
  if(opposite){
    status = (status == 0) ? '1' : '0';
  }
  
  let statusName = shelfStatusMap['' + status];
  
  return  statusName ? statusName : status; 
}

// 流水类型
const journalList = [{
  id: 0,
  name: '充值'
},{
  id: 1,
  name: '提现'
},{
  id: 2,
  name: '其他'
}]
export function journalListFilter(id){
  return findIt(journalList, id);
}
// 交易方式
const paymentList = [{
  id: 0,
  name: '银行卡'
},{
  id: 1,
  name: '微信'
},{
  id: 2,
  name: '支付宝'
},{
  id: 3,
  name: '其他'
}]

export function paymentListFilter(id){
  return findIt(paymentList, id);
}
// 性别
const genderList = [{
  id: 0,
  name: '女'
},{
  id: 1,
  name: '男'
}]
export function genderListFilter(id){
  return findIt(genderList, id);
}
// 情侣状态
const coupleList = [{
  id: 0,
  name: '情侣'
},{
  id: 1,
  name: '分手'
}]
export function coupleListFilter(id){
  return findIt(coupleList, id)
}

export { 
  shelfStatusMap, 
  checkWithdrawStatusList, 
  wishList, 
  shelfStatusList, 
  journalList, 
  paymentList,
  coupleList,
  genderList,
  bannerStatusList
}
