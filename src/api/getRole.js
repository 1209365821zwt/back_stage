import fetch from '@/utils/fetch';

// post 获取查询数据
export function getRole(data) {
  return fetch({
    url: '/role/getRolePageByRoleName',
    method: 'post',
    data
  })
}
//post 添加角色
export function addRole(data) {
  return fetch({
    url: '/role/addRoleById',
    method: 'post',
    data
  })
}
//post 根据id删除角色
export function delRole(roleId) {
  return fetch({
    url: `/role/delRoleById/?roleId=${roleId}`,
    method: 'post',
        
  })
}
//post 根据id更新角色
export function updataRole(data) {
  return fetch({
    url: '/role/updateRoleById',
    method: 'post',
    data
  })
}

//post  查询后台功能权限
export function AuthorityRole(roleId) {
  return fetch({
    url: `/role/getSystemAuthority/?roleId=${roleId}`,
    method: 'post',
  })
}

//post 保存后台功能权限
export function saveAuthorityRole(authorityIdList,roleId) {
  return fetch({
    url: `/role/saveSystemAuthority/?authorityIdList=${authorityIdList}&roleId=${roleId}`,
    method: 'post',   
  })
}
//post 获取所有的角色
export function roleList() {
  return fetch({
    url: '/role/roleList',
    method: 'post'
  })
}
//post 添加账号
export function addAccount(data) {
  return fetch({
    url: '/user/addAccount',
    method: 'post',
    data
  })
}
//post 账号编辑
export function updataAccount(data) {
  return fetch({
    url: '/user/updateAccount',
    method: 'post',
    data
  })
}
//post  账号列表
export function Accountlist(data) {
  return fetch({
    url: '/user/getPageList',
    method: 'post',
    data
  })
}


// //post 重置密码
// export function resetPassword(data) {
//     return fetch({
//         url: `/resetPassword/${data}`,
//         method: 'post'
//     })
// }

// 更新账号状态
export function updateAccountStatus(status,id){
  return fetch({
    url: `/user/updateAccountStatus?id=${id}&status=${status}`,
    method: 'post'
  })
}