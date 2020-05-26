<template>
  <div class="feedback">
    <div class="top">
      <el-form :model="form" ref="form">
        <el-form-item label="用户姓名:" prop="userName">
          <el-input placeholder="请输入" v-model="form.userName" clearable></el-input>
        </el-form-item>
        <el-form-item label="反馈时间：">
          <el-date-picker
            v-model="form.createTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="query-reset">
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
                <el-button type="text" @click="dialogFormVisible(scope.row)">查看</el-button>
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
        <detailFeed v-if="addPage" @cancel="closeAdd" :project="project"></detailFeed>
      </el-dialog>
      <VPagination :pageSize="page.pageSize" :page="page.page" :total="page.total" @change="reload"></VPagination>
    </div>
  </div>
</template>

<script>
import detailFeed from "./detailFeed";
// import { formatDate } from "@/utils/common";
import { pageList } from "@/api/feedback";
export default {
  components: {
    detailFeed
  },
  data() {
    return {
      addPage: false,
      dialogTitle: "查看数据",
      loading: false,
      tableData: [],
      form: {
        userName: "",
        createTime: ""
      },
      page: {
        page: 1,
        pageSize: 5,
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
          label: "微信昵称",
          name: "wxNickname"
        },
        {
          label: "用户姓名",
          name: "userName"
        },
        {
          label: "用户身份",
          name: "roleName"
        },
        {
          label: "手机号",
          name: "phone"
        },
        {
          label: "反馈时间",
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
    //编辑
    dialogFormVisible(data) {
      console.log(data);
      this.addPage = true;
      this.project = data;
    },
    //查询
    query() {
      this.page.page = 1;
      this.submitForm();
    },
    //重置
    reset(formName) {
      this.page.page = 1;
      console.log(this.$refs[formName].resetFields());
      this.$refs[formName].resetFields();
      this.form.createTime = [];
    },
    //查询获取列表
    submitForm() {
      const range = this.form.createTime;
      console.log(range);
      if (range && range.length > 0) {
        range[0] = range[0] ? range[0] : null;
        range[1] = range[1] ? range[1] : null;
        // if (Object.prototype.toString.call() === '[object Date]') {
        //     range[0] = range[0] ? formatDate(range[0],'yyyy-MM-dd HH-mm-ss') : null;
        //     range[1] = range[1] ? formatDate(range[1],'yyyy-MM-dd HH-mm-ss') : null;
        // }
      }
      console.log(this.form.userName, range[0], range[1], "查询");
      this.loadingTable = true;
      // eslint-disable-next-line no-unused-vars
      let param = {};
      param = {
        current: this.page.page,
        size: this.page.pageSize,
        endTime: range[1] ? range[1] : null,
        startTime: range[0] ? range[0] : null,
        userName: this.form.userName ? this.form.userName : null
      };
      pageList(param)
        .then(res => {
          console.log(res, "feed");
          this.tableData = res ? res.records : [];
          this.page.total = res ? res.total : 0;
          this.loadingTable = false;
        })
        .catch((error) => {
          console.log(error)
          this.loadingTable = false;
        });
    }
  }
};
</script>

<style lang='stylus'>
.feedback {
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