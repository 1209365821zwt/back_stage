<template>
  <div class="main-userform">
    <div class="userform" :style="{ marginTop: '10%' }">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item prop="email" label="账号1">
          <el-input v-model="ruleForm.email" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="姓名 :" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入" maxlength="30" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色 :" prop="roleName">
          <el-select v-model="ruleForm.roleName" placeholder="请选择" clearable @change="changeRole">
            <el-option
              v-for="item in roleData"
              :key="item.id"
              :label="item.roleName"
              :value="item.roleName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态" prop="status">
          <el-switch v-model="ruleForm.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="登录密码 :" prop="password">
          <el-input placeholder="请输入密码" v-model="ruleForm.password" show-password></el-input>
        </el-form-item>
      </el-form>

      <div class="btns">
        <el-button size="small" @click="save('ruleForm')">保存</el-button>
        <el-button
          size="small"
          @click="
                        () => {
                            this.$emit('cancel');
                        }
                    "
        >取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as API from "@/api/getRole";
export default {
  props: {
    project: {
      type: Object,
      default: () => {
        return {
          id: "",
          email: "",
          name: "",
          roleId: "",
          status: "",
          password: "",
          roleName: ""
        };
      }
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      ruleForm: JSON.stringify(this.project),
      projectData: [],
      roleData: [],
      obj: {},
      rules: {
        email: [
          {
            required: true,
            message: "请输入邮箱地址"
          },
          {
            type: "email",
            message: "请输入正确的邮箱地址"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入姓名"
          },
          {
            max: 50,
            message: "长度在 50 个字符内"
          }
        ],
        roleName: [
          {
            required: true,
            message: "请选择角色"
          }
        ],

        status: [
          {
            required: true,
            message: "请选择账号状态"
          }
        ],
        password: [
          {
            required: this.show,
            message: "请输入登录密码"
          },
          {
            max: 20,
            message: "长度在 20 个字符内"
          }
        ]
      }
    };
  },
  beforeMount() {
    this.ruleForm = JSON.parse(this.ruleForm);
    console.log(this.ruleForm, 66666666);
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("informationsave", this.ruleForm);
        } else {
          this.$message({
            type: "warning",
            message: "请补全信息"
          });
        }
      });
    },
    init() {
      API.roleList().then(res => {
        res && res.length > 0 ? (this.roleData = res) : (this.roleData = []);
      });
    },
    changeRole(event) {
      console.log(event);
      this.roleData.forEach(item => {
        if (item.roleName == event) {
          console.log(item.id);
          this.ruleForm.roleId = item.id;
        }
      });
    }
  },
  created() {
    this.init();
  },
  mounted() {
    // this.ruleForm.roleName= this.ruleForm.roleName==null ?null: this.ruleForm.roleName;
    console.log(this.show);
  }
};
</script>

<style lang="stylus">
.main-userform {
  width: 100%;
  height: 100%;

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
}
</style>
