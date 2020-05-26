<template>
  <div class="officemanage">
    <div class="top">
      <el-form :model="form" ref="form">
        <el-form-item label="科室名称:" prop="officeName">
          <el-input placeholder="请输入" clearable v-model="form.officeName"></el-input>
          <!-- <el-select         
                        v-model="form.officeName"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入"
                        :remote-method="queryDept"
                        @focus="deptFocus"
                        :loading="loadingDept"
                        clearable
                        size="small">
                        <el-option
                            v-for="(item,d) in deptList"
                            :key="d"
                            :label="item.name"
                            :value="item.name">
                        </el-option>
          </el-select>-->
        </el-form-item>
      </el-form>
      <div class="query-reset">
        <el-button type="primary" @click="newBuild">新建</el-button>
        <QueryReset @query="query" @reset="reset('form')"></QueryReset>
      </div>
    </div>
    <div class="content">
      <el-table :data="tableData" v-loading="loadingTable" border :style="{ marginTop: '3%'}">
        <template v-for="(item, index) in labelList">
          <el-table-column :prop="item.name" :label="item.label" :key="index">
            <template slot-scope="scope">
              <template v-if="item.name=='index'">
                <span>{{scope.$index+1}}</span>
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
        width="600px"
        v-if="addPage"
        :visible="addPage"
        :before-close="closeAdd"
        :title="dialogTitle"
      >
        <addOffice v-if="addPage" @cancel="closeAdd" @save="save" :project="project"></addOffice>
      </el-dialog>
      <VPagination :pageSize="page.pageSize" :page="page.page" :total="page.total" @change="reload"></VPagination>
    </div>
  </div>
</template>

<script>
import addOffice from "./addOffice";
import * as API from "@/api/doctorManagement";

export default {
  components: {
    addOffice
  },
  data() {
    return {
      addPage: false,
      dialogTitle: "新建数据",
      loadingDept: false,
      deptList: [],
      tableData: [],

      form: {
        officeName: ""
      },
      page: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      loadingTable: false,
      project: {},
      labelList: [
        {
          label: "序号",
          name: "index"
        },
        {
          label: "科室名称",
          name: "name"
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
  },
  methods: {
    provinceChange(province) {
      this.form.city = "";
      this.cityList = this.provinceList[province] || [];
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
    //取消
    closeAdd() {
      this.addPage = false;
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
    //保存
    save(data) {
      console.log(data, "保存");
      let params = {
        name: data.name
      };
      if (data.id) {
        params.id = data.id;
        console.log(params, "编辑");
        //编辑
        API.updateDepartment(params)
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
        console.log(params, "新建");
        //新建
        API.addDepartment(params)
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
    },
    //新建
    newBuild() {
      this.addPage = true;
      this.dialogTitle = "新建数据";
      this.project = {
        officeName: ""
      };
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
        name: this.form.officeName ? this.form.officeName : null,
        current: this.page.page,
        size: this.page.pageSize
      };
      console.log(param);
      API.getDepartmentPageList(param)
        .then(res => {
          console.log(res);
          this.tableData = res ? res.records : [];
          this.page.total = res ? res.total : 0;
          this.loadingTable = false;
        })
        .catch(() => {
          this.loadingTable = false;
        });
    }
  }
};
</script>

<style lang='stylus'>
.officemanage {
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