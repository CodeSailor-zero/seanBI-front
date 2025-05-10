import AccessEnum from "../access/accessEnum";
import {UserVO} from "../../generated";

/**
 * 权限校验
 * @param loginUser
 * @param needAccess
 * @return boolean
 */
const checkAccess = (
  loginUser: UserVO,
  needAccess: string = AccessEnum.NOT_LOGIN
) => {
  //1.获取当前用户的访问权限
  const userRole = loginUser?.userRole ?? AccessEnum.NOT_LOGIN;
  //1.根据 needAccess 分为三种情况
  //页面不需要登录权限，就直接返回true
  if (needAccess === AccessEnum.NOT_LOGIN) {
    return true;
  }
  //页面需要普通用户权限
  if (needAccess === AccessEnum.USER) {
    //如果普通用户就可以访问页面，那么管理员也可以访问页面。就只有未登录不可以
    if (userRole === AccessEnum.NOT_LOGIN) {
      return false;
    }
  }
  //页面需要管理员权限
  if (needAccess === AccessEnum.ADMIN) {
    //管理员才可以访问页面，就只有未登录和普通用户不可以
    return userRole === AccessEnum.ADMIN;
  }
  return true;
};

export default checkAccess;
