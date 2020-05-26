<template>
    <div class="v-header">
        <h1 class="title">针无忧后台管理系统</h1>
         <div class="r-btns"> 

          <span> <i class="icon user el-icon-user"></i> {{userInfo.userName}}</span>
          <span class="icon logout" @click="logout"><i class="el-icon-switch-button"></i>注销</span>
        </div>
    </div>
</template>
<script>
import { logout } from '@/api/login';
import {logoutAccount} from '@/utils/common';
export default {
    props: {
        userInfo: {
            type: Object,
            default: () => {
                return { userName: "", userId: ""};
            }
        }
    },
    data() {
        return {
        };
    },
    mounted() {
    },
    created(){
        console.log(this.userInfo)
    },
    methods: {
        logout(){
            console.log(11111)
            logout().then(() => {
                logoutAccount();
                this.$router.push('/login')
            });
        },
    }
};
</script>

<style lang="stylus" scoped>
.v-header {
    width: 100%;
    height: 60px;
    background: #011e3c;
    color: #fff;
    border-bottom: solid 1px #011e3c;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;

    .el-icon-switch-button, .el-icon-user {
        font-size: 17px;
        font-weight: 900;
        margin-right: 8px;
        margin-left: 20px;
    }
     .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}
</style>
