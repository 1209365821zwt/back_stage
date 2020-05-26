<template>
  <div class="hosmanage">
    <div class="top">
      <el-form :model="form" ref="form">
        <el-form-item label="医院名称:" prop="hciCode">
          <!-- <el-input placeholder="请输入" clearable v-model="form.hciCode"></el-input> -->
          <el-select
            v-model="form.hciCode"
            clearable
            remote
            filterable
            reserve-keyword
            default-first-option
            placeholder="请选择"
            @change="hciChange"
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
        <el-form-item prop="province" label="省份:">
          <el-select
            v-model="form.province"
            filterable
            clearable
            size="small"
            placeholder="请选择"
            @change="provinceChange"
          >
            <el-option
              v-for="(item,index) in provinceList"
              :key="index"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="city" label="城市:">
          <el-select v-model="form.city" filterable clearable placeholder="请选择" size="small">
            <el-option
              v-for="(event) in cityList"
              :key="event.id"
              :label="event.label"
              :value="event.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="query-reset">
        <el-button type="primary" @click="newBuild">新建</el-button>
        <el-button type="primary" class="button" @click="exportData">导出</el-button>
        <QueryReset @query="query" @reset="reset('form')"></QueryReset>
      </div>
    </div>
    <div class="content">
      <el-table :data="tableData" v-loading="loadingTable" border :style="{ marginTop: '3%'}">
        <template v-for="(item, index) in labelList">
          <el-table-column :prop="item.name" :label="item.label" :key="index">
            <template slot-scope="scope">
              <template v-if="item.name == 'opreate'">
                <el-button type="text" @click="dialogFormVisible(scope.row)">编辑</el-button>
              </template>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <el-dialog
        width="600px"
        v-if="addPage"
        :visible="addPage"
        :before-close="closeAdd"
        :title="dialogTitle"
      >
        <addHos v-if="addPage" @cancel="closeAdd" @save="save" :project="project" :edit="edit"></addHos>
      </el-dialog>
      <VPagination :pageSize="page.pageSize" :page="page.page" :total="page.total" @change="reload"></VPagination>
    </div>
  </div>
</template>

<script>
// import provinceCity from 'static/jsons/areas.json'
import addHos from "./addHos";
import axios from "axios";
import Cookie from "js-cookie";
import * as API from "@/api/doctorManagement";
export default {
  components: {
    addHos
  },
  data() {
    return {
      provinceList: [],
      hosList: [],
      cityList: [],
      addPage: false,
      dialogTitle: "新建数据",
      tableData: [],
      form: {
        hciCode: "",
        hosName: "",
        province: "",
        city: ""
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
          label: "医院ID",
          name: "hciCode"
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
          label: "创建人",
          name: "createPerson"
        },
        {
          label: "创建时间",
          name: "createTime"
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
    this.init();
  },
  methods: {
    init() {
      API.ProvinceCityList().then(res => {
        this.provinceList = (res && res) || [];
      });
    },
    provinceChange(province) {
      this.form.city = "";
      if (this.provinceList && this.provinceList.length > 0) {
        this.provinceList.forEach(item => {
          if (item.label == province && item.children) {
            this.cityList = item.children;
          }
        });
      }
    },
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
    //
    hciChange(event) {
      this.hosList &&
        this.hosList.forEach(item => {
          if (item.hciCode == event) {
            this.form.hosName = item.hciName;
          }
        });
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
    save(data, isEdit) {
      console.log(data, isEdit, "保存");
      let params = {
        city: data.city || null,
        hciCode: data.hciCode || null,
        hciName: data.hciName || null,
        province: data.province || null
      };
      if (isEdit && data.id) {
        params.id = data.id;
        console.log("编辑");
        //编辑
        API.updateHci(params)
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
        //新建
        console.log("新建");
        API.addHci(params)
          .then(() => {
            this.$message({
              type: "success",
              message: "保存成功!"
            });
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
      console.log(data);
      this.addPage = true;
      this.dialogTitle = "编辑数据";
      this.project = data;
      this.edit = true;
    },
    //新建
    newBuild() {
      this.addPage = true;
      this.dialogTitle = "新建数据";
      this.project = {
        hciCode: "",
        hciName: "",
        hosName: "",
        province: "",
        city: ""
      };
      this.edit = false;
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
      console.log(this.form);
      this.loadingTable = true;
      // eslint-disable-next-line no-unused-vars
      let param = {};
      param = {
        city: this.form.city ? this.form.city : null,
        current: this.page.page,
        hciCode: this.form.hciCode ? this.form.hciCode : null,
        hciName: this.form.hosName ? this.form.hosName : null,
        province: this.form.province ? this.form.province : null,
        size: this.page.pageSize
      };
      console.log(param, 555555);
      API.hciPageList(param)
        .then(res => {
          this.tableData = res ? res.records : [];
          this.page.total = res ? res.total : 0;
          this.loadingTable = false;
        })
        .catch(() => {
          this.loadingTable = false;
        });
    },

    //导出
    exportData() {
      let form = {
        city: this.form.city ? this.form.city : null,
        hciCode: this.form.hciCode ? this.form.hciCode : null,
        hciName: this.form.hosName ? this.form.hosName : null,
        province: this.form.province ? this.form.province : null
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
        url: `${process.env.BASE_API}/excelDownload/hciExcelDownLoad`,
        data: form,
        responseType: "arraybuffer"
      })
        .then(res => {
          const content = res.data;
          const blob = new Blob([content], { type: "charset=UTF-8" });
          const fileName = "医院管理.xlsx";
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
.hosmanage {
  width: 100%;
  height: 100%;

  .top {
    display: flex;
    flex-direction: column;

    .el-form {
      display: flex;

      .el-form-item {
        display: flex;
        margin: 0 15px;
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