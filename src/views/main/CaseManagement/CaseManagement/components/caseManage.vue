<template>
  <div class="caseManage">
    <div class="top">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="患者姓名:" prop="caseName">
          <el-input placeholder="请输入" clearable v-model="form.caseName"></el-input>
        </el-form-item>
        <el-form-item label="患者手机号:" prop="tel">
          <el-input placeholder="请输入" v-model="form.tel" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否加入随访" prop="isJoin">
          <el-select v-model="form.isJoin" clearable>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="随访医院:" prop="followHos">
          <el-select
            v-model="form.followHos"
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
        <el-form-item label="随访医生:" prop="followDoc">
          <el-input placeholder="请输入" clearable v-model="form.followDoc"></el-input>
        </el-form-item>
      </el-form>
      <div class="query-reset" style="marginLeft:25px;">
        <el-button type="primary" class="button" @click="exportData">导出</el-button>
        <QueryReset @query="query" @reset="reset('form')"></QueryReset>
      </div>
    </div>
    <div class="content">
      <el-table :data="tableData" v-loading="loadingTable" border :style="{ marginTop: '3%'}">
        <template v-for="(item, index) in labelList">
          <el-table-column :prop="item.name" :label="item.label" :key="index">
            <template slot-scope="scope">
              <!-- <template v-if="item.name=='sex'">                        
                         <span v-if="scope.row.sex==1">男</span>
                         <span v-else>女</span>
              </template>-->
              <template v-if="item.name == 'opreate'">
                <el-button type="text" @click="check(scope.row)">查看</el-button>
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
        <detailCase v-if="addPage" @cancel="closeAdd" :project="project" :dialogTitle="dialogTitle"></detailCase>
      </el-dialog>
      <VPagination :pageSize="page.pageSize" :page="page.page" :total="page.total" @change="reload"></VPagination>
    </div>
  </div>
</template>

<script>
import detailCase from "./detailCase";
import axios from "axios";
import { validatePhone } from "@/utils/common";
import { getHciList } from "@/api/doctorManagement";
import * as API from "@/api/patientList";
import Cookie from "js-cookie";
export default {
  components: {
    detailCase
  },
  data() {
    return {
      hosList: [],
      followDocList: [{ cName: "李兰", cId: "1" }],
      loadingHospital: false,
      addPage: false,
      dialogTitle: "患者信息",
      rules: {
        tel: [{ validator: validatePhone, trigger: "blur" }]
      },
      tableData: [],

      form: {
        caseName: "",
        isJoin: "",
        tel: "",
        followHos: "",
        followDoc: ""
      },
      page: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      loadingTable: false,
      project: {},
      edit: false,
      labelList: [
        {
          label: "微信昵称",
          name: "nickname"
        },
        {
          label: "是否加入随访",
          name: "followName"
        },
        {
          label: "患者姓名",
          name: "patientName"
        },
        {
          label: "性别",
          name: "genderName"
        },
        {
          label: "患者手机号",
          name: "phone"
        },
        {
          label: "加入随访时间",
          name: "followTime"
        },
        {
          label: "随访医院",
          name: "hciName"
        },
        {
          label: "随访科室",
          name: "departmentName"
        },
        {
          label: "随访医生",
          name: "hcpName"
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
    //页码切换
    reload(val, type) {
      if (type == "size") {
        this.page.page = 1;
        this.page.pageSize = val;
      } else {
        this.page.page = val;
      }
      this.submitForm();
    },
    //医院名称的模糊搜索
    hosMethods(query) {
      if (query !== "") {
        //模糊搜索的接口
        this.loadingHospital = true;
        getHciList(query).then(res => {
          console.log(res);
          res && res.length > 0 ? (this.hosList = res) : (this.hosList = []);
          this.loadingHospital = false;
          console.log(this.hosList, 999999);
          // this.hosList=res
        });
      } else {
        this.hosList = [];
        this.loadingHospital = false;
      }
    },
    //患者姓名模糊搜索
    queryHospital(query) {
      console.log(query);
      if (!query == "") {
        this.loadingHospital = true;
        // let params = {
        //   keywords: query
        // };
        //接口联调
      } else {
        this.loadingHospital = false;
      }
    },
    //模糊查询患者医院
    queryFollowHos(query) {
      console.log(query);
      if (!query == "") {
        this.loadingHospital = true;
      } else {
        this.loadingHospital = false;
      }
    },
    //模糊查询患者医生
    queryFollowDoc(query) {
      console.log(query);
      if (!query == "") {
        this.loadingHospital = true;
      } else {
        this.loadingHospital = false;
      }
    },
    //取消
    closeAdd() {
      this.addPage = false;
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
    //查询获取列表
    submitForm() {
      this.loadingTable = true;
      console.log(this.form, "查询");
      // eslint-disable-next-line no-unused-vars
      let param = {};
      param = {
        hciCode: (this.form.followHos && this.form.followHos) || null,
        hcpName: (this.form.followDoc && this.form.followDoc) || null,
        isFollow: (this.form.isJoin && +this.form.isJoin) || null,
        patientName: (this.form.caseName && this.form.caseName) || null,
        phone: (this.form.tel && this.form.tel) || null,
        current: this.page.page,
        size: this.page.pageSize
      };
      console.log(param, "param");
      API.pageList(param)
        .then(res => {
          console.log(res, "case");
          this.tableData = res ? res.records : [];
          this.page.total = res ? res.total : 0;
          this.loadingTable = false;
        })
        .catch(() => {
          this.loadingTable = false;
        });
    },
    //查看数据
    check(data) {
      console.log(data);
      this.addPage = true;
      this.project = data;
    },
    //导出
    exportData() {
      let form = {
        hciCode: (this.form.followHos && this.form.followHos) || null,
        hcpName: (this.form.followDoc && this.form.followDoc) || null,
        isFollow: (this.form.isJoin && +this.form.isJoin) || null,
        patientName: (this.form.caseName && this.form.caseName) || null,
        phone: (this.form.tel && this.form.tel) || null
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
        url: `${process.env.BASE_API}/excelDownload/getPatientListExcel`,
        data: form,
        responseType: "arraybuffer"
      })
        .then(res => {
          const content = res.data;
          const blob = new Blob([content], { type: "charset=UTF-8" });
          const fileName = "患者管理.xlsx";
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
    }
  }
};
</script>

<style lang='stylus'>
.caseManage {
  width: 100%;
  height: 100%;

  .top {
    display: flex;
    flex-direction: column;

    .el-form {
      display: flex;
      margin-bottom: 10px;
      flex-wrap: wrap;

      .el-form-item {
        display: flex;
        margin: 10px;

        .el-form-item__label {
          width: 120px;
          text-align: center;
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