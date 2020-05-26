<template>
  <div class="mainInject">
    <div class="main">
      <div class="left">
        <ul>
          <li>
            <span>患者姓名:</span>
            {{data.patientName}}
          </li>
          <li>
            <span>随访医院:</span>
            {{data.hciName}}
          </li>
          <li>
            <span>随访医生:</span>
            {{data.hcpName}}
          </li>
          <li>
            <span>注射次数:</span>
            第{{data.injectionNum}}次
          </li>
          <li>
            <span>注射部位:</span>
            {{data.injectionPositionStr}}
          </li>
          <li>
            <span>患者感受:</span>
            {{data.patFeel}}
          </li>
        </ul>
      </div>
      <div class="right">
        <ul>
          <li>
            <span>患者手机号:</span>
            {{data.phone}}
          </li>
          <li>
            <span>随访科室:</span>
            {{data.departmentName}}
          </li>
          <li>
            <span>本次注射时间:</span>
            {{data.injectionTime}}
          </li>
          <li class="record">
            <span>就诊记录:</span>
            <div class="imgs">
              <img
                v-for="item in data.visitRecordsAry"
                :key="item"
                :src="item"
                class="img"
                @click="handClick(item)"
              />
            </div>
          </li>
          <li>
            <span>下次注射时间:</span>
            {{data.nextInjectionTime}}
          </li>
        </ul>
      </div>
    </div>
    <div class="btns">
      <el-button type="small" @click="()=>{this.$emit('cancel')}">关闭</el-button>
    </div>
    <el-dialog width="30%" :visible.sync="innerVisible" append-to-body>
      <div class="img-container">
        <img
          :src="src"
          style="width:300px;height:300px;marginLeft:100px"
          class="active img"
          alt="就诊记录"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      default: () => {
        return {
          patientName: "",
          hciName: "",
          hcpName: "",
          injectionNum: "",
          patFeel: "",
          injectionPositionStr: "",
          phone: "",
          departmentName: "",
          injectionTime: "",
          visitRecordsAry: [],
          nextInjectionTime: ""
        };
      }
    }
  },
  data() {
    return {
      data: this.project,
      active: -1,
      src: "",
      innerVisible: false
    };
  },
  methods: {
    handClick(item) {
      this.innerVisible = true;
      this.src = item;
    }
  },
  mounted() {
    // this.handClick()
    // const _this = this;
    // document.addEventListener('click',(e)=>{
    //     if(e.target.className.indexOf('img')){
    //         _this.active=-1;
    //     }
    // })
  }
};
</script>

<style lang='stylus'>
.mainInject {
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

        .imgs {
          display: flex;
          justify-content: space-around;

          img {
            width: 50px;
            height: 50px;
            margin-right: 15px;
          }
        }
      }
    }
  }

  .btns {
    display: flex;
    justify-content: center;
  }

  .el-dialog__body {
    width: 500px;
    height: 500px;

    .img-container {
      width: 300px;
      height: 300px;

      .img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>