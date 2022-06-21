<template>
  <div>
    <!-- form组件 -->
    <WForm ref="carAddRef" :formParams="form" :formItems="formItems" :formHandles="formHandles">

      <!-- 保养日期 -->
      <template v-slot:maintainDate>
        <div style="overflow: hidden">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-date-picker v-model="form.maintainDate" :value-format="'yyyy-MM-dd'" type="date" placeholder="选择日期" style="width: 100%"></el-date-picker>
            </el-col>
            <el-col :span="20">下次保养日期：2020-12-12</el-col>
          </el-row>
        </div>
      </template>

      <!-- 能源类型 -->
      <template v-slot:energyType>
        <el-radio-group v-model="form.energyType" @change="changeEnergyType">
          <el-radio v-for="item in energyType" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          <!-- <el-radio label="1">电</el-radio>
                    <el-radio label="3">油电混合</el-radio> -->
        </el-radio-group>
        <div class="progress-bar-warp" v-if="form.energyType == 2 || form.energyType == 3">
          <i class="left-label">油量：</i>
          <el-row>
            <el-col :span="5">
              <el-slider v-model="form.oil" show-input></el-slider>
            </el-col>
          </el-row>
        </div>
        <div class="progress-bar-warp" v-if="form.energyType == 1 || form.energyType == 3">
          <i class=" left-label">电量：</i>
          <el-row>
            <el-col :span="5">
              <el-slider v-model="form.electric" show-input></el-slider>
            </el-col>
          </el-row>
        </div>
      </template>

      <!-- 车辆属性 -->
      <template v-slot:carsAttr>
        <div style="overflow: hidden">
          <!-- 添加按钮 -->
          <el-button @click="addCarAttr" type="primary" size="mini">添加车辆属性</el-button>
          <el-row :gutter="5" v-for="(item,index) in carAttr" :key="index">
            <!-- 属性名 -->
            <el-col :span="2">
              <el-input size="small" v-model="item.attrKey"></el-input>
            </el-col>
            <!-- 属性值 -->
            <el-col :span="3">
              <el-input size="small" v-model="item.attrValue"></el-input>
            </el-col>
            <!-- 删除按钮 -->
            <el-col :span="4">
              <el-button @click="deleteCarAttr(index)" size="mini" type="danger">删除</el-button>
            </el-col>
          </el-row>
        </div>
      </template>

      <!-- 车辆描述 -->
      <template v-slot:content>
        <div ref="editorDom"></div>
      </template>
    </WForm>
  </div>
</template>

<script>
import wangEditor from 'wangeditor';
// form组件
import WForm from '@/components/Form';
import { GetCarBrand, GetParking } from "@/api/common"
import { AddCar, carDetailed, carEdit } from "@/api/car"
export default {
  name: "addCar",
  components: { WForm },
  data() {
    const validateCarsImgUrl = (rule, value, callback) => {
      console.log(1111, rule, value);
      if (!value) {
        return callback("请上传车辆缩略图!")
      } else {
        callback();
      }
    };
    return {
      editor: null, // 富文本对象
      carAttr: [], // 车辆属性
      id: this.$route.query.id, // 车辆详情id
      // 能源类型
      energyType: this.$store.state.config.energyType,

      form: {
        parkingId: "", // 停车场名称
        carsBrandId: "", // 车辆品牌
        carsMode: "", // 车辆型号
        carsNumber: "", // 车牌号
        carsFrameNumber: "", // 车架号
        engineNumber: "", // 发动机号
        carsImg: "", // 车辆缩略图
        countKm: "", // 可行驶公里*
        yearCheck: "", // 是否年检( true已年检，false未年检 )
        gear: "", // 挡位( 1手动，2自动，3人工智能 )
        energyType: "", // 能源类型( 1电，2油，3混合动力 )
        electric: 100, // 电量*
        oil: 100, // 油量*
        carsAttr: "", // 车辆属性( { '颜色': '红色', '驱动': '四驱' } )
        content: "", // 车辆描述
        maintainDate: "", // 保养日期( 2022-6-3 )
        status: "", // 禁启用( true启用，false禁用 )
      },

      // 表单配置
      formItems: [
        {
          type: "Select",
          label: "停车场",
          prop: "parkingId",
          placeholder: "请选择停车场",
          _value: "id", // form组件私有的属性
          _label: "parkingName", // form组件私有的属性
          options: [],
          required: true,
        },
        {
          type: "Select",
          label: "车辆品牌",
          prop: "carsBrandId",
          placeholder: "请选择车辆品牌",
          _value: "id", // form组件私有的属性
          _label: "nameCh", // form组件私有的属性
          options: [],
          required: true,
        },
        {
          type: "Input",
          label: "车辆型号",
          placeholder: "请输入车辆型号",
          prop: "carsMode",
          width: "200px",
          required: true,
        },
        {
          type: "Input",
          label: "车牌号",
          placeholder: "请输入车牌号",
          prop: "carsNumber",
          width: "200px",
          required: true,
        },
        {
          type: "Input",
          label: "车架号",
          placeholder: "请输入车架号",
          prop: "carsFrameNumber",
          width: "200px",
          required: true,
        },
        {
          type: "Input",
          label: "发动机号",
          placeholder: "请输入发动机号",
          prop: "engineNumber",
          width: "200px",
          required: true,
        },
        {
          type: "Upload",
          label: "缩略图",
          placeholder: "请上传缩略图",
          prop: "carsImg",
          // required: true,
          validator: { required: true, validator: validateCarsImgUrl, trigger: 'change' },
        },
        {
          type: "Radio",
          label: "是否年检",
          prop: "yearCheck",
          options: [
            { value: true, label: "已年检" },
            { value: false, label: "未年检" },
          ],
          required: true,
        },
        {
          type: "Slot",
          requiredMsg: "请输入保养日期",
          slotName: "maintainDate",
          label: "保养日期",
          prop: "maintainDate",
          required: true,
        },
        {
          type: "Radio",
          label: "挡位",
          prop: "gear",
          options: [
            { value: 1, label: "手动" },
            { value: 2, label: "自动" },
            { value: 3, label: "人工智能" },
          ],
          required: true,
        },
        {
          type: "Slot",
          requiredMsg: "请选择能源类型",
          slotName: "energyType",
          label: "能源类型",
          prop: "energyType",
          required: true,
        },
        {
          type: "Radio",
          label: "禁启用",
          prop: "status",
          options: [
            { value: true, label: "启用" },
            { value: false, label: "禁用" },
          ],
          required: true,
        },
        {
          type: "Slot",
          requiredMsg: "请输入车辆属性",
          slotName: "carsAttr",
          label: "车辆属性",
          prop: "carsAttr",
          required: true,
        },
        {
          type: "Slot",
          requiredMsg: "请输入车辆描述",
          slotName: "content",
          label: "车辆描述",
          prop: "content",
          required: true,
        },
      ],

      // 表单按钮配置
      formHandles: [
        // 此处handle按钮方法必传，不然会报错
        { key: "submit", label: "确 定", type: "danger", loading: false, handle: this.onSubmit },
        { key: "reset", label: "重 置", handle: this.onReset },
      ],


    }
  },
  watch: {
    "form.content": {
      handler(value) {
        console.log(value)
        if (!this.id) return false;
        // 给富文本编辑器赋值
        this.editor.txt.html(value);
      }
    }
  },
  methods: {

    // 获取车辆详情接口
    getCarDeatil() {
      if (!this.id) return false;
      carDetailed({ id: this.id }).then((res) => {
        let data = res.data.data;
        // 遍历详情数据
        for (let key in data) {
          // 获取表单的key数组
          let formKey = Object.keys(this.form);
          // 判断每个详情数据是否包含与formKey数组中
          if (formKey.includes(key)) {
            this.form[key] = data[key];
          }
        }

        // 转义车辆属性{ attrKey: "", attrValue: "" }
        const carsAttr = JSON.parse(data.carsAttr);
        let tempArr = []; // 临时数组
        for (let key in carsAttr) { // { attrKey: "", attrValue: "" }
          let tempJson = {}; // 临时对象
          tempJson.attrKey = key; // 属性名
          tempJson.attrValue = carsAttr[key]; // 属性值
          tempArr.push(tempJson); // 将循环的当前临时对象放到临时数组中
        }
        // 将临时数组渲染至页面
        this.carAttr = tempArr;

        // 给富文本编辑器赋值
        // this.editor.txt.html(data.content);
      })
    },
    // 添加车辆属性
    addCarAttr() {
      this.carAttr.push({ attrKey: "", attrValue: "" })
    },
    // 删除车辆属性
    deleteCarAttr(index) {
      this.carAttr.splice(index, 1);
      this.formataCarAttr();
    },
    // 车辆属性格式化
    formataCarAttr() {
      let data = this.carAttr;
      // 判断车辆属性是否存在
      if (data.length <= 0) return false;
      let carsAttr = {};
      // 循环遍历格式化数据  格式：{ '颜色': '红色', '驱动': '四驱' }
      data.forEach(item => {
        // 此处判断属性值是否存在，仅存在时才能添加成功
        if (item.attrKey) carsAttr[item.attrKey] = item.attrValue;
      })
      this.form.carsAttr = JSON.stringify(carsAttr) == "{}" ? "" : JSON.stringify(carsAttr);
    },
    // 创建富文本对象
    createEditor() {
      this.editor = new wangEditor(this.$refs.editorDom);
      // 侦听富文本内容
      this.editor.config.onchange = html => {
        // console.log(html);
        this.form.content = html;
      }
      this.editor.create() // 创建富文本实例
    },
    // 获取车辆品牌接口
    getCarBrand() {
      GetCarBrand({ pageNumber: 1, pageSize: 1000 }).then(res => {
        let data = res.data.data.data;
        // 重构数据
        // let carBrands = data.map(item => {
        //     return { value: item.id, label: item.nameCh };
        // });
        // 过滤出车辆品牌项
        let item = this.formItems.filter(item => item.prop === "carsBrandId");
        // 设置车辆品牌下拉选项
        // if (item.length > 0) item[0].options = carBrands;
        if (item.length > 0) item[0].options = data;
      })
    },
    // 获取停车场接口
    getParking() {
      GetParking({ pageNumber: 1, pageSize: 1000 }).then(res => {
        let data = res.data.data.data;
        // 过滤出停车场项
        let item = this.formItems.filter(item => item.prop === "parkingId");
        // 设置停车场下拉选项
        if (item.length > 0) item[0].options = data;
      })
    },
    // 切换能源类型
    changeEnergyType() {
      this.form.oil = 0;
      this.form.electric = 0;
    },
    // 确定
    onSubmit() {
      // 提交时将车辆属性数据格式化
      this.formataCarAttr();
      // 表单校验
      this.$refs.carAddRef.$refs.WFormRef.validate(valid => {
        if (valid) {
          console.log('submit success!!')
          this.id ? this.edit() : this.add();
        } else {
          console.log('error submit!!');
        }

      })
    },
    // 编辑接口
    edit() {
      carEdit({ ...this.form, id: this.id }).then((res) => {
        if (res.data.resCode == 0) {
          this.$message.success(res.data.message);
          // 清除表单
          this.$refs.carAddRef.$refs.WFormRef.resetFields();
          // 清除车辆属性
          this.carAttr = [];
          // 清除车辆描述
          this.editor.txt.clear();
          this.$router.back();
        };
      })
    },
    // 新增接口
    add() {
      AddCar(this.form).then((res) => {
        if (res.data.resCode == 0) {
          this.$message.success(res.data.message);
          // 清除表单
          this.$refs.carAddRef.$refs.WFormRef.resetFields();
          // 清除车辆属性
          this.carAttr = [];
          // 清除车辆描述
          this.editor.txt.clear();
        };
      })
    },
    // 重置
    onReset() {
      console.log(2222)
    }
  },
  beforeMount() {
    this.getParking();
    this.getCarBrand();
    this.getCarDeatil();
  },
  mounted() {
    this.createEditor()
  },
}
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>