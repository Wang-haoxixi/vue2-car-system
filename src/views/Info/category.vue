<template>
  <div class="infoCate-warp">
    <el-button type="danger" @click="handleAddFirst({ type: 'cate_first_add' })" class="button-first">添加一级分类</el-button>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="cate-item" v-for="(item, index) in cateList.data" :key="index">
          <h4 class="clearfloat">
            <svg-icon iconName="plus"></svg-icon>
            <span>{{ item.category_name }}</span> 
            <div class="btns pull-right">
              <el-button round type="danger" size="mini" @click="handleEditFirst({ type: 'cate_first_edit', item, })">编辑</el-button>
              <el-button round type="success" size="mini" @click="handleAddChildren({ type: 'cate_children_add', item })">添加子级</el-button>
              <el-button round size="mini" @click="handleDeleteFirst(item, index)">删除</el-button>
            </div>
          </h4>
          <ul>
            <li v-for="(ele, ix) in item.children" :key="ix">
              <span>{{ ele.category_name }}</span>
              <div class="btns pull-right">
                <el-button round type="danger" size="mini" @click="handleEditChildren({ type: 'cate_children_edit', item })">编辑</el-button>
                <el-button round size="mini">删除</el-button>
              </div>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="menu-title">一级分类编辑</div>
        <el-form ref="form" :model="form" label-width="120px" class="cate-form">
          <el-form-item label="一级分类名称：">
            <el-input v-model="form.firstName" :disabled="disabled_first"></el-input>
          </el-form-item>
          <el-form-item label="二级分类名称：">
            <el-input v-model="form.secondName" :disabled="disabled_second"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" :disabled="disabled_botton" :loading="loading" @click="handleConfrim">确定</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { reactive, ref, isRef, toRefs, onMounted, computed } from "@vue/composition-api";
import { AddParent, GetCategory, EditCategory, DeleteCategory, AddChildrenCategory } from '@/api/news.js'
import SvgIcon from '../../icons/SvgIcon.vue';
export default {
  components: { SvgIcon },
  name: "infoCate",
  setup(props, { root }){
    // 页面DOM元素挂载完成时触发
    onMounted(() => {
      getCategory();
    });
    const submit_button_type = ref("");
    const disabled_first = ref(true);
    const disabled_second = ref(true);
    const disabled_botton = ref(true);
    // 确定按钮加载
    const loading = ref(false);

    const form = reactive({
      firstName: "",
      secondName: "",
    });
    const cateList = reactive({
      data: [], // 分类数据
      currentItem: '', // 当前分类信息
    });
    
    // -------------------------------------------------

    // 添加一级分类按钮
    const handleAddFirst = (data) => {
      submit_button_type.value = data.type;
      disabled_first.value = false;
      disabled_second.value = true;
      disabled_botton.value = false;
    };
    // 添加子级
    const handleAddChildren = (data) => {
      cateList.currentItem = data.item;
      form.firstName = data.item.category_name // 显示一级
      submit_button_type.value = data.type;
      disabled_first.value = true;
      disabled_second.value = false;
      disabled_botton.value = false;
    };
    // 编辑一级分类
    const handleEditFirst = (data) => {
      submit_button_type.value = data.type;
      disabled_first.value = false;
      disabled_second.value = true;
      disabled_botton.value = false;
      // 回填一级分类
      form.firstName = data.item.category_name;
      // 存储当前值
      cateList.currentItem = data.item;
    };
    // 编辑子级
    const handleEditChildren = (data) => {
      form.firstName = data.item.category_name // 显示一级
      submit_button_type.value = data.type;
      disabled_first.value = true;
      disabled_second.value = false;
      disabled_botton.value = false;
    };
    // 删除一级分类
    const handleDeleteFirst = (item, index) => {
      DeleteCategory({ categoryId: item.id }).then(response => {
        console.log(response);
        if(response.data.resCode == 0){
          root.$message.success(response.data.message);
          // 删除当前分类信息
          cateList.data.splice(index, 1);
        }

      })
    };
    // 获取信息分类（有子级分类）
    const getCategory = () => {
      // 调用vuex中的获取分类数据方法
      root.$store.dispatch("common/getInfoCate").then(response => {
        cateList.data = response;
      })
    };
    // 确定 按钮
    const handleConfrim = () => {
      if(submit_button_type.value == "cate_first_add"){ addFirstCate(); /* add first */ };
      if(submit_button_type.value == "cate_children_add"){ addChildren(); /* add children */ };
      if(submit_button_type.value == "cate_first_edit"){ editFirst(); /* edit first */ };
    };
    // add first
    const addFirstCate = () => {
      loading.value = true; // 开启加载中
      AddParent({ categoryName: form.firstName }).then(res => {
        if(res.data.resCode == 0){ // 添加成功的回调
          root.$message.success("添加一级分类成功！");
          loading.value = false; // 关闭加载中
          form.firstName = ""; // 置空输入框数据
          form.secondName = "";
          cateList.data.push(res.data.data); // 向cateList分类信息数组末尾添加新增返回的数据
        }
      }).catch(err => {
        loading.value = false; // 关闭加载中
      })
    };
    //  add children
    const addChildren = () => {
    //   "categoryName":"智能家居",
    // "parentId":"243"
      let reqData = {
        categoryName: form.secondName,
        parentId: cateList.currentItem.id,
      }
      AddChildrenCategory(reqData).then(res => {
        console.log(res);
        if(res.data.resCode == 0){
          root.$message.success(res.data.message);
          getCategory();
        }
      })
    };
    //  edit first
    const editFirst = () => {
      let responseData = {
        categoryName: form.firstName,
        id: cateList.currentItem.id,
      }
      EditCategory(responseData).then(response => {
        console.log(response);
        if(response.data.resCode == 0){
          root.$message.success(response.data.message);
          // 清空数据
          form.firstName = "";
          form.secondName = "";
        }
      })
    };
    return{
      // value
      submit_button_type,
      disabled_first,
      disabled_second,
      disabled_botton,
      loading,
      form,
      cateList,
      // methods
      handleAddFirst,
      handleAddChildren,
      handleEditFirst,
      handleEditChildren,
      handleDeleteFirst,
      handleConfrim,
      addFirstCate,

    }
  }
};
</script>

<style lang="scss" scoped>
.infoCate-warp {
  .button-first{
    margin-bottom: 20px;
  }
  .cate-item:first-of-type{
    &::before{
      top: 22px;
    }
  }
  .cate-item:last-of-type{
    &::before{
      bottom: 22px;
    }
  }
  .cate-item{
    position: relative;
    &::before{
      content: "";
      position: absolute;
      left: 28px;
      top: 0px;
      bottom: 0;
      width: 30px;
      border-left: 1px dashed #344a5f;
      z-index: 2;
    }
    h4{
      padding-left: 20px;
      line-height: 40px;
      position: relative;


      svg{
        font-size: 16px;
        position: absolute;
        top: 12px;
      }
      span{
        margin-left: 28px;
      }
    }
    .btns{
      transition: all .5s ease;
      display: none;
      padding-right: 20px;
      font-size: 12px;
    }
    li{
      margin-left: 28px;
      padding-left: 42px;
      line-height: 40px;
      position: relative;
      &::before{
        content: "";
        position: absolute;
        left: 0;
        top: 20px;
        width: 30px;
        border-bottom: 1px dashed #344a5f;
      }
    }
    h4, li{
      transition: all .5s ease;
      &:hover{
        background: #f3f3f3;
        .btns{
          display: block;
        }
      }
    }
  }
  .menu-title{
    line-height: 40px;
    background: #f3f3f3;
    padding-left: 22px;
  }
  .cate-form{
    width: 385px;
    margin-top: 26px;
    .el-form-item{
      margin-bottom: 24px;
    }
  }
}
</style>