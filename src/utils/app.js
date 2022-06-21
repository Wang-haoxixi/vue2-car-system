import Cookie from "js-cookie"

const tokenKey = "admin_token";
const userNameKey = "userName";

// 获取token
export const getToken = () => {
  return Cookie.get(tokenKey);
}
// 设置token
export const setToken = (val) => {
  return Cookie.set(tokenKey, val)
}
// 移除token
export const removeToken = () => {
  return Cookie.remove(tokenKey)
}
// 获取username
export const getUserName = () => {
  return Cookie.get(userNameKey);
}
// 设置username
export const setUserName = (val) => {
  return Cookie.set(userNameKey, val)
}
// 移除username
export const removeUserName = () => {
  return Cookie.remove(userNameKey)
}