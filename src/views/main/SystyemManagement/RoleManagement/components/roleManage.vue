<template>
  <div class="roleTable">
    <div class="main-topform">
      <div class="topform">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
          <div class="top1">
            <el-form-item label="角色名称：" prop="name">
              <el-input placeholder="请输入" v-model="formInline.name" clearable></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="search-reset">
          <QueryReset @query="query" @reset="reset('formInline')"></QueryReset>
          <el-button @click="jumpback" class="button">新建</el-button>
        </div>
      </div>
    </div>
    <el-table :data="tableData" v-loading="loadingTable" border :row-class-name="tableRowClassName">
      <template v-for="(item, index) in labelist">
        <el-table-column :prop="item.name" :label="item.label" :key="index">
          <template slot-scope="scope">
            <template v-if="item.name=='index'">
              <span>{{scope.$index+1}}</span>
            </template>
            <template v-else-if="item.name == 'operate'">
              <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
              <el-button type="text" size="small" @click="Authority(scope.row)">配置权限</el-button>
              <el-button type="text" size="small" @click="delRole(scope.row)">删除</el-button>
            </template>
            <span v-else>{{ scope.row[item.name] }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-dialog
      width="600px"
      v-if="addPage || editPage || AuthorityRole"
      :visible="addPage || editPage || AuthorityRole"
      :before-close="closeAdd"
      :title="dialogTitle"
    >
      <addRole
        v-if="addPage || editPage"
        @save="save"
        @cancle="cancle"
        :object="object"
        :dialogTitle="dialogTitle"
      ></addRole>
      <Authority
        v-else-if="AuthorityRole"
        :dataList="dataList"
        :selectedList="selectedList"
        @Authoritycancel="Authoritycancel"
        @Authoritysave="Authoritysave"
        :ind="ind"
      ></Authority>
    </el-dialog>
    <VPagination :pageSize="page.pageSize" :page="page.page" :total="page.total" @change="reload"></VPagination>
  </div>
</template>

<script>
import addRole from "./addRole";
import Authority from "./configAuthority";
import * as API from "@/api/getRole";
export default {
  components: {
    addRole,
    Authority
  },
  data() {
    return {
      loading: false,
      tableData: [],
      dialogTitle: "添加数据",
      labelist: [
        {
          label: "序号",
          name: "index"
        },
        {
          label: "角色名称",
          name: "roleName"
        },
        {
          label: "角色描述",
          name: "roleDescribe"
        },
        {
          label: "创建人",
          name: "createUserName"
        },
        {
          label: "创建时间",
          name: "createTime"
        },
        {
          label: "操作",
          name: "operate"
        }
      ],
      loadingTable: false,
      value: true,
      formInline: {
        name: ""
      },
      addPage: false,
      editPage: false,
      AuthorityRole: false,
      page: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      object: {
        name: "",
        textarea: ""
      },
      ind: 0,
      dataList: [],
      selectedList: []
    };
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
    //点击编辑数据
    handleClick(row) {
      this.editPage = true;
      this.dialogTitle = "编辑数据";
      this.object = {
        id: row.id,
        name: row.roleName,
        textarea: row.roleDescribe
      };
    },
    //获取列表
    submitForm() {
      console.log(this.formInline, "查询");
      this.loadingTable = true;
      //  // eslint-disable-next-line no-unused-vars
      let param = {};
      param = {
        current: this.page.page,
        size: this.page.pageSize,
        roleName: this.formInline.name
      };
      API.getRole(param)
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
    //点击关闭弹窗
    closeAdd() {
      this.addPage = this.editPage = this.AuthorityRole = false;
    },
    //新建跳转
    jumpback() {
      this.addPage = true;
      this.object = {
        name: "",
        textarea: ""
      };
      this.dialogTitle = "新添数据";
    },
    //重置
    reset(formName) {
      this.page.page = 1;
      this.$refs[formName].resetFields();
    },
    //分页切换
    reload(val, type) {
      if (type == "size") {
        this.page.page = 1;
        this.page.pageSize = val;
      } else {
        this.page.page = val;
      }
      this.submitForm();
    },

    //查询
    query() {
      this.page.page = 1;
      this.submitForm();
    },
    //数据保存
    save(val) {
      console.log(val);
      this.addPage = this.editPage = this.AuthorityRole = false;
      let params = {
        roleDescribe: val.textarea,
        roleName: val.name
      };
      if (val.id) {
        params.id = val.id;
        console.log("编辑");
        API.updataRole({
          id: val.id,
          roleDescribe: val.textarea,
          roleName: val.name
        })
          .then(() => {
            this.$message({
              type: "success",
              message: "编辑成功!"
            });
            this.submitForm();
          })
          .catch(() => {
            this.$message.error("编辑失败!");
          });
      } else {
        console.log("新建");
        API.addRole({
          roleDescribe: val.textarea,
          roleName: val.name
        })
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
    },
    //取消
    cancle() {
      this.addPage = this.editPage = this.AuthorityRole = false;
    },
    //删除
    delRole(row) {
      console.log(row.id);
      this.$confirm("删除会禁用该角色下所有账号，确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API.delRole(Number(row.id))
            .then(() => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.submitForm();
            })
            .catch(() => {
              this.$message.error("删除失败");
            });
        })
        .catch(() => {
          this.$message.warning("操作取消");
        });
    },

    //获取权限列表
    Authority(row) {
      this.dialogTitle = "配置权限";
      this.ind = row.id;
      API.AuthorityRole(Number(row.id)).then(res => {
        console.log(res.roleResponseList);
        this.dataList = res ? res.roleResponseList : [];
        this.selectedList = res ? res.authExist : [];
        // this.dataList.forEach(item => {
        //     let childrenList = []
        //     if(item.children && item.children.length){
        //         item.children.map(item => {
        //             console.log( this.selectedList.splice(this.selectedList.indexOf(item.id),1))
        //             if(this.selectedList.includes(item.id) && !this.selectedList.includes(item.id)){
        //                 this.selectedList.splice(this.selectedList.indexOf(item.id),1)
        //             }
        //         })
        //     }
        // })
        this.AuthorityRole = true;
      });
    },
    //权限保存
    Authoritysave(data, id) {
      this.addPage = this.editPage = this.AuthorityRole = false;
      let IdList = [];
      data.map(item => {
        return IdList.push(item.id);
      });
      console.log(data, id, IdList, 5555555555);
      API.saveAuthorityRole(IdList, Number(id))
        .then(() => {
          this.$message({
            type: "success",
            message: "保存成功!"
          });
        })
        .catch(() => {
          this.$message.error("保存失败!");
        });
    },
    Authoritycancel() {
      this.addPage = this.editPage = this.AuthorityRole = false;
      this.$forceUpdate();
    }
  },

  mounted() {
    this.submitForm();
  }
};
</script>

<style lang="stylus">
.roleTable {
  .el-pagination.is-background {
    text-align: right;
    margin-top: 20px;
  }

  .topform {
    width: 100%;
    display: flex;

    .top1 {
      flex: 2;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .el-form-item {
        flex-shrink: 0;
      }
    }
  }

  .search-reset {
    display: flex;

    .button {
      margin-left: 20px;
      height: 32px;
    }
  }
}
</style>
