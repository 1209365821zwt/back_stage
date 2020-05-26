<template>
  <div class="informationTable">
    <div class="main-topform">
      <div class="topform">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
          <div class="top1">
            <el-form-item label="用户姓名:" prop="name">
              <el-input placeholder="请输入" clearable v-model="formInline.name"></el-input>
            </el-form-item>
            <el-form-item
              prop="email"
              label="账号 :"
              :rules="[
                                {
                                    required: false,
                                    message: '请输入邮箱地址',
                                    trigger: 'blur'
                                },
                                {
                                    type: 'email',
                                    message: '请输入正确的邮箱地址',
                                    trigger: ['blur', 'change']
                                }
                            ]"
            >
              <el-input placeholder="请输入" clearable v-model="formInline.email"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="search-reset">
          <QueryReset @query="query" @reset="reset('formInline')"></QueryReset>
          <el-button size="small" @click="jumpback" class="buttons">新建</el-button>
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      v-loading="loadingTable"
      border
      :row-class-name="tableRowClassName"
      :style="{ marginTop: '3%'}"
    >
      <template v-for="(item, index) in labelList">
        <el-table-column :prop="item.name" :label="item.label" :key="index">
          <template slot-scope="scope">
            <!-- <template v-if="item.name == 'accountType'">
                            <span v-if="scope.row[item.name] == 1">诺信</span>
                            <span v-else-if="scope.row[item.name] == 2"
                                >客户</span
                            >
            </template>-->
            <template v-if="item.name == 'status'">
              <!-- {{scope.row[item.name]}} -->
              <el-switch
                v-model="scope.row[item.name]"
                :active-value="1"
                :inactive-value="0"
                @change="handclick(scope.row)"
              ></el-switch>
            </template>
            <template v-else-if="item.name == 'opreate'">
              <el-button type="text" @click="dialogFormVisible(scope.row)">编辑</el-button>
            </template>
            <span v-else>{{ scope.row[item.name]}}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-dialog
      width="600px"
      v-if="addPage || newPassword"
      :visible="addPage || newPassword"
      :before-close="closeAdd"
      :title="dialogTitle"
    >
      <addAccount
        v-if="addPage"
        @cancel="closeAdd"
        @informationsave="informationsave"
        :show="show"
        :project="project"
      ></addAccount>
    </el-dialog>
    <s-ElPaginations
      :pageSize="page.pageSize"
      :page="page.page"
      :total="page.total"
      @change="reload"
    ></s-ElPaginations>
  </div>
</template>

<script>
import SElPaginations from "@/components/elPagination";
import addAccount from "./addAccount";
import * as API from "@/api/getRole";
export default {
  props: {
    tableList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    SElPaginations,
    addAccount
  },
  data() {
    return {
      loading: false,
      tableData: [],
      page: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      formInline: {
        region: "",
        email: "",
        name: ""
      },
      addPage: false,
      editPage: false,
      newPassword: false,
      dialogTitle: "新建账号",
      labelList: [
        {
          label: "账号ID",
          name: "id"
        },
        {
          label: "账号",
          name: "email"
        },
        // {
        //     label: "所属项目",
        //     name: "projectName"
        // },
        {
          label: "姓名",
          name: "name"
        },
        {
          label: "角色",
          name: "roleName"
        },
        // {
        //     label: "账号类型",
        //     name: "accountType"
        // },
        {
          label: "创建人",
          name: "createUserName"
        },
        {
          label: "创建时间",
          name: "createTime"
        },
        {
          label: "账号状态",
          name: "status"
        },
        {
          label: "操作",
          name: "opreate"
        }
      ],
      loadingTable: false,
      projectlist: [],
      project: {},
      show: true
    };
  },
  mounted() {
    this.submitForm();
  },
  methods: {
    tableRowClassName({ rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    reload(val, type) {
      if (type == "size") {
        this.page.page = 1;
        this.page.pageSize = val;
      } else {
        this.page.page = val;
      }
      this.submitForm();
    },

    //查询获取列表
    submitForm() {
      this.loadingTable = true;
      console.log(this.$refs["formInline"]);
      this.$refs["formInline"].validate(valid => {
        if (valid) {
          console.log(this.formInline, "查询");
        } else {
          this.$message({
            type: "warning",
            message: "请输入正确信息"
          });
        }
      });
      // eslint-disable-next-line no-unused-vars
      let param = {};
      param = {
        name: this.formInline.name ? this.formInline.name : null,
        email: this.formInline.email ? this.formInline.email : null,
        current: this.page.page,
        size: this.page.pageSize
      };
      API.Accountlist(param)
        .then(res => {
          console.log(res);
          this.tableData = res ? res.records : [];
          this.page.total = res ? res.total : 0;
          this.loadingTable = false;
        })
        .catch(() => {
          this.loadingTable = false;
        });
    },
    handclick(item) {
      //修改状态
      API.updateAccountStatus(item.status, item.id)
        .then(() => {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.submitForm();
        })
        .catch(() => {
          this.$message.error("修改失败!");
        });
    },
    closeAdd() {
      this.addPage = this.newPassword = false;
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
    //新建
    jumpback() {
      this.addPage = true;
      this.project = {};
      this.dialogTitle = "新建数据";
      this.show = true;
    },
    informationsave(val) {
      console.log(val);
      let param = {
        email: val.email || null,
        name: val.name || null,
        password: val.password || null,
        roleId: val.roleId,
        status: val.status,
        roleName: val.roleName || null
      };
      if (val.id) {
        param.id = val.id;
        //编辑
        API.updataAccount(param)
          .then(res => {
            console.log(res);
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
        API.addAccount(param)
          .then(() => {
            this.$message({
              type: "success",
              message: "保存成功!"
            });
            this.submitForm();
          })
          .catch(error => {
            console.log(error, 456);
            let msg = error.msg || "保存失败";
            this.$message.error(msg);
          });
      }
      this.addPage = this.newPassword = false;
    },
    dialogFormVisible(row) {
      this.addPage = true;
      this.dialogTitle = "编辑数据";
      this.project = row;
      this.show = false;
    }
  }
};
</script>

<style lang="stylus">
.informationTable {
  .el-pagination.is-background {
    text-align: right;
    margin-top: 20px;
  }

  .el-form.demo-ruleForm {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .el-form-item.el-form-item--feedback {
    flex-shrink: 0;
    width: 32%;
    text-align: left;
  }

  .btns {
    margin-left: 25px;
    margin-bottom: 30px;
  }

  .topform {
    width: 100%;
    display: flex;

    .top1 {
      display: flex;

      .el-form-item {
        margin-right: 34px;
      }
    }
  }

  .search-reset {
    display: flex;

    .buttons {
      margin-left: 20px;
      height: 32px;
    }
  }
}
</style>
