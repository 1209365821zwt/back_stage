<template>
  <div class="addoffice">
    <el-form :model="form" ref="form" :rules="rules">
      <el-form-item label="科室名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入" maxlength="30"></el-input>
      </el-form-item>
    </el-form>
    <div class="btns">
      <el-button size="small" @click="save('form')">保存</el-button>
      <el-button size="small" @click="  () => {this.$emit('cancel')  }">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      default: () => {
        return {
          name: ""
        };
      }
    }
  },
  data() {
    return {
      form: this.project,
      rules: {
        name: [
          {
            required: true,
            message: "名称不能为空"
          }
        ]
      }
    };
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("save", this.form);
        } else {
          this.$message({
            type: "warning",
            message: "请补全信息"
          });
        }
      });
    }
  },
  created() {
    console.log(this.form);
  }
};
</script>

<style lang="stylus">
.addoffice {
  width: 100%;
  height: 100%;

  .el-form {
    display: flex;
    justify-content: center;

    .el-form-item {
      display: flex;
    }
  }

  .btns {
    display: flex;
    justify-content: center;
  }
}
</style>