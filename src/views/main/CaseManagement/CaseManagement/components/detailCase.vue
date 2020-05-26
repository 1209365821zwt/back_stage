<template>
  <div class="mainDetail">
    <div class="main">
      <div class="left">
        <ul>
          <li>
            <span>微信昵称:</span>
            {{data.nickname}}
          </li>
          <li class="imgs">
            <span>微信头像:</span>
            <img :src="data.headPortrait" alt />
          </li>
          <li>
            <span>患者姓名:</span>
            {{data.patientName}}
          </li>
          <li>
            <span>患者手机号:</span>
            {{data.phone}}
          </li>
          <li>
            <span>拜访医院:</span>
            {{data.hciName}}
          </li>
          <li>
            <span>拜访医生:</span>
            {{data.hcpName}}
          </li>
        </ul>
      </div>
      <div class="right">
        <ul>
          <li>
            <span>是否加入随访:</span>
            {{data.followName}}
          </li>
          <li>
            <span>性别:</span>
            {{data.genderName}}
          </li>
          <li>
            <span>加入随访时间:</span>
            {{data.followTime}}
          </li>
          <li>
            <span>随访科室:</span>
            {{data.departmentName}}
          </li>
        </ul>
      </div>
    </div>
    <div class="btns">
      <el-button type="small" @click="()=>{this.$emit('cancel')}">关闭</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      return: () => {
        return {
          nickname: "",
          headPortrait: "",
          patientName: "",
          phone: "",
          hciName: "",
          hcpName: "",
          followName: "",
          genderName: "",
          followTime: "",
          departmentName: ""
        };
      }
    }
  },
  data() {
    return {
      data: this.project
    };
  },
  mounted() {
    console.log(this.data);
  }
};
</script>

<style lang='stylus'>
.mainDetail {
  .main {
    display: flex;

    .left {
      flex: 1;

      ul {
        list-style: none;

        li {
          display: flex;
          margin-bottom: 10px;

          span {
            width: 80px;
          }
        }
      }

      .imgs {
        img {
          width: 50px;
          height: 50px;
        }
      }
    }

    .right {
      flex: 1;

      ul {
        list-style: none;

        li {
          margin-bottom: 10px;
          display: flex;

          span {
            width: 100px;
          }
        }
      }
    }
  }

  .btns {
    display: flex;
    justify-content: center;
  }
}
</style>