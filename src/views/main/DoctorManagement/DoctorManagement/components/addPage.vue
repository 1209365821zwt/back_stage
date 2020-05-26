<template>
  <div class="mianpage">
    <el-form :model="formLine" :rules="rules" ref="formLine">
      <div class="left">
        <el-form-item label="医生头像:" prop="imgPath">
          <el-upload
            :headers="headers"
            class="avatar-uploader"
            :limit="1"
            :show-file-list="false"
            :with-credentials="true"
            :before-upload="beforeAvatarUpload"
            :on-success="importDrSuccess"
            :action="actionUrl"
          >
            <img v-if="formLine.imgPath" :src="formLine.imgPath" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="医生姓名:" prop="hcpName">
          <el-input v-model="formLine.hcpName" placeholder="请输入" maxlength="30" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="formLine.gender" clearable>
            <el-option label="男" :value="0"></el-option>
            <el-option label="女" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="departments" label="科室:">
          <el-select
            v-model="formLine.departments"
            filterable
            remote
            reserve-keyword
            placeholder="请输入"
            :remote-method="queryDept"
            @focus="deptFocus"
            :loading="loadingDept"
            @change="deptChange"
            clearable
            size="small"
          >
            <el-option v-for="(item,d) in deptList" :key="d" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医院名称:" prop="hciName">
          <el-select
            v-model="formLine.hciName"
            clearable
            remote
            filterable
            reserve-keyword
            :loading="loading"
            default-first-option
            placeholder="请选择"
            :remote-method="hosMethods"
            @change="hciChange"
          >
            <el-option
              v-for="item in hosList"
              :key="item.hciName"
              :label="item.hciName"
              :value="item.hciName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市:" prop="city">
          <el-input disabled v-model="formLine.city" placeholder="请选择"></el-input>
        </el-form-item>
      </div>
      <div class="right">
        <el-form-item label="医生ID:" prop="hcpCode">
          <el-input v-model="formLine.hcpCode" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="formLine.phone" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="职称" prop="jobTitleId">
          <el-select v-model="formLine.jobTitleId" clearable @change="jobChange">
            <el-option
              v-for="item in jobList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
            <!-- <el-option label="主任医师" :value="0"></el-option>
            <el-option label="副主任医师" :value="1"></el-option>
            <el-option label="主治医师" :value="2"></el-option>
            <el-option label="住院医师" :value="3"></el-option>
            <el-option label="其他" :value="null"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="省份:" prop="province">
          <el-input disabled v-model="formLine.province" placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-switch v-model="formLine.state" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </div>
    </el-form>
    <div class="btns">
      <el-button type="primary" @click="()=>{this.$emit('cancel',false)}">取消</el-button>
      <el-button type="primary" @click="save('formLine')">确定</el-button>
    </div>
  </div>
</template>

<script>
import { validatePhone } from "@/utils/common";
import * as API from "@/api/doctorManagement";
import Cookie from "js-cookie";
export default {
  props: {
    project: {
      type: Object,
      default: () => {
        return {
          hcpName: "",
          gender: "",
          phone: "",
          departments: "",
          jobTitle: "",
          hciName: "",
          province: "",
          city: "",
          state: "",
          hciCode: "",
          jobTitleId: "",
          imgPath: "",
          hcpCode: ""
        };
      }
    },
    dialogTitle: {
      type: String,
      default: "新建数据"
    }
  },
  data() {
    return {
      headers: { sessionId: Cookie.get("sessionId") },
      actionUrl: process.env.BASE_API + "/hcp/upload/img",
      loading: false,
      formLine: JSON.stringify(this.project),
      deptList: [],
      loadingDept: false,
      jobList: [
        {
          label: "主任医师",
          value: 0
        },
        {
          label: "副主任医师",
          value: 1
        },
        {
          label: "主治医师",
          value: 2
        },
        {
          label: "住院医师",
          value: 3
        },
        {
          label: "其他",
          value: 4
        }
      ],
      link: [
        {
          hciName: "北京协和医院",
          hciId: 1
        },
        {
          hciName: "北京儿童医院",
          hciId: 0
        }
      ],
      rules: {
        imgPath: [{ required: true, message: "请上传头像" }],
        hcpName: [
          { required: true, message: "请输入医生姓名", trigger: "blur" }
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
        departments: [
          { required: true, message: "请选择科室", trigger: "blur" }
        ],
        hciName: [
          { required: true, message: "请输入医院名称", trigger: "blur" }
        ],
        hcpCode: [{ required: true, message: "请输入医生ID", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
        ],
        jobTitleId: [{ required: true, message: "请选择职称", trigger: "blur" }]
      },
      hosList: []
    };
  },
  beforeMount() {
    this.formLine = JSON.parse(this.formLine);
    console.log(this.formLine);
    this.$forceUpdate();
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg"
          ? file.type === "image/jpeg"
          : file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG / PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isJPG && isLt2M;
    },
    importDrSuccess(res, file) {
      console.log(res, file);
      this.formLine.imgPath = res.data;
    },
    //医院名称的模糊搜索
    hosMethods(query) {
      if (query !== "") {
        //模糊搜索的接口
        this.loading = true;
        API.getHciList(query).then(res => {
          console.log(res);
          this.loading = false;
          res && res.length > 0 ? (this.hosList = res) : (this.hosList = []);
          console.log(this.hosList, 999999);
          // this.hosList=res
        });
      } else {
        this.hosList = [];
        this.loading = false;
      }
    },
    //科室更改
    jobChange(event) {
      this.jobList.forEach(item => {
        if (item.value == event) {
          this.formLine.jobTitle = item.label;
        }
      });
      console.log(this.formLine, "job");
    },
    //医院更改
    hciChange(event) {
      this.hosList &&
        this.hosList.forEach(item => {
          if (item.hciName == event) {
            this.formLine.hciCode = item.hciCode;
          }
        });
      console.log(this.formLine, "form");
    },
    //查询科室
    queryDept(query) {
      if (query !== "") {
        this.loadingDept = true;
        API.getList(query)
          .then(data => {
            console.log(data, "data");
            data && data.length > 0
              ? (this.deptList = data)
              : (this.deptList = []);
            console.log(this.deptList);
            this.loadingDept = false;
            // this.deptList = data || [];
          })
          .catch(() => {
            this.loadingDept = false;
          });
      } else {
        this.deptList = [];
      }
    },
    //科室改变
    deptChange(event) {
      this.deptList &&
        this.deptList.forEach(item => {
          if (item.name == event) {
            this.formLine.departmentsId = item.id;
          }
        });
    },
    //点击触发科室
    deptFocus() {
      let query = "";
      this.loadingDept = true;
      API.getList(query)
        .then(data => {
          this.loadingDept = false;
          data && data.length > 0
            ? (this.deptList = data)
            : (this.deptList = []);
        })
        .catch(() => {
          this.loadingDept = false;
          this.deptList = [];
        });
    },
    //保存数据
    save(formData) {
      console.log(this.formLine);
      this.$refs[formData].validate(valid => {
        if (valid) {
          this.$emit("save", this.formLine, this.dialogTitle);
        } else {
          this.$message({
            type: "warning",
            message: "请补全信息"
          });
        }
      });
    }
  }
};
</script>

<style lang='stylus'>
.mianpage {
  .el-form {
    display: flex;

    .left {
      flex: 1;
      justify-content: center;

      .el-form-item {
        display: flex;

        .el-form-item__label {
          width: 100px;
        }

        .el-input {
          width: 220px;
        }
      }
    }

    .right {
      flex: 1;
      margin-top: 160px;

      .el-form-item {
        display: flex;

        .el-form-item__label {
          width: 100px;
        }

        .el-input {
          width: 220px;
        }
      }
    }
  }

  .btns {
    margin-top: 20px;
    display: flex;
    justify-content: center;

    .el-button {
      margin-right: 20px;
    }
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-top: 20px;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 108px;
    height: 108px;
    line-height: 108px;
    text-align: center;
  }

  .avatar {
    width: 108px;
    height: 108px;
    display: block;
  }
}
</style>