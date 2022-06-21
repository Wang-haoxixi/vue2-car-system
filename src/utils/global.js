import { MessageBox } from "element-ui";
import { Message } from 'element-ui';

import { buttonPermissions } from "./buttonPermissions";

export default {
  install(Vue, option) {
    // confirm确认弹框全局注册
    Vue.prototype.confirm = (params) => {
      MessageBox.confirm(params.content, params.tip || '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: params.type,
        center: true
      }).then(() => {
        params.fn && params.fn();
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }


    // 按钮权限全局注册
    Vue.prototype.$btnPermission = buttonPermissions;


  }
}