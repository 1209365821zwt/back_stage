<template>
  <div class="addhos">
    <div class="userform" :style="{ marginTop: '10%' }">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item prop="hciCode" label="医院ID">
          <el-input v-model="ruleForm.hciCode" :disabled="edit" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="医院名称 :" prop="hciName">
          <el-input v-model="ruleForm.hciName" placeholder="请输入" maxlength="50" clearable></el-input>
        </el-form-item>
        <el-form-item prop="province" label="省份:">
          <el-select
            v-model="ruleForm.province"
            filterable
            clearable
            size="small"
            placeholder="请选择"
            @change="provinceChange"
          >
            <el-option
              v-for="(item) in provinceList"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="city" label="城市:">
          <el-select v-model="ruleForm.city" filterable clearable placeholder="请选择" size="small">
            <el-option
              v-for="(event) in cityList"
              :key="event.id"
              :label="event.label"
              :value="event.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div class="btns">
        <el-button size="small" @click="save('ruleForm')">保存</el-button>
        <el-button size="small" @click="() => {this.$emit('cancel')}">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import provinceCity from 'static/jsons/areas.json'
import * as API from "@/api/doctorManagement";
export default {
  props: {
    project: {
      type: Object,
      default: () => {
        return {
          hciCode: "",
          hciName: "",
          hosName: "",
          province: "",
          city: ""
        };
      }
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ruleForm: JSON.stringify(this.project),
      provinceList: [],
      cityList: [],
      obj: {},
      rules: {
        hciCode: [
          {
            required: true,
            message: "请输入医院ID"
          }
        ],
        hciName: [
          {
            required: true,
            message: "请输入医院名称"
          },
          {
            max: 50,
            message: "长度在 50 个字符内"
          }
        ],
        province: [
          {
            required: true,
            message: "请选择省份"
          }
        ],
        city: [
          {
            required: true,
            message: "请选择城市"
          }
        ]
      }
    };
  },
  beforeMount() {
    this.ruleForm = JSON.parse(this.ruleForm);
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("save", this.ruleForm, this.edit);
        } else {
          this.$message({
            type: "warning",
            message: "请补全信息"
          });
        }
      });
    },
    init() {
      API.ProvinceCityList().then(res => {
        console.log(res);
        this.provinceList = (res && res) || [];
      });
    },
    provinceChange(province) {
      this.ruleForm.city = "";
      if (this.provinceList && this.provinceList.length > 0) {
        this.provinceList.forEach(item => {
          if (item.label == province && item.children) {
            this.cityList = item.children;
          }
        });
      }
      console.log(this.cityList, 9999);
    }
  },
  created() {},
  mounted() {
    this.init();
  }
};
</script>

<style lang="stylus">
.addhos {
  width: 100%;
  height: 100%;
  margin-top: -50px;

  .userform {
    width: 300px;
    height: 70%;
    margin: auto;

    .el-form-item__label {
      text-align: left !important;
    }
  }

  .usertop {
    margin-top: 20px;
  }

  .save-button {
    width: 100%;
    position: absolute;
    bottom: 10%;

    .btns {
      width: 100%;
      margin-left: 50px;
    }
  }

  .btns {
    display: flex;
    justify-content: center;
  }
}
</style>
