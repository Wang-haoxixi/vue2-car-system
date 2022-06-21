import { GetCategory } from "@/api/news.js";

const actions = { //回调处理事情
  getInfoCate(content, requestData){
    return new Promise((res,rej) => {
      GetCategory().then(response => {
        res(response.data.data);
      }).catch(error => {
        rej(error);
      })
    })
  }
}

export default {
  namespaced:true,
  actions,
}