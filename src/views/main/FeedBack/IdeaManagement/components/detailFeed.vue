<template>
  <div class="Feedslist">
    <div class="detailTop">
      <div class="left">
           <div>
            <span>微信昵称:</span>
            {{data.wxNickname}}
           </div>
          <div>
            <span>用户身份:</span>
            {{data.roleName}}
          </div>
          <div>
            <span>反馈时间:</span>
            {{data.createTime}}
          </div>
      </div>
      <div class="right">
        <div>
          <div>
            <span>用户姓名:</span>
            {{data.userName}}
          </div>
          <div>
            <span>手机号:</span>
            {{data.phone}}
          </div>
        </div>
      </div>
    </div>
    <div class="detailBottom">
      <div class="uls">
        <div class="content">
          <span style="display:inlineBlock;width:80px">反馈内容:</span>
          <div class="content">{{data.feedbackContent}}</div>
        </div>
      </div>
      <div class="img-container">
        <img
          v-for="(item,index) in data.feedbackImages"
          @click="handclick(index)"
          :key="index"
          :src="item"
          alt
          class="img"
        />
      </div>
    </div>
    <div class="btns">
      <el-button @click="()=>{this.$emit('cancel')}">取消</el-button>
    </div>
    <el-dialog width="30%" :visible.sync="innerVisible" append-to-body>
      <div class="imgBig">
        <img :src="img" style="width:300px;height:300px;marginLeft:100px" class="img" alt="就诊记录" />
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
          wxNickname: "",
          roleName: "",
          createTime: "",
          userName: "",
          phone: "",
          feedbackContent: "",
          feedbackImages: []
        };
      }
    }
  },
  data() {
    return {
      data: this.project,
      i: 0,
      active: -1,
      innerVisible: false,
      img: ""
    };
  },
  methods: {
    handclick(index) {
      this.img = this.data.feedbackImages[index];
      this.innerVisible = true;
    }
  },
  mounted() {}
};
</script>

<style lang='stylus'>
.Feedslist {
  width 100%;
  height 100%;
  .detailTop {
    display: flex;
    .left{
      flex:1;
        div span{
          display inline-block;
          padding-right 15px;
          height 30px;
          line-height 30px;
        }
    }
    .right{
      flex:1;
       div span{
          display inline-block;
          padding-right 15px;
          height 30px;
          line-height 30px;
        }
    }
  }
  .detailBottom {
    .uls{
      margin-bottom :20px;
      .content{
        display flex;
      }
    }
  }

  .img-container {
    display: flex;
    margin-left: 40px;

    .img {
      width: 50px;
      height: 50px;
      margin-right: 20px;
    }
  }

  .btns {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .el-dialog__body {
    width: 500px;
    height: 500px;

    .imgBig {
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