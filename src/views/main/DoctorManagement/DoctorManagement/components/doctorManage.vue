<template>
  <div class="doctorManege">
    <div class="top">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="医生姓名:" prop="doctorName">
          <el-input placeholder="请输入" clearable v-model="form.doctorName"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="tel">
          <el-input placeholder="请输入" v-model="form.tel" clearable></el-input>
        </el-form-item>
        <el-form-item label="医院名称:" prop="hosName">
          <el-select
            v-model="form.hosName"
            clearable
            remote
            filterable
            reserve-keyword
            default-first-option
            placeholder="请选择"
            :remote-method="hosMethods"
          >
            <el-option
              v-for="item in hosList"
              :key="item.hciName"
              :label="item.hciName"
              :value="item.hciCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="office" label="科室:">
          <el-select
            v-model="form.office"
            filterable
            remote
            reserve-keyword
            placeholder="请输入"
            :remote-method="queryDept"
            @focus="deptFocus"
            :loading="loadingDept"
            clearable
            size="small"
          >
            <el-option v-for="(item,d) in deptList" :key="d" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <!-- <el-select v-model="form.office"  clearable placeholder="请选择" size="small">
            <el-option
              v-for="(item,index) in officeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>-->
        </el-form-item>
      </el-form>
      <div class="query-reset">
        <el-button type="primary" @click="newBuild">新建</el-button>
        <el-button type="primary" class="button" @click="exportData">导出</el-button>
        <!-- :headers="headers" -->
        <el-upload
          :headers="headers"
          class="upload-demo"
          :action="actionImport"
          :show-file-list="false"
          accept=".xls, .xlsx"
          :with-credentials="true"
          :on-success="importData"
          :on-error="importDataErr"
        >
          <el-button type="primary" size="small" class="button">导入</el-button>
        </el-upload>
        <el-button type="primary" class="button" @click="download">下载导入模板</el-button>
        <QueryReset @query="query" @reset="reset('form')"></QueryReset>
      </div>
    </div>
    <div class="content">
      <el-table :data="tableData" v-loading="loadingTable" border :style="{ marginTop: '3%'}">
        <template v-for="(item, index) in labelList">
          <el-table-column :prop="item.name" :label="item.label" :key="index">
            <template slot-scope="scope">
              <template v-if="item.name=='gender'">
                <span v-if="scope.row.gender==0">男</span>
                <span v-else>女</span>
              </template>
              <template v-else-if="item.name=='jobTitleId'">
                <span v-if="scope.row.jobTitleId==0">主任医师</span>
                <span v-else-if="scope.row.jobTitleId==1">副主任医师</span>
                <span v-else-if="scope.row.jobTitleId==2">主治医师</span>
                <span v-else-if="scope.row.jobTitleId==3">住院医师</span>
                <span v-else-if="scope.row.jobTitleId==4">其他</span>
              </template>
              <template v-else-if="item.name=='state'">
                <el-switch
                  v-model="scope.row.state"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handclick(scope.row)"
                ></el-switch>
              </template>
              <template v-else-if="item.name == 'opreate'">
                <el-button type="text" @click="dialogFormVisible(scope.row)">编辑</el-button>
              </template>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <el-dialog
        width="800px"
        v-if="addPage"
        :visible="addPage"
        :before-close="closeAdd"
        :title="dialogTitle"
      >
        <addPage
          v-if="addPage"
          @cancel="closeAdd"
          @save="save"
          :project="project"
          :dialogTitle="dialogTitle"
          :edit="edit"
        ></addPage>
      </el-dialog>
      <VPagination :pageSize="page.pageSize" :page="page.page" :total="page.total" @change="reload"></VPagination>
    </div>
  </div>
</template>

<script>
import addPage from "./addPage";
import axios from "axios";
import Cookie from "js-cookie";
import { validatePhone } from "@/utils/common";
import * as API from "@/api/doctorManagement";
export default {
  components: {
    addPage
  },
  data() {
    return {
      headers: { sessionId: Cookie.get("sessionId") },
      loadingDept: false,
      deptList: [],
      officeList: [
        {
          label: "科室1",
          value: 1
        },
        {
          label: "科室1",
          value: 2
        }
      ],
      doctorList: [
        {
          name: "李兰",
          value: 0
        },
        {
          name: "张兰",
          value: 1
        }
      ],
      addPage: false,
      dialogTitle: "新建数据",
      hosList: [],
      rules: {
        tel: [{ validator: validatePhone, trigger: "blur" }]
      },
      tableData: [],
      actionImport: process.env.BASE_API + "/excelImport/hcpExcelImport",
      form: {
        hosName: "",
        doctorName: "",
        office: "",
        tel: ""
      },
      page: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      loadingTable: false,
      loading: false,
      project: {},
      edit: false,
      labelList: [
        {
          label: "医生ID",
          name: "hcpCode"
        },
        {
          label: "医生姓名",
          name: "hcpName"
        },
        {
          label: "性别",
          name: "gender"
        },
        {
          label: "手机号",
          name: "phone"
        },
        {
          label: "科室",
          name: "departments"
        },
        {
          label: "职称",
          name: "jobTitleId"
        },
        {
          label: "医院名称",
          name: "hciName"
        },
        {
          label: "省份",
          name: "province"
        },
        {
          label: "城市",
          name: "city"
        },
        {
          label: "状态",
          name: "state"
        },
        {
          label: "操作",
          name: "opreate"
        }
      ]
    };
  },
  mounted() {
    this.submitForm();
  },
  methods: {
    provinceChange(province) {
      this.form.city = "";
      this.cityList = this.provinceList[province] || [];
    },
    //页码切换
    reload(val, type) {
      console.log(val, type);
      if (type == "size") {
        this.page.page = 1;
        this.page.pageSize = val;
      } else {
        this.page.page = val;
      }
      this.submitForm();
    },
    //取消
    closeAdd() {
      this.addPage = false;
    },
    //医院名称的模糊搜索
    hosMethods(query) {
      if (query !== "") {
        //模糊搜索的接口
        API.getHciList(query).then(res => {
          console.log(res);
          res && res.length > 0 ? (this.hosList = res) : (this.hosList = []);
          console.log(this.hosList, 999999);
          // this.hosList=res
        });
      } else {
        this.hosList = [];
      }
    },
    //保存
    save(data, title) {
      console.log(data, title, "保存");
      let params = {
        city: data.city || null,
        departments: data.departments || null,
        departmentsId: data.departmentsId || null,
        gender: data.gender,
        hciCode: data.hciCode || null,
        hciName: data.hciName || null,
        hcpCode: data.hcpCode || null,
        hcpName: data.hcpName || null,
        imgPath: data.imgPath || null,
        jobTitle: data.jobTitle,
        jobTitleId: data.jobTitleId,
        phone: data.phone || null,
        province: data.province || null,
        state: data.state
      };
      if (data.id) {
        console.log("编辑数据");
        params.id = data.id;
        //编辑
        API.updateList(params)
          .then(() => {
            this.$message({
              type: "success",
              message: "编辑成功!"
            });
            this.submitForm();
          })
          .catch(() => {
            this.$message.error("编辑失败");
          });
      } else {
        console.log("新建");
        //新建
        API.addHcp(params)
          .then(res => {
            console.log(res);
            if (res == 2) {
              this.$message({
                type: "error",
                message: "医生id不能重复,新建失败"
              });
            } else {
              this.$message({
                type: "success",
                message: "保存成功!"
              });
            }

            this.submitForm();
          })
          .catch(() => {
            this.$message.error("保存失败");
          });
      }
      this.addPage = false;
    },
    //编辑
    dialogFormVisible(data) {
      this.addPage = true;
      this.dialogTitle = "编辑数据";
      this.project = data;
    },
    //新建
    newBuild() {
      this.addPage = true;
      this.dialogTitle = "新建数据";
      this.project = {
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
    },
    //修改状态
    handclick(item) {
      console.log(item.id);
      //修改状态
      // API.updateAccountStatus(item.status, item.id)
      //     .then(res => {
      //         this.$message({
      //             type: "success",
      //             message: "修改成功!"
      //         });
      //         this.submitForm();
      //     })
      //     .catch(() => {
      //         this.$message.error("修改失败!");
      //     });
    },
    //查询
    query() {
      this.page.page = 1;
      this.submitForm();
    },
    //重置
    reset(formName) {
      this.page.page = 1;
      this.$refs[formName].resetFields();
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
    //查询获取列表
    submitForm() {
      this.loadingTable = true;
      console.log(this.form, "查询");
      // eslint-disable-next-line no-unused-vars
      let param = {};
      param = {
        hcpName: this.form.doctorName ? this.form.doctorName : "",
        hciCode: this.form.hosName ? this.form.hosName : "",
        departmentsId: this.form.office ? this.form.office : "",
        phone: this.form.tel ? this.form.tel : "",
        current: this.page.page,
        size: this.page.pageSize
      };
      console.log(param, "param");
      API.hcpPageList(param)
        .then(res => {
          console.log(res);
          this.tableData = res && res.records ? res.records : [];
          this.page.total = res ? res.total : 0;
          this.loadingTable = false;
        })
        .catch(() => {
          this.loadingTable = false;
        });
    },
    //导入
    importData(res) {
      console.log(res);
      let code = res && res.code,
        msg = (res && res.message) || "导入失败";
      if (code == 200) {
        this.$message({
          type: "success",
          message: "导入成功!"
        });
        this.page.page = 1;
        this.submitForm();
      } else {
        this.$message({
          type: "error",
          message: msg
        });
      }
    },
    //导入
    importDataErr(err) {
      let errMsg = (err && err.message) || "导入失败!";
      this.$message({
        type: "error",
        message: errMsg
      });
    },
    //导出
    exportData() {
      let form = {
        departmentsId: this.form.office ? this.form.office : "",
        hciCode: this.form.hosName ? this.form.hosName : "",
        hcpName: this.form.doctorName ? this.form.doctorName : "",
        phone: this.form.tel ? this.form.tel : ""
      };
      this._exportData(form);
    },
    _exportData(form) {
      this.$loading({
        lock: true,
        text: "下载中...",
        background: "rgba(0, 0, 0, 0.7)"
      });
      axios({
        headers: {
          "Content-Type": "application/json",
          sessionId: Cookie.get("sessionId")
        },
        transformRequest: [
          function(data) {
            return JSON.stringify(data);
          }
        ],
        timeout: 100000,
        withCredentials: true,
        method: "post",
        url: `${process.env.BASE_API}/excelDownload/getHcpListExcel`,
        data: form,
        responseType: "arraybuffer"
      })
        .then(res => {
          const content = res.data;
          const blob = new Blob([content], { type: "charset=UTF-8" });
          const fileName = "医生管理.xlsx";
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
          this.$loading().close();
        })
        .catch(() => {
          this.$message.error("导出失败!");
          this.$loading().close();
        });
    },
    download() {
      window.open("static/excels/hcpListImport.xlsx", "_blank");
    }
  }
};
</script>

<style lang='stylus'>
.doctorManege {
  width: 100%;
  height: 100%;

  .top {
    display: flex;
    flex-direction: column;

    .el-form {
      display: flex;
      margin-bottom: 10px;

      .el-form-item {
        display: flex;
        margin: 0 15px;

        .el-form-item__label {
          width: 120px;
        }
      }
    }

    .query-reset {
      display: flex;

      .el-button {
        margin: 10px;
      }
    }
  }
}
</style>