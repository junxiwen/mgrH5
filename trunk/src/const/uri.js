export const CDN_BASE = cdnBase;
export const URI_BASE = uriBase;

export const URI_LOGIN = URI_BASE + '/sysUser/login';
export const URI_LOGOUT = URI_BASE + '/sysUser/logout';
export const URI_CHANGEPWD = URI_BASE + '/sysUser/changePwd';

export const URI_SYSUSER = URI_BASE + '/sysUser'; // 增删改查全是用这一个，所以一定要符合rest规范
export const URI_SYSROLE = URI_BASE + '/sysRole';
export const URI_SYSRESOURCE = URI_BASE + '/sysResource';
export const URI_SYSROLE_RESOURCE = URI_BASE + '/sysResource/sysResource';
export const URI_SYSROLE_RESOURCELIST = URI_BASE + '/sysResource/sysResourceList';
export const URI_GETROLEIDBYUSERID = URI_BASE + '/sysResource/getRoleIdByUserId';

//用户列表
export const URI_USERINFO = URI_BASE + '/userInfo';
export const URI_MODIFYUSER = URI_BASE + '/userInfo/modifyUserNickName';


export const URI_NEWS_LIST = URI_BASE + '/news';
export const URI_NEWS_ADD = URI_BASE + '/news/add';
export const URI_NEWS_UPDATE = URI_BASE + '/news/update';

