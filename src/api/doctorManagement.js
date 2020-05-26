import fetch from '@/utils/fetch';
// 医生接口
//添加医生
export function addHcp(data) {
  return fetch({
    url: '/hcp/addHcp',
    method: 'post',
    data
  })
}
//分页医生
export function hcpPageList(data) {
  return fetch({
    url: '/hcp/hcpPageList',
    method: 'post',
    data
  })
}
//更新医生
export function updateList(data) {
  return fetch({
    url: '/hcp/updateHcp',
    method: 'post',
    data
  })
}
//图片上传
export function updateImage(data) {
  return fetch({
    url: '/hcp/upload/img',
    method: 'post',
    data
  })
}
//医生数据导出
export function getHcpListExcel(data) {
  return fetch({
    url: '/excelDownload/getHcpListExcel',
    method: 'post',
    data
  })
}
// 医生数据导入
export function hcpExcelImport(data) {
  return fetch({
    url: '/excelImport/hcpExcelImport',
    method: 'post',
    data
  })
}
//医院接口

//添加医院
export function addHci(data) {
  return fetch({
    url: '/hci/addHci',
    method: 'post',
    data
  })
}

// 选择医院
export function getHciList(data){
  return fetch({
    url: `/hci/getList?hciName=${data}`,
    method: 'get',
        
  })
}

//分页医院
export function hciPageList(data){
  return fetch({
    url: '/hci/hciPageList',
    method: 'post',
    data
  })
}

//更新医院
export function updateHci(data){
  return fetch({
    url: '/hci/updateHci',
    method: 'post',
    data
  })
}


//科室接口

//添加科室
export function addDepartment(data){
  return fetch({
    url: '/dept/addDepartment',
    method: 'post',
    data
  })
}

//分页科室
export function getDepartmentPageList(data){
  return fetch({
    url: '/dept/getDepartmentPageList',
    method: 'post',
    data
  })
}

//获取科室模糊查询
export function getList(data){
  return fetch({
        
    url: `/dept/getList?deptName=${data}`,
    method: 'get'
  })
}

//更新科室
export function updateDepartment(data){
  return fetch({
    url: '/dept/updateDepartment',
    method: 'post',
    data
  })
}
//省市关联接口

export function ProvinceCityList(){
  return fetch({
    url: '/systemProvinceCity/systemProvinceCityList',
    method: 'post',
        
  })
}