import fetch from 'utils/fetch';

export function loginByEmail(email, password) {
  const data = {
    email,
    password
  };
  return new Promise((rs, rj) => {
    var obj = {
      role: ['admin'],
      token: 'admin',
      introduction: '我是超级管理员',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: '超级管理员小潘',
      uid: '001'
    }
    rs({data: obj})
  })
  
  // return fetch({
  //   url: '/login/loginbyemail',
  //   method: 'post',
  //   data
  // });
}

export function logout() {
  return new Promise((rs, rj) => {
    rs('success')
  })
  // return fetch({
  //   url: '/login/logout',
  //   method: 'post'
  // });
}

export function getInfo(token) {
  return new Promise((rs, rj) => {
    var obj = {
      role: ['admin'],
      token: 'admin',
      introduction: '我是超级管理员',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: '超级管理员小潘',
      uid: '001'
    }
    rs({data: obj})
  })

  // return fetch({
  //   url: '/user/info',
  //   method: 'get',
  //   params: { token }
  // });
}

export function getOssSingature(){
  return fetch({
    url: '/admin/common/oss_policy/get',
    // url: '/management/oss/getAuthInfo',
    method: 'post'
  });
}

